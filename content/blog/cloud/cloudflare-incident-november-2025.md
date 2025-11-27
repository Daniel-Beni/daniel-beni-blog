---
title: "Post-Mortem Cloudflare : Quand un Fichier de Configuration Double de Taille"
description: "Analyse technique de la panne Cloudflare du 18 novembre 2025 causée par un changement de permissions ClickHouse - Leçons sur la résilience des systèmes distribués"
date: "2024-11-27"
lastModified: "2024-11-27"
author: "Daniel Beni Niyobuzima"
category: "cloud"
tags: ["cloudflare", "clickhouse", "incident", "post-mortem", "bot-management"]
difficulty: "intermediate"
language: "fr"
published: true
featured: true
---

# Post-Mortem Cloudflare : Quand un Fichier de Configuration Double de Taille

Le 18 novembre 2025, Cloudflare a connu sa pire panne depuis 2019, affectant les services CDN, WAF, Workers et Access pendant près de 6 heures. Contrairement aux apparences initiales, ce n'était ni une cyberattaque ni un problème réseau BGP, mais un changement apparemment anodin dans les permissions d'une base de données ClickHouse.

## 🔴 Chronologie de l'Incident

| Heure (UTC) | Événement |
|-------------|-----------|
| **11:05** | Déploiement du changement de permissions ClickHouse |
| **11:28** | Début de la panne - Premières erreurs 5xx |
| **11:35** | Création de l'incident call |
| **13:05** | Mise en place de bypasses pour Workers KV et Access |
| **14:30** | Résolution principale - Déploiement du bon fichier |
| **17:06** | Tous les services restaurés |

**Durée totale : ~6 heures**

### Impact

- **Services principaux down** : CDN, WAF, Bot Management
- **Services partiellement affectés** : Workers KV, Access, Dashboard
- **Taux d'erreur** : Pic massif de codes HTTP 5xx
- **Utilisateurs impactés** : Millions à travers le monde

---

## 🔍 Cause Racine : Un Changement de Permissions ClickHouse

### Le Système Affecté

Cloudflare utilise **ClickHouse** pour générer un fichier de configuration pour son système **Bot Management**. Ce fichier contient des "features" (caractéristiques) utilisées par un modèle de machine learning pour détecter les bots.

**Fonctionnement normal :**
```
ClickHouse Query
    ↓
Génère fichier de features (~60 features)
    ↓
Déploie toutes les 5 minutes sur le réseau global
    ↓
Bot Management utilise les features pour scorer le trafic
```

### Architecture ClickHouse

```yaml
ClickHouse Cluster:
  - Database: default (tables distribuées)
  - Database: r0 (tables sous-jacentes par shard)
  
Requêtes distribuées:
  - Via compte système partagé
  - Accès implicite à r0 (invisible aux utilisateurs)
```

### Le Changement Fatal

À **11:05 UTC**, Cloudflare a déployé un changement pour **améliorer la sécurité** :

**Objectif** : Rendre l'accès aux tables `r0` explicite (au lieu d'implicite)

**Bénéfice attendu** : 
- Meilleure gestion des permissions
- Limites par requête plus granulaires
- Meilleure visibilité pour les utilisateurs

**Problème imprévu** : Une requête critique n'était **pas filtrée par database** :

```sql
-- Requête utilisée pour générer le fichier de features
SELECT name, type
FROM system.columns
WHERE table = 'http_requests_features'
ORDER BY name;
```

**Avant le changement :**
```
Retourne uniquement les colonnes de `default.http_requests_features`
→ ~60 features
```

**Après le changement :**
```
Retourne les colonnes de:
  - default.http_requests_features
  - r0.http_requests_features (sur chaque shard)
→ Plus de 200 features (duplicatas)
```

---

## 💥 La Cascade de Pannes

### 1. Limite de Taille Dépassée

Le proxy Cloudflare (FL2) a une **limite codée en dur** :

```rust
// Code Rust dans FL2
const MAX_FEATURES: usize = 200;

fn load_bot_features(file: &FeatureFile) -> Result<()> {
    if file.features.len() > MAX_FEATURES {
        return Err("Too many features"); // 🔥 PANIC ICI
    }
    // ...
}
```

**Pourquoi cette limite ?**
- Pré-allocation mémoire pour performance
- Éviter consommation mémoire non bornée
- Limite "safe" : 200 >> 60 features normaux

### 2. Panic Non Géré

```
thread fl2_worker_thread panicked: 
called Result::unwrap() on an Err value
```

**Résultat** : Le proxy crashe pour chaque requête utilisant Bot Management

### 3. Propagation Intermittente

Le cluster ClickHouse était mis à jour **progressivement** :

```
Toutes les 5 minutes :
  - Si requête hit un node MIS À JOUR → Mauvais fichier (>200 features)
  - Si requête hit un node NON MIS À JOUR → Bon fichier (~60 features)

Résultat : Système oscille entre "marche" et "ne marche pas"
```

Cette intermittence a **induit l'équipe en erreur** : ils ont cru à une attaque DDoS !

---

## 🎭 Les Fausses Pistes

### Piste 1 : Attaque DDoS

**Symptômes trompeurs :**
- Fluctuations rapides de disponibilité
- Le status page de Cloudflare (hébergé ailleurs) était aussi down (coïncidence)
- Ressemble aux récentes attaques Aisuru (15 Tbps)

**Message interne de l'équipe :**
```
11:35 - Incident Chat Room
"Could this be a continuation of recent Aisuru DDoS attacks?"
"Status page is down too - coordinated attack?"
```

### Piste 2 : Problème Workers KV

**Symptôme initial** : Workers KV montrait des erreurs élevées

**Action prise** : Mitigation sur Workers KV, limitation de comptes

**Réalité** : Workers KV était une **victime collatérale** (dépend du core proxy)

---

## 🛠️ La Résolution

### Étape 1 : Isolation (13:05)

```python
# Bypass du core proxy pour Workers KV et Access
# → Utiliser l'ancienne version du proxy (FL)

# Impact de FL vs FL2 :
# - FL2 : Panic → 5xx errors
# - FL  : Pas de panic, mais bot score = 0 pour tout le trafic
```

### Étape 2 : Identification (14:24)

```bash
# L'équipe identifie la cause :
1. Le fichier Bot Management est trop gros
2. Stopper la génération automatique
3. Tester un ancien fichier connu bon
```

### Étape 3 : Déploiement du Fix (14:30)

```bash
# 1. Stopper propagation du mauvais fichier
stop_bot_feature_generation()

# 2. Injecter manuellement un bon fichier
inject_known_good_file(version="11:00-UTC")

# 3. Forcer restart du core proxy
force_restart_core_proxy()
```

### Étape 4 : Restauration Complète (17:06)

- Redémarrage de tous les services downstream
- Retour à la normale du trafic
- Résolution du backlog de requêtes

---

## 💡 Leçons Techniques

### 1. Toujours Filtrer par Database

**Code problématique :**
```sql
SELECT name, type
FROM system.columns
WHERE table = 'http_requests_features'  -- ❌ Pas de filtre database
ORDER BY name;
```

**Code correct :**
```sql
SELECT name, type
FROM system.columns
WHERE 
    database = 'default' AND           -- ✅ Filtre explicite
    table = 'http_requests_features'
ORDER BY name;
```

### 2. Gérer les Erreurs Gracefully

**Code fragile (Rust) :**
```rust
let features = load_features(&file).unwrap();  // ❌ Panic si erreur
```

**Code robuste :**
```rust
let features = match load_features(&file) {
    Ok(f) => f,
    Err(e) => {
        log_error!("Failed to load features: {}", e);
        metrics::increment("bot_feature_load_error");
        
        // Fallback sur cache ou ancienne version
        return load_cached_features();
    }
};
```

### 3. Valider les Inputs, Même Internes

**Principe :**
```rust
// Ne JAMAIS assumer qu'un fichier généré en interne est valide

fn validate_feature_file(file: &FeatureFile) -> Result<()> {
    // Vérifications
    if file.features.len() > MAX_FEATURES {
        return Err("Too many features");
    }
    
    if file.features.len() == 0 {
        return Err("Empty feature file");
    }
    
    // Vérifier duplicates
    if has_duplicates(&file.features) {
        return Err("Duplicate features detected");
    }
    
    Ok(())
}

// Utiliser AVANT de propager
validate_feature_file(&file)?;
propagate_to_network(&file);
```

### 4. Canary Deployments

**Erreur de Cloudflare :**
```
Changement déployé graduellement sur le cluster ClickHouse
MAIS fichier propagé instantanément sur TOUT le réseau
```

**Meilleure approche :**
```python
def deploy_feature_file(file):
    # 1. Valider
    if not validate(file):
        raise ValueError("Invalid file")
    
    # 2. Deploy canary (1% du trafic)
    deploy_to_canary_nodes(file, percentage=0.01)
    
    # 3. Monitor 5 minutes
    if error_rate > threshold:
        rollback()
        return
    
    # 4. Deploy progressivement
    for percentage in [10, 25, 50, 100]:
        deploy_to_nodes(file, percentage)
        monitor(duration=300)  # 5 min
```

### 5. Kill Switches Globaux

**Ce que Cloudflare a annoncé :**
```yaml
# Global kill switches pour chaque feature
features:
  bot_management:
    kill_switch: true  # Désactive instantanément sur tout le réseau
    fallback: "allow_all"  # Comportement par défaut si désactivé
```

---

## 📊 Impact par Service

| Service | Impact | Cause |
|---------|--------|-------|
| **Core CDN** | 5xx errors | Core proxy panic |
| **Bot Management** | Score = 0 (FL) ou erreur (FL2) | Feature file invalid |
| **Workers KV** | 5xx errors élevés | Dépend du core proxy |
| **Cloudflare Access** | Auth failures | Dépend du core proxy |
| **Dashboard** | Indisponible (login) | Turnstile down + KV down |
| **Turnstile** | Failed to load | Core proxy down |
| **Email Security** | Perte IP reputation | Dépendance indirecte |

---

## 🎯 Actions Correctives de Cloudflare

### Court Terme

1. ✅ **Hardening de l'ingestion** des fichiers de config (traiter comme input utilisateur)
2. ✅ **Kill switches globaux** pour toutes les features
3. ✅ **Limiter les core dumps** pour éviter saturation CPU
4. ✅ **Revoir tous les failure modes** dans les modules du proxy

### Moyen Terme

- Tests de chaos engineering sur les configurations
- Validation automatique des fichiers avant propagation
- Monitoring de la taille des fichiers de config
- Alertes sur anomalies de métadonnées ClickHouse

### Long Terme

- Architecture plus résiliente avec fallbacks
- Isolation plus forte entre les modules
- Découplage des dépendances critiques

---

## 💭 Réflexions

### La Fragilité des Systèmes Complexes

```
Changement de permission "sécurité" 
    → Requête non filtrée retourne duplicatas
    → Fichier double de taille
    → Dépasse limite codée en dur
    → Panic non géré
    → Core proxy crash
    → 17% du web down
```

**Un seul maillon faible** dans une chaîne de 6 étapes.

### L'Importance des Limites

La limite de 200 features était là pour **protéger** (pré-allocation mémoire).

Mais elle est devenue un **point de défaillance** car :
- Pas de validation en amont
- Erreur non gérée gracefully
- Pas de fallback

**Leçon** : Les limites de sécurité doivent avoir des mécanismes de dégradation gracieuse.

### La Difficulté du Diagnostic

L'intermittence (bon fichier / mauvais fichier toutes les 5 min) a fait perdre **3 heures** à l'équipe.

**Leçon** : Les failures intermittents sont les plus durs à débugger.

---

## 🔗 Ressources

- [Post-Mortem Officiel Cloudflare](https://blog.cloudflare.com/18-november-2025-outage/)
- [Architecture FL2 Proxy](https://blog.cloudflare.com/20-percent-internet-upgrade/)
- [ClickHouse Documentation](https://clickhouse.com/docs)
- [Rust Error Handling Best Practices](https://doc.rust-lang.org/book/ch09-00-error-handling.html)

---

## 💬 Conclusion

Cette panne rappelle que dans les systèmes distribués à grande échelle :

1. **Aucun changement n'est anodin** - Un changement de permissions a causé 6h de panne
2. **Toujours filtrer explicitement** - Ne jamais assumer qu'une requête retournera ce qu'on attend
3. **Gérer les erreurs gracefully** - Un `unwrap()` peut faire tomber 17% du web
4. **Valider même l'input interne** - Traiter les configs internes comme des inputs externes
5. **Avoir des kill switches** - Pour désactiver rapidement une feature problématique

**Question pour vous** : Avez-vous des limites codées en dur dans votre code qui pourraient devenir des points de défaillance ? 🤔
