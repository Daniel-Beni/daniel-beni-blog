---
title: "Introduction à Kubernetes : Déployer votre première application"
description: "Découvrez les concepts fondamentaux de Kubernetes et déployez votre première application conteneurisée sur un cluster local"
date: "2025-11-24"
lastModified: "2025-11-24"
author: "Daniel Beni Niyobuzima"
category: "cloud"
tags: ["kubernetes", "docker", "devops", "containers", "orchestration"]
series: "kubernetes-mastery"
seriesOrder: 1
difficulty: "beginner"
githubRepo: "https://github.com/yourusername/k8s-intro"
language: "fr"
published: true
featured: true
---

# Introduction à Kubernetes : Déployer votre première application

## 🎯 Objectif

Dans cet article, nous allons découvrir les concepts fondamentaux de Kubernetes et déployer une première application conteneurisée. À la fin de ce tutoriel, vous saurez :

- Comprendre l'architecture de base de Kubernetes
- Installer un cluster Kubernetes local avec Minikube
- Déployer une application simple
- Exposer votre application au monde extérieur
- Scaler votre application

## 📚 Concepts Clés

### Qu'est-ce que Kubernetes ?

Kubernetes (K8s) est une plateforme open-source d'orchestration de conteneurs qui automatise le déploiement, la mise à l'échelle et la gestion d'applications conteneurisées.

### Architecture Kubernetes

- **Cluster** : Ensemble de machines (nodes) exécutant des applications conteneurisées
- **Node** : Machine physique ou virtuelle dans le cluster
- **Pod** : Plus petite unité déployable dans K8s, contient un ou plusieurs conteneurs
- **Deployment** : Définit l'état désiré de vos Pods
- **Service** : Expose votre application réseau
- **Namespace** : Isolation logique des ressources

## 🔧 Implémentation

### Étape 1 : Installation de Minikube

Minikube est un outil qui permet d'exécuter Kubernetes localement.

\`\`\`bash
# Sur macOS
brew install minikube

# Sur Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Sur Windows (avec Chocolatey)
choco install minikube

# Vérifier l'installation
minikube version
\`\`\`

### Étape 2 : Démarrer un cluster Kubernetes

\`\`\`bash
# Démarrer Minikube
minikube start --driver=docker

# Vérifier le statut
minikube status

# Vérifier les nodes
kubectl get nodes
\`\`\`

**Résultat attendu :**
\`\`\`
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   1m    v1.28.3
\`\`\`

### Étape 3 : Créer notre première application

Créons un fichier de déploiement pour une application Nginx.

\`\`\`yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
\`\`\`

Déployons cette application :

\`\`\`bash
# Appliquer le déploiement
kubectl apply -f deployment.yaml

# Vérifier les déploiements
kubectl get deployments

# Vérifier les pods
kubectl get pods
\`\`\`

### Étape 4 : Exposer l'application

Créons un Service pour exposer notre application :

\`\`\`yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
\`\`\`

\`\`\`bash
# Appliquer le service
kubectl apply -f service.yaml

# Vérifier le service
kubectl get services

# Accéder à l'application (avec Minikube)
minikube service nginx-service
\`\`\`

### Étape 5 : Scaler l'application

\`\`\`bash
# Augmenter le nombre de réplicas
kubectl scale deployment nginx-deployment --replicas=5

# Vérifier le scaling
kubectl get pods

# Revenir à 3 réplicas
kubectl scale deployment nginx-deployment --replicas=3
\`\`\`

## 🧪 Tests et Validation

### Test 1 : Vérifier que tous les pods sont running

\`\`\`bash
kubectl get pods -o wide
\`\`\`

**Résultat attendu :**
Tous les pods doivent avoir le statut `Running`

### Test 2 : Accéder à l'application

\`\`\`bash
# Obtenir l'URL du service
minikube service nginx-service --url

# Tester avec curl
curl $(minikube service nginx-service --url)
\`\`\`

Vous devriez voir la page d'accueil par défaut de Nginx.

## 💡 Leçons Apprises

- **Déclaratif vs Impératif** : Kubernetes utilise une approche déclarative où vous définissez l'état désiré, et K8s se charge de l'atteindre
- **Self-healing** : Si un Pod tombe, Kubernetes le redémarre automatiquement
- **Scalabilité** : Scaler une application est aussi simple qu'une commande
- **Isolation** : Les Namespaces permettent d'isoler les ressources par environnement (dev, staging, prod)
- **Load Balancing** : Le Service distribue automatiquement le trafic entre les Pods

## 🚧 Commandes Utiles

\`\`\`bash
# Voir les logs d'un pod
kubectl logs <pod-name>

# Exécuter une commande dans un pod
kubectl exec -it <pod-name> -- /bin/bash

# Décrire une ressource
kubectl describe pod <pod-name>

# Supprimer une ressource
kubectl delete deployment nginx-deployment
kubectl delete service nginx-service

# Nettoyer tout
kubectl delete all --all
\`\`\`

## 🔗 Ressources

- [Code source sur GitHub](https://github.com/yourusername/k8s-intro)
- [Documentation officielle Kubernetes](https://kubernetes.io/docs/)
- [Kubernetes Patterns](https://www.oreilly.com/library/view/kubernetes-patterns/9781492050278/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)

## 🚀 Prochaines Étapes

Dans le prochain article de cette série, nous verrons :

- Les ConfigMaps et Secrets pour gérer la configuration
- Les Persistent Volumes pour le stockage
- Les Ingress pour le routage HTTP avancé
- Le monitoring avec Prometheus et Grafana

Restez à l'écoute pour la **Partie 2 : Configuration et Stockage dans Kubernetes** !
