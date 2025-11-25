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

async function createArticle() {
  console.log('\n📝 Créer un nouvel article\n');

  const title = await question('Titre de l\'article: ');
  const description = await question('Description courte: ');
  const category = await question(
    'Catégorie (cloud/devops/backend/networking/ai-data/emerging-tech): '
  );
  const tags = await question('Tags (séparés par des virgules): ');
  const difficulty = await question('Difficulté (beginner/intermediate/advanced): ');
  const language = await question('Langue (fr/en): ');
  const series = await question('Série (optionnel, appuyez sur Entrée pour ignorer): ');
  const githubRepo = await question('Repo GitHub (optionnel): ');

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
${series ? `series: "${series}"` : ''}
${difficulty ? `difficulty: "${difficulty}"` : ''}
${githubRepo ? `githubRepo: "${githubRepo}"` : ''}
language: "${language}"
published: true
featured: false
---

# ${title}

## 🎯 Objectif

[Décrivez brièvement l'objectif de cet article]

## 📚 Concepts Clés

[Expliquez les concepts importants]

## 🔧 Implémentation

### Étape 1 : Configuration

\`\`\`bash
# Vos commandes ici
\`\`\`

### Étape 2 : Développement

\`\`\`typescript
// Votre code ici
\`\`\`

## 🧪 Tests et Validation

[Comment valider que ça fonctionne]

## 💡 Leçons Apprises

- Point 1
- Point 2
- Point 3

## 🔗 Ressources

${githubRepo ? `- [Code source sur GitHub](${githubRepo})` : ''}
- [Documentation officielle](URL)

## 🚀 Prochaines Étapes

[Ce que vous pourriez explorer ensuite]
`;

  const dirPath = path.join(process.cwd(), 'content', 'blog', category);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    console.log(`\n❌ Un article avec ce nom existe déjà: ${filePath}`);
    rl.close();
    return;
  }

  fs.writeFileSync(filePath, frontmatter);
  console.log(`\n✅ Article créé avec succès!`);
  console.log(`📂 Emplacement: ${filePath}`);
  console.log(`\n💡 Ouvrez ce fichier dans votre éditeur et commencez à écrire!\n`);

  rl.close();
}

createArticle().catch((error) => {
  console.error('Erreur:', error);
  rl.close();
  process.exit(1);
});
