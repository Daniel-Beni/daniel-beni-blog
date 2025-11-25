#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

async function createProject() {
  console.log('\n🚀 Créer un nouveau Projet\n');

  const title = await question('Nom du projet: ');
  const description = await question('Description: ');
  const category = await question(
    'Catégorie (cloud/devops/backend/networking/ai-data/emerging-tech): '
  );
  const tags = await question('Tags (séparés par des virgules): ');
  const techStack = await question('Stack technique (séparées par des virgules): ');
  const status = await question('Statut (inProgress/completed/archived): ');
  const language = await question('Langue (fr/en): ');
  const githubRepo = await question('Repo GitHub: ');
  const liveDemo = await question('URL de démo (optionnel): ');

  const slug = slugify(title);
  const date = new Date().toISOString().split('T')[0];

  const frontmatter = `---
title: "${title}"
description: "${description}"
date: "${date}"
lastModified: "${date}"
author: "Daniel Beni Niyobuzima"
category: "${category}"
tags: [${tags.split(',').map((t) => `"${t.trim()}"`).join(', ')}]
techStack: [${techStack.split(',').map((t) => `"${t.trim()}"`).join(', ')}]
status: "${status}"
githubRepo: "${githubRepo}"
${liveDemo ? `liveDemo: "${liveDemo}"` : ''}
language: "${language}"
published: true
featured: false
---

# ${title}

## 📋 Vue d'ensemble

[Description générale du projet, contexte, pourquoi vous l'avez créé]

## 🎯 Objectifs

- Objectif 1
- Objectif 2
- Objectif 3

## 🛠️ Stack Technique

${techStack.split(',').map((tech) => `- **${tech.trim()}**`).join('\n')}

## ⚙️ Architecture

[Décrivez l'architecture du système, avec des diagrammes si possible]

\`\`\`
[Diagramme ASCII ou description]
\`\`\`

## 🚀 Fonctionnalités

### Fonctionnalité 1
[Description détaillée]

### Fonctionnalité 2
[Description détaillée]

### Fonctionnalité 3
[Description détaillée]

## 💻 Installation

### Prérequis

- Prérequis 1
- Prérequis 2

### Étapes

\`\`\`bash
# Cloner le repo
git clone ${githubRepo}

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env

# Lancer le projet
npm run dev
\`\`\`

## 📸 Captures d'écran

[Ajoutez des captures d'écran du projet]

## 🔧 Configuration

[Détails sur la configuration nécessaire]

## 🧪 Tests

\`\`\`bash
# Lancer les tests
npm test
\`\`\`

## 📦 Déploiement

[Instructions de déploiement]

## 📈 Résultats & Métriques

[Statistiques, performances, résultats obtenus]

## 💡 Défis & Solutions

### Défi 1
**Problème:** [Description]
**Solution:** [Comment vous l'avez résolu]

### Défi 2
**Problème:** [Description]
**Solution:** [Comment vous l'avez résolu]

## 🎓 Apprentissages

- Apprentissage 1
- Apprentissage 2
- Apprentissage 3

## 🔗 Liens

- [Code source sur GitHub](${githubRepo})
${liveDemo ? `- [Démo en ligne](${liveDemo})` : ''}
- [Documentation](URL)

## 🚧 Améliorations Futures

- [ ] Amélioration 1
- [ ] Amélioration 2
- [ ] Amélioration 3

## 👥 Contribution

[Si le projet est open source, comment contribuer]

## 📄 Licence

[Type de licence]
`;

  const dirPath = path.join(process.cwd(), 'content', 'projects', category);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    console.log(`\n❌ Un projet avec ce nom existe déjà: ${filePath}`);
    rl.close();
    return;
  }

  fs.writeFileSync(filePath, frontmatter);
  console.log(`\n✅ Projet créé avec succès!`);
  console.log(`📂 Emplacement: ${filePath}`);
  console.log(`\n💡 Ouvrez ce fichier dans votre éditeur et documentez votre projet!\n`);

  rl.close();
}

createProject().catch((error) => {
  console.error('Erreur:', error);
  rl.close();
  process.exit(1);
});
