---
title: "Docker pour les développeurs : Guide complet 2025"
description: "Maîtrisez Docker de A à Z : conteneurisation, images, volumes, réseaux et docker-compose pour vos projets de développement"
date: "2025-11-23"
lastModified: "2025-11-23"
author: "Daniel Beni Niyobuzima"
category: "devops"
tags: ["docker", "containers", "devops", "microservices"]
difficulty: "intermediate"
githubRepo: "https://github.com/yourusername/docker-guide"
language: "fr"
published: true
featured: false
---

# Docker pour les développeurs : Guide complet 2025

## 🎯 Objectif

Ce guide vous apprendra à utiliser Docker efficacement dans vos projets de développement, de la conteneurisation d'applications simples à l'orchestration multi-conteneurs avec Docker Compose.

## 📚 Concepts Clés

### Pourquoi Docker ?

- **Portabilité** : "Works on my machine" devient "Works everywhere"
- **Isolation** : Chaque conteneur a son propre environnement
- **Efficacité** : Plus léger que les VMs
- **Reproductibilité** : Environnements identiques du dev à la prod

### Concepts Fondamentaux

- **Image** : Template en lecture seule contenant tout le nécessaire pour exécuter une application
- **Container** : Instance d'une image en cours d'exécution
- **Volume** : Stockage persistant pour les données
- **Network** : Communication entre conteneurs
- **Dockerfile** : Fichier de définition d'une image

## 🔧 Implémentation

### Étape 1 : Création d'un Dockerfile

Créons une application Node.js simple :

\`\`\`dockerfile
# Utiliser l'image officielle Node.js
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
\`\`\`

### Étape 2 : Build et Run

\`\`\`bash
# Builder l'image
docker build -t my-node-app:1.0 .

# Lister les images
docker images

# Exécuter le conteneur
docker run -d -p 3000:3000 --name my-app my-node-app:1.0

# Vérifier les conteneurs en cours
docker ps

# Voir les logs
docker logs my-app

# Arrêter le conteneur
docker stop my-app

# Supprimer le conteneur
docker rm my-app
\`\`\`

### Étape 3 : Utilisation des Volumes

\`\`\`bash
# Créer un volume
docker volume create app-data

# Monter un volume
docker run -d \
  --name my-app \
  -p 3000:3000 \
  -v app-data:/app/data \
  my-node-app:1.0

# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect app-data
\`\`\`

### Étape 4 : Docker Compose

Créons un stack complet avec une base de données :

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/mydb
    depends_on:
      - db
    volumes:
      - ./src:/app/src
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    networks:
      - app-network

volumes:
  postgres-data:

networks:
  app-network:
    driver: bridge
\`\`\`

\`\`\`bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
\`\`\`

### Étape 5 : Optimisation des Images

**Dockerfile optimisé avec multi-stage build :**

\`\`\`dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

**Avantages :**
- Image finale plus petite
- Pas d'outils de build dans l'image de production
- Meilleure sécurité

## 💡 Bonnes Pratiques

### 1. .dockerignore

\`\`\`
node_modules
npm-debug.log
.git
.env
.DS_Store
dist
coverage
\`\`\`

### 2. Gestion des secrets

\`\`\`bash
# Utiliser des variables d'environnement
docker run -e DATABASE_URL=\${DATABASE_URL} my-app

# Ou avec un fichier .env
docker run --env-file .env my-app
\`\`\`

### 3. Health checks

\`\`\`dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js
\`\`\`

### 4. Nettoyage

\`\`\`bash
# Supprimer les conteneurs arrêtés
docker container prune

# Supprimer les images non utilisées
docker image prune -a

# Supprimer les volumes non utilisés
docker volume prune

# Tout nettoyer
docker system prune -a --volumes
\`\`\`

## 🧪 Commandes Essentielles

\`\`\`bash
# Exécuter une commande dans un conteneur
docker exec -it my-app /bin/sh

# Copier des fichiers
docker cp my-app:/app/data.json ./local-data.json

# Inspecter un conteneur
docker inspect my-app

# Voir les statistiques en temps réel
docker stats

# Sauvegarder une image
docker save my-app:1.0 > my-app.tar

# Charger une image
docker load < my-app.tar
\`\`\`

## 🚧 Dépannage Commun

### Problème : Conteneur qui redémarre en boucle

\`\`\`bash
# Voir les logs
docker logs --tail 100 my-app

# Inspecter pour voir l'erreur
docker inspect my-app | grep -A 10 State
\`\`\`

### Problème : Port déjà utilisé

\`\`\`bash
# Trouver qui utilise le port
lsof -i :3000

# Ou avec netstat
netstat -tulpn | grep :3000
\`\`\`

### Problème : Espace disque

\`\`\`bash
# Voir l'utilisation
docker system df

# Nettoyer
docker system prune -a --volumes
\`\`\`

## 🔗 Ressources

- [Code source sur GitHub](https://github.com/yourusername/docker-guide)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🚀 Prochaines Étapes

Pour aller plus loin :
- Apprendre Kubernetes pour l'orchestration à grande échelle
- Explorer Docker Swarm
- Mettre en place une CI/CD avec Docker
- Sécuriser vos images avec vulnerability scanning
