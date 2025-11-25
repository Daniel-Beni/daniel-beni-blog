# 🚀 My Tech Watch Blog - Version Améliorée

Blog technique personnel pour documenter mon apprentissage en Cloud Computing, DevOps, Backend Development, Networking et Intelligence Artificielle.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

## ✨ Fonctionnalités

- 📝 **Système de blog complet** avec support Markdown/MDX
- 🌐 **Multilingue** (Français/Anglais) avec next-intl
- 🎨 **Design moderne** et minimaliste avec Tailwind CSS
- 🌓 **Mode sombre/clair** automatique
- 🔍 **Recherche avancée** avec Fuse.js
- 🏷️ **Système de tags et catégories**
- 📊 **Séries d'articles** pour contenu structuré
- 💻 **Syntax highlighting** pour le code
- 📱 **Responsive** sur tous les appareils
- ⚡ **Performance optimisée** (score Lighthouse > 90)
- 🐳 **Docker ready** pour déploiement facile
- ☁️ **CI/CD** avec GitHub Actions vers GCP Cloud Run

## 📂 Structure du Projet

\`\`\`
my-tech-watch-blog/
├── app/                      # Application Next.js 14 (App Router)
│   ├── [locale]/            # Routes internationalisées
│   │   ├── blog/            # Articles de blog
│   │   ├── labs/            # Travaux pratiques
│   │   ├── projects/        # Portfolio projets
│   │   └── search/          # Recherche
│   └── globals.css          # Styles globaux
├── components/              # Composants React
│   ├── ui/                 # Composants UI réutilisables
│   ├── layout/             # Header, Footer, etc.
│   ├── blog/               # Composants spécifiques au blog
│   └── search/             # Composants de recherche
├── content/                # Contenu Markdown
│   ├── blog/              # Articles de blog
│   ├── labs/              # Labs techniques
│   └── projects/          # Projets portfolio
├── lib/                   # Bibliothèques utilitaires
│   ├── content.ts         # Gestion du contenu MDX
│   ├── search.ts          # Moteur de recherche
│   └── utils.ts           # Utilitaires généraux
├── messages/              # Traductions i18n
│   ├── fr.json           # Français
│   └── en.json           # Anglais
├── scripts/              # Scripts d'automatisation
│   ├── new-article.js    # Créer un nouvel article
│   ├── new-lab.js        # Créer un nouveau lab
│   └── new-project.js    # Créer un nouveau projet
├── types/                # Types TypeScript
├── .github/workflows/    # CI/CD GitHub Actions
├── docker-compose.yml    # Configuration Docker Compose
├── Dockerfile           # Configuration Docker
└── next.config.js       # Configuration Next.js
\`\`\`

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ et npm
- Docker (optionnel, pour le déploiement)
- Git

### Installation

1. **Cloner le repository**

\`\`\`bash
git clone https://github.com/yourusername/my-tech-watch-blog.git
cd my-tech-watch-blog
\`\`\`

2. **Installer les dépendances**

\`\`\`bash
npm install
\`\`\`

3. **Lancer le serveur de développement**

\`\`\`bash
npm run dev
\`\`\`

4. **Ouvrir dans le navigateur**

Accédez à [http://localhost:3000](http://localhost:3000)

## 📝 Créer du Contenu

### Créer un nouvel article

\`\`\`bash
npm run new:article
\`\`\`

Le script interactif vous guidera pour créer un article avec le template approprié.

### Créer un nouveau lab

\`\`\`bash
npm run new:lab
\`\`\`

### Créer un nouveau projet

\`\`\`bash
npm run new:project
\`\`\`

### Format du Frontmatter

Chaque fichier Markdown doit commencer par un frontmatter YAML :

\`\`\`yaml
---
title: "Titre de l'article"
description: "Description courte"
date: "2025-11-24"
lastModified: "2025-11-24"
author: "Daniel Beni Niyobuzima"
category: "cloud"
tags: ["kubernetes", "docker"]
series: "kubernetes-mastery"
seriesOrder: 1
difficulty: "intermediate"
githubRepo: "https://github.com/username/repo"
language: "fr"
published: true
featured: false
---
\`\`\`

## 🎨 Catégories Disponibles

- **cloud** : Cloud Computing (AWS, GCP, Azure, Kubernetes)
- **devops** : DevOps & CI/CD (Docker, Jenkins, GitLab CI)
- **backend** : Backend Development (Node.js, Python, APIs)
- **networking** : Réseau & Sécurité (TCP/IP, Firewalls, VPN)
- **ai-data** : AI & Data Science (Machine Learning, TensorFlow)
- **emerging-tech** : Technologies Émergentes (Blockchain, IoT)

## 🐳 Déploiement avec Docker

### Build et run localement

\`\`\`bash
# Build l'image
docker build -t my-tech-watch-blog .

# Lancer le conteneur
docker run -p 3000:3000 my-tech-watch-blog
\`\`\`

### Avec Docker Compose

\`\`\`bash
docker-compose up -d
\`\`\`

## ☁️ Déploiement sur GCP Cloud Run

Consultez le guide détaillé : [DEPLOY_GCP.md](./DEPLOY_GCP.md)

### Résumé rapide

1. **Configurer GCP**

\`\`\`bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
\`\`\`

2. **Déployer**

\`\`\`bash
gcloud run deploy my-tech-watch-blog \
    --source . \
    --platform managed \
    --region europe-west1 \
    --allow-unauthenticated
\`\`\`

3. **CI/CD automatique**

Le workflow GitHub Actions déploie automatiquement sur chaque push vers `main`.

## 🛠️ Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build pour la production |
| `npm run start` | Lance le serveur de production |
| `npm run lint` | Lint le code |
| `npm run new:article` | Créer un nouvel article |
| `npm run new:lab` | Créer un nouveau lab |
| `npm run new:project` | Créer un nouveau projet |

## 🎯 Roadmap

- [x] Architecture Next.js 14 avec App Router
- [x] Support i18n (FR/EN)
- [x] Système de recherche
- [x] Mode sombre
- [x] Syntax highlighting
- [x] Docker & Docker Compose
- [x] CI/CD vers GCP Cloud Run
- [ ] Analytics (Google Analytics ou Plausible)
- [ ] Commentaires (Giscus ou Disqus)
- [ ] RSS Feed
- [ ] Sitemap XML
- [ ] Newsletter
- [ ] PWA Support

## 📊 Performance

Le blog est optimisé pour des performances maximales :

- ⚡ Server-side rendering (SSR)
- 📦 Code splitting automatique
- 🖼️ Optimisation d'images avec next/image
- 🎨 CSS critical path optimisé
- 📱 Mobile-first design
- ♿ Accessibilité WCAG 2.1

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Daniel Beni Niyobuzima**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Daniel Beni Niyobuzima](https://linkedin.com/in/yourprofile)
- Email: dniyobuzima@gmail.com

## 🙏 Remerciements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDX](https://mdxjs.com/)
- [Vercel](https://vercel.com/)

---

⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile !
