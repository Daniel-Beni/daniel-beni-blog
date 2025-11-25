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

async function createLab() {
  console.log('\n🧪 Créer un nouveau Lab\n');

  const title = await question('Titre du lab: ');
  const description = await question('Description: ');
  const category = await question(
    'Catégorie (cloud/devops/backend/networking/ai-data/emerging-tech): '
  );
  const tags = await question('Tags (séparés par des virgules): ');
  const difficulty = await question('Difficulté (beginner/intermediate/advanced): ');
  const duration = await question('Durée estimée (ex: 2 heures): ');
  const prerequisites = await question(
    'Prérequis (séparés par des virgules): '
  );
  const language = await question('Langue (fr/en): ');
  const githubRepo = await question('Repo GitHub: ');

  const slug = slugify(title);
  const date = new Date().toISOString().split('T')[0];

  const prereqArray = prerequisites
    .split(',')
    .map((p) => `"${p.trim()}"`)
    .join(', ');

  const frontmatter = `---
title: "${title}"
description: "${description}"
date: "${date}"
lastModified: "${date}"
author: "Daniel Beni Niyobuzima"
category: "${category}"
tags: [${tags.split(',').map((t) => `"${t.trim()}"`).join(', ')}]
difficulty: "${difficulty}"
duration: "${duration}"
prerequisites: [${prereqArray}]
githubRepo: "${githubRepo}"
language: "${language}"
published: true
featured: false
---

# ${title}

## 🎯 Objectif du Lab

[Décrivez ce que vous allez apprendre/construire dans ce lab]

## 🧰 Prérequis

${prerequisites.split(',').map((p) => `- ${p.trim()}`).join('\n')}

## ⏱️ Durée Estimée

${duration}

## 📚 Concepts Clés

[Expliquez les concepts techniques importants]

## 🔧 Implémentation

### Étape 1 : Configuration de l'environnement

\`\`\`bash
# Commandes de configuration
\`\`\`

### Étape 2 : [Nom de l'étape]

\`\`\`bash
# Commandes
\`\`\`

\`\`\`typescript
// Code
\`\`\`

### Étape 3 : [Nom de l'étape]

[Instructions détaillées]

## 🧪 Tests et Validation

### Test 1 : [Nom du test]

\`\`\`bash
# Commandes de test
\`\`\`

**Résultat attendu:**
\`\`\`
[Output attendu]
\`\`\`

## 📊 Résultats

[Ce que vous avez obtenu, captures d'écran, métriques]

## 💡 Leçons Apprises

- **Technique 1:** [Explication]
- **Technique 2:** [Explication]
- **Piège à éviter:** [Explication]
- **Bonne pratique:** [Explication]

## 🚧 Difficultés Rencontrées

[Problèmes rencontrés et solutions]

## 🔗 Ressources

- [Code source sur GitHub](${githubRepo})
- [Documentation officielle](URL)
- [Article de référence](URL)

## 🚀 Prochaines Étapes

[Extensions possibles, améliorations, labs suivants]

## 📝 Notes Supplémentaires

[Toute information complémentaire utile]
`;

  const dirPath = path.join(process.cwd(), 'content', 'labs', category);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    console.log(`\n❌ Un lab avec ce nom existe déjà: ${filePath}`);
    rl.close();
    return;
  }

  fs.writeFileSync(filePath, frontmatter);
  console.log(`\n✅ Lab créé avec succès!`);
  console.log(`📂 Emplacement: ${filePath}`);
  console.log(`\n💡 Ouvrez ce fichier dans votre éditeur et documentez votre lab!\n`);

  rl.close();
}

createLab().catch((error) => {
  console.error('Erreur:', error);
  rl.close();
  process.exit(1);
});
