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

const PATTERNS = [
  'arrays', 'hash-maps', 'two-pointers', 'sliding-window',
  'binary-search', 'linked-lists', 'stacks', 'trees',
  'tries', 'heap', 'graphs', 'backtracking',
  'dynamic-programming', 'greedy', 'intervals', 'bit-manipulation',
];

async function createDSA() {
  console.log('\n🧮 Nouveau problème DSA\n');

  const leetcodeNumber = await question('Numéro LeetCode (ex: 1): ');
  const title = await question('Titre du problème (ex: Two Sum): ');
  const leetcodeDifficulty = await question('Difficulté LeetCode (easy/medium/hard): ');

  console.log(`\nPatterns disponibles :`);
  PATTERNS.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
  const patternIdx = await question('\nNuméro du pattern: ');
  const pattern = PATTERNS[parseInt(patternIdx) - 1] || 'arrays';

  const complexity = await question('Complexité optimale (ex: O(n)): ');
  const tags = await question('Tags supplémentaires (séparés par virgules, optionnel): ');
  const language = await question('Langue (fr/en) [fr]: ') || 'fr';

  const slug = slugify(title);
  const date = new Date().toISOString().split('T')[0];
  const paddedNum = leetcodeNumber.padStart(4, '0');
  const patternTitle = pattern.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const competencies = [
    'algorithmic-thinking',
    `${pattern}-pattern`,
    'complexity-analysis',
  ];

  const allTags = [
    'leetcode', pattern, 'python', 'algorithms',
    ...tags.split(',').map((t) => t.trim()).filter(Boolean),
  ];

  const difficulty =
    leetcodeDifficulty === 'easy' ? 'beginner' :
    leetcodeDifficulty === 'medium' ? 'intermediate' : 'advanced';

  const frontmatter = `---
title: "${title} — ${patternTitle} en ${complexity}"
description: "Résolution optimale de ${title} (LeetCode #${leetcodeNumber}) avec le pattern ${pattern}. Analyse de complexité et implémentation Python."
date: "${date}"
lastModified: "${date}"
author: "Daniel Beni Niyobuzima"
category: "dsa"
tags: [${allTags.map((t) => `"${t}"`).join(', ')}]
difficulty: "${difficulty}"
language: "${language}"
published: true
competencies: [${competencies.map((c) => `"${c}"`).join(', ')}]
tools_used: ["Python", "LeetCode"]
complexity_level: "${complexity}"
tldr: ""
leetcode_url: "https://leetcode.com/problems/${slug}/"
leetcode_number: ${leetcodeNumber}
leetcode_difficulty: "${leetcodeDifficulty}"
pattern: "${pattern}"
githubRepo: "https://github.com/Daniel-Beni/leetcode-solutions/tree/main/solutions/${paddedNum}-${slug}"
---

# ${title} — LeetCode #${leetcodeNumber}

## Le Problème

[Reformuler l'énoncé dans tes propres mots]

**Exemple :**
\`\`\`
Input: 
Output: 
\`\`\`

## Mon Raisonnement

### Première approche : Brute Force

[Expliquer l'approche naïve et sa complexité]

### Optimisation : ${patternTitle}

[Expliquer le raisonnement vers l'optimisation]

## Implémentation

\`\`\`python
class Solution:
    def problemName(self, params) -> returnType:
        pass
\`\`\`

## Analyse de Complexité

| Approche | Temps | Espace |
|----------|-------|--------|
| Brute Force | | |
| Optimisé | ${complexity} | |

## Pattern : ${patternTitle}

[Quand utiliser ce pattern ? Quels autres problèmes suivent le même schéma ?]

## Ce Que J'ai Appris

- [Insight 1]
- [Insight 2]
`;

  const dirPath = path.join(process.cwd(), 'content', 'dsa', pattern);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    console.log(`\n❌ Ce problème existe déjà: ${filePath}`);
    rl.close();
    return;
  }

  fs.writeFileSync(filePath, frontmatter);
  console.log(`\n✅ Problème DSA créé !`);
  console.log(`📂 ${filePath}`);
  console.log(`\n💡 Prochaines étapes :`);
  console.log(`   1. Remplir l'article avec ton raisonnement`);
  console.log(`   2. Créer solutions/${paddedNum}-${slug}/ dans ton repo GitHub`);
  console.log(`   3. Committer solution.py + test_solution.py\n`);

  rl.close();
}

createDSA().catch((error) => {
  console.error('Erreur:', error);
  rl.close();
  process.exit(1);
});
