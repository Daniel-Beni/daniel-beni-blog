---
title: "Two Sum — Hash Map en O(n)"
description: "Résolution optimale de Two Sum (LeetCode #1) avec le pattern Hash Map. Comparaison brute force O(n²) vs hash map O(n), analyse de complexité et implémentation Python."
date: "2026-02-15"
lastModified: "2026-02-15"
author: "Daniel Beni Niyobuzima"
category: "dsa"
tags: ["leetcode", "hash-maps", "python", "algorithms", "two-sum", "arrays"]
difficulty: "beginner"
language: "fr"
published: true
competencies: ["algorithmic-thinking", "hash-map-pattern", "complexity-analysis"]
tools_used: ["Python", "LeetCode"]
complexity_level: "O(n)"
tldr: "Two Sum résolu en O(n) avec un dictionnaire Python — pour chaque élément, on vérifie si son complément (target - num) existe déjà dans le dictionnaire."
leetcode_url: "https://leetcode.com/problems/two-sum/"
leetcode_number: 1
leetcode_difficulty: "easy"
pattern: "hash-maps"
githubRepo: "https://github.com/Daniel-Beni/leetcode-solutions/tree/main/solutions/0001-two-sum"
---

# Two Sum — LeetCode #1

## Le Problème

Étant donné un tableau d'entiers `nums` et un entier `target`, retourner les **indices** des deux éléments dont la somme est égale à `target`.

Contraintes :
- Chaque entrée a **exactement une solution**
- Le même élément ne peut pas être utilisé deux fois
- La réponse peut être retournée dans n'importe quel ordre

**Exemple :**
```
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explication: nums[0] + nums[1] = 2 + 7 = 9
```

## Mon Raisonnement

### Première approche : Brute Force

L'idée la plus directe : pour chaque élément, parcourir tous les éléments suivants et vérifier si leur somme atteint `target`.

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
```

Ça fonctionne, mais la double boucle imbriquée donne une complexité **O(n²)**. Sur un tableau de 10 000 éléments, c'est 100 millions de comparaisons. On peut faire beaucoup mieux.

### Optimisation : Hash Map

L'observation clé : si `nums[i] + nums[j] == target`, alors `nums[j] == target - nums[i]`. Autrement dit, pour chaque élément, on connaît **exactement** la valeur qu'on cherche — son **complément**.

Au lieu de parcourir tout le tableau pour trouver ce complément (O(n)), on peut le stocker dans un dictionnaire pour un accès en O(1).

L'algorithme :
1. Créer un dictionnaire vide `seen`
2. Pour chaque élément `num` à l'indice `i` :
   - Calculer `complement = target - num`
   - Si `complement` est dans `seen` → on a trouvé la paire, retourner les indices
   - Sinon → stocker `num: i` dans `seen` pour les itérations suivantes

Le dictionnaire agit comme une mémoire : il retient tous les éléments déjà visités et permet de vérifier instantanément si le complément d'un nouvel élément existe.

## Implémentation

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
```

**Trace d'exécution** avec `nums = [2, 7, 11, 15]`, `target = 9` :

| Itération | num | complement | seen | Action |
|-----------|-----|-----------|------|--------|
| i=0 | 2 | 7 | `{}` | 7 pas dans seen → stocker `{2: 0}` |
| i=1 | 7 | 2 | `{2: 0}` | 2 est dans seen → retourner `[0, 1]` |

Une seule passe sur le tableau, résultat trouvé à la deuxième itération.

## Analyse de Complexité

| Approche | Temps | Espace | Trade-off |
|----------|-------|--------|-----------|
| Brute Force | O(n²) | O(1) | Lent mais pas de mémoire supplémentaire |
| Hash Map | **O(n)** | **O(n)** | Rapide en échangeant du temps contre de l'espace |

La solution Hash Map utilise O(n) d'espace mémoire (le dictionnaire peut contenir au plus n éléments) pour gagner un facteur n en temps. C'est le **time-space tradeoff** classique.

## Pattern : Hash Map Lookup

Le pattern Hash Map Lookup consiste à utiliser un dictionnaire pour transformer une recherche O(n) en recherche O(1). Il se reconnaît quand :

- On cherche une **paire** d'éléments satisfaisant une condition
- On a besoin de vérifier si un **complément** ou une **valeur cible** existe
- On veut compter des **fréquences** ou grouper des éléments

Problèmes LeetCode qui suivent le même pattern :

| # | Problème | Variante |
|---|----------|----------|
| 49 | Group Anagrams | Hash map sur clé triée |
| 242 | Valid Anagram | Hash map de fréquences |
| 217 | Contains Duplicate | Hash set (existence) |
| 347 | Top K Frequent Elements | Hash map + tri/heap |

## Ce Que J'ai Appris

- La clé de l'optimisation est de **reformuler la question** : au lieu de "quelle paire somme à target ?", on se demande "pour cet élément, est-ce que son complément existe déjà ?" — ce changement de perspective transforme un problème O(n²) en O(n).
- En Python, le `in` sur un dictionnaire est O(1) en moyenne grâce aux hash tables. C'est ce qui rend le pattern viable.
- Le pattern Hash Map Lookup est probablement le plus fréquent en entretien. Le reconnaître instantanément fait gagner un temps considérable.
