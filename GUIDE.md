# 📖 Guide d'Utilisation - My Tech Watch Blog

Ce guide vous explique comment utiliser efficacement votre blog technique.

## 📝 Table des Matières

1. [Installation et Configuration](#installation-et-configuration)
2. [Créer du Contenu](#créer-du-contenu)
3. [Organisation du Contenu](#organisation-du-contenu)
4. [Personnalisation](#personnalisation)
5. [Déploiement](#déploiement)
6. [Workflow Recommandé](#workflow-recommandé)

## Installation et Configuration

### 1. Installation Initiale

\`\`\`bash
# Cloner le projet
git clone <votre-repo>
cd my-tech-watch-blog

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Lancer en développement
npm run dev
\`\`\`

### 2. Configuration de Base

Éditez les fichiers suivants pour personnaliser votre blog :

**messages/fr.json et messages/en.json**
- Modifiez les traductions selon vos besoins
- Personnalisez les textes du footer avec vos informations

**next.config.js**
- Configurez votre domaine si nécessaire
- Ajoutez des domaines d'images autorisés

**.env**
- Ajoutez votre URL de site
- Configurez Google Analytics si souhaité

## Créer du Contenu

### Méthode 1 : Avec les Scripts (Recommandé)

#### Créer un Article de Blog

\`\`\`bash
npm run new:article
\`\`\`

Le script vous posera les questions suivantes :
- Titre de l'article
- Description courte
- Catégorie (cloud/devops/backend/networking/ai-data/emerging-tech)
- Tags (séparés par des virgules)
- Difficulté (beginner/intermediate/advanced)
- Langue (fr/en)
- Série (optionnel)
- Repo GitHub (optionnel)

Un fichier sera créé automatiquement dans \`content/blog/[categorie]/[slug].md\`

#### Créer un Lab

\`\`\`bash
npm run new:lab
\`\`\`

Questions supplémentaires :
- Durée estimée (ex: "2 heures")
- Prérequis (séparés par des virgules)

Fichier créé dans \`content/labs/[categorie]/[slug].md\`

#### Créer un Projet

\`\`\`bash
npm run new:project
\`\`\`

Questions supplémentaires :
- Stack technique (séparée par des virgules)
- Statut (inProgress/completed/archived)
- URL de démo (optionnel)

Fichier créé dans \`content/projects/[categorie]/[slug].md\`

### Méthode 2 : Manuellement

1. Créez un fichier dans le bon dossier :
   - \`content/blog/[categorie]/mon-article.md\`
   - \`content/labs/[categorie]/mon-lab.md\`
   - \`content/projects/[categorie]/mon-projet.md\`

2. Ajoutez le frontmatter :

\`\`\`yaml
---
title: "Mon Article"
description: "Description"
date: "2025-11-24"
lastModified: "2025-11-24"
author: "Votre Nom"
category: "cloud"
tags: ["tag1", "tag2"]
difficulty: "intermediate"
language: "fr"
published: true
featured: false
---
\`\`\`

3. Écrivez votre contenu en Markdown

## Organisation du Contenu

### Structure des Dossiers

\`\`\`
content/
├── blog/                    # Articles de blog
│   ├── cloud/              # Articles sur le cloud
│   ├── devops/             # Articles DevOps
│   ├── backend/            # Articles backend
│   ├── networking/         # Articles réseau
│   ├── ai-data/            # Articles IA/Data
│   └── emerging-tech/      # Technologies émergentes
├── labs/                   # Travaux pratiques
│   └── [mêmes catégories]
└── projects/               # Projets portfolio
    └── [mêmes catégories]
\`\`\`

### Catégories Disponibles

| Catégorie | Description | Exemples de sujets |
|-----------|-------------|-------------------|
| \`cloud\` | Cloud Computing | AWS, GCP, Azure, Kubernetes, Terraform |
| \`devops\` | DevOps & CI/CD | Docker, Jenkins, GitLab CI, Ansible |
| \`backend\` | Backend Development | Node.js, Python, Go, APIs REST/GraphQL |
| \`networking\` | Réseau & Sécurité | TCP/IP, DNS, VPN, Firewalls, SSL/TLS |
| \`ai-data\` | IA & Data Science | ML, DL, TensorFlow, PyTorch, Pandas |
| \`emerging-tech\` | Tech Émergentes | Blockchain, IoT, Edge Computing, Web3 |

### Niveaux de Difficulté

- \`beginner\` : Pour débuter sur un sujet
- \`intermediate\` : Nécessite des bases
- \`advanced\` : Pour utilisateurs expérimentés

### Créer une Série d'Articles

Pour créer une série comme "Kubernetes Mastery" :

1. Créez le premier article avec :
\`\`\`yaml
series: "kubernetes-mastery"
seriesOrder: 1
\`\`\`

2. Créez les articles suivants avec :
\`\`\`yaml
series: "kubernetes-mastery"
seriesOrder: 2
\`\`\`

Le blog affichera automatiquement la navigation entre articles de la série.

## Personnalisation

### Modifier les Couleurs

Éditez \`tailwind.config.js\` :

\`\`\`javascript
colors: {
  primary: {
    50: '#eff6ff',
    // ... vos couleurs
  },
}
\`\`\`

### Modifier le Logo

1. Créez votre logo (format PNG/SVG)
2. Placez-le dans \`public/logo.png\`
3. Modifiez \`components/layout/Header.tsx\` :

\`\`\`tsx
<Image src="/logo.png" alt="Logo" width={40} height={40} />
\`\`\`

### Ajouter des Liens Sociaux

Éditez \`components/layout/Footer.tsx\` :

\`\`\`tsx
<a href="https://github.com/votreusername" ...>
<a href="https://linkedin.com/in/votreprofil" ...>
\`\`\`

### Modifier la Page "À Propos"

Créez/éditez \`app/[locale]/about/page.tsx\`

## Déploiement

### Option 1 : Vercel (Le plus simple)

1. Push votre code sur GitHub
2. Importez le projet sur [Vercel](https://vercel.com)
3. Déployé automatiquement ! ✅

### Option 2 : GCP Cloud Run (Recommandé)

Suivez le guide détaillé : [DEPLOY_GCP.md](./DEPLOY_GCP.md)

\`\`\`bash
# Déploiement manuel
gcloud run deploy my-tech-watch-blog \
    --source . \
    --platform managed \
    --region europe-west1 \
    --allow-unauthenticated
\`\`\`

### Option 3 : Docker sur VPS

\`\`\`bash
# Sur votre serveur
git clone <votre-repo>
cd my-tech-watch-blog
docker-compose up -d
\`\`\`

Configurez Nginx comme reverse proxy :

\`\`\`nginx
server {
    listen 80;
    server_name blog.votredomaine.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\`

## Workflow Recommandé

### 1. Après un Lab ou Projet

\`\`\`bash
# 1. Créer le contenu
npm run new:lab  # ou new:project

# 2. Rédiger le contenu
# Ouvrez le fichier généré dans votre éditeur

# 3. Prévisualiser
npm run dev
# Ouvrez http://localhost:3000

# 4. Commit et push
git add .
git commit -m "feat: add kubernetes networking lab"
git push

# 5. Déploiement automatique via CI/CD
# Le GitHub Action se déclenche et déploie sur GCP
\`\`\`

### 2. Écriture Régulière

**Fréquence recommandée :**
- 1-2 articles/labs par semaine minimum
- Documentez immédiatement après avoir terminé un lab
- Profitez que c'est frais dans votre esprit !

**Template Mental :**
1. **Objectif** : Qu'ai-je appris/construit ?
2. **Concepts** : Quelles notions importantes ?
3. **Implémentation** : Comment je l'ai fait étape par étape
4. **Problèmes** : Quelles difficultés rencontrées ?
5. **Leçons** : Qu'est-ce que je retiens ?
6. **Ressources** : Liens vers code, docs

### 3. Organisation des Brouillons

Vous pouvez garder des brouillons en mettant :
\`\`\`yaml
published: false
\`\`\`

Ils ne seront pas affichés sur le blog mais restent dans votre repo.

### 4. Optimisation SEO

Pour chaque article :
- ✅ Description claire et concise
- ✅ Tags pertinents
- ✅ Titre accrocheur
- ✅ Liens vers GitHub
- ✅ Images optimisées

## Astuces et Best Practices

### Markdown

Utilisez ces fonctionnalités :

\`\`\`markdown
# Titre H1
## Titre H2

**Gras** et *italique*

\`code inline\`

\`\`\`language
code block
\`\`\`

> Citation

- Liste
- À puces

1. Liste
2. Numérotée

[Lien](https://url.com)

![Image](https://url.com/image.png)
\`\`\`

### Code Blocks

Spécifiez toujours le langage pour le syntax highlighting :

\`\`\`typescript
// Code TypeScript
const example = "hello";
\`\`\`

### Images

Placez vos images dans \`public/images/[categorie]/[article]/\`

Référencez-les ainsi :
\`\`\`markdown
![Description](/images/cloud/kubernetes-intro/architecture.png)
\`\`\`

### Performance

- Utilisez des images optimisées (WebP si possible)
- Limitez les GIFs animés
- Préférez les diagrammes en SVG

## Support

Si vous rencontrez des problèmes :

1. Consultez les [Issues GitHub](https://github.com/yourusername/repo/issues)
2. Créez une nouvelle issue avec :
   - Description du problème
   - Logs d'erreur
   - Étapes pour reproduire

---

Bon blogging ! 🚀
