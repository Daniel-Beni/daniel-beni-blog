---
title: "Two Sum — Hash Map in O(n)"
description: "Optimal solution for Two Sum (LeetCode #1) using the Hash Map pattern. Brute force O(n²) vs hash map O(n) comparison, complexity analysis and Python implementation."
date: "2026-02-15"
lastModified: "2026-02-15"
author: "Daniel Beni Niyobuzima"
category: "dsa"
tags: ["leetcode", "hash-maps", "python", "algorithms", "two-sum", "arrays"]
difficulty: "beginner"
language: "en"
published: true
competencies: ["algorithmic-thinking", "hash-map-pattern", "complexity-analysis"]
tools_used: ["Python", "LeetCode"]
complexity_level: "O(n)"
tldr: "Two Sum solved in O(n) with a Python dictionary — for each element, we check if its complement (target - num) already exists in the dictionary."
leetcode_url: "https://leetcode.com/problems/two-sum/"
leetcode_number: 1
leetcode_difficulty: "easy"
pattern: "hash-maps"
githubRepo: "https://github.com/Daniel-Beni/leetcode-solutions/tree/main/solutions/0001-two-sum"
---

# Two Sum — LeetCode #1

## The Problem

Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers that add up to `target`.

Constraints:
- Each input has **exactly one solution**
- You may not use the same element twice
- You can return the answer in any order

**Example:**
```
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
```

## My Approach

### First approach: Brute Force

The most straightforward idea: for each element, loop over all following elements and check if their sum equals `target`.

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
```

It works, but the nested double loop yields **O(n²)** complexity. On an array of 10,000 elements, that’s 100 million comparisons. We can do much better.

### Optimization: Hash Map

The key observation: if `nums[i] + nums[j] == target`, then `nums[j] == target - nums[i]`. So for each element we know **exactly** which value we need — its **complement**.

Instead of scanning the whole array to find that complement (O(n)), we can store seen values in a dictionary for O(1) lookup.

The algorithm:
1. Create an empty dictionary `seen`
2. For each element `num` at index `i`:
   - Compute `complement = target - num`
   - If `complement` is in `seen` → we’ve found the pair, return the indices
   - Otherwise → store `num: i` in `seen` for later iterations

The dictionary acts as memory: it keeps all previously seen elements and lets us check instantly whether the complement of the current element exists.

## Implementation

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

**Execution trace** with `nums = [2, 7, 11, 15]`, `target = 9`:

| Step | num | complement | seen | Action |
|------|-----|------------|------|--------|
| i=0 | 2 | 7 | `{}` | 7 not in seen → store `{2: 0}` |
| i=1 | 7 | 2 | `{2: 0}` | 2 is in seen → return `[0, 1]` |

Single pass over the array, result found on the second iteration.

## Complexity Analysis

| Approach | Time | Space | Trade-off |
|----------|------|-------|-----------|
| Brute Force | O(n²) | O(1) | Slow but no extra memory |
| Hash Map | **O(n)** | **O(n)** | Fast by trading time for space |

The hash map solution uses O(n) extra space (the dictionary can hold at most n entries) to gain a factor of n in time. This is the classic **time–space tradeoff**.

## Pattern: Hash Map Lookup

The Hash Map Lookup pattern uses a dictionary to turn an O(n) search into O(1). You can spot it when:

- You need a **pair** of elements satisfying some condition
- You need to check if a **complement** or **target value** exists
- You want to count **frequencies** or group elements

LeetCode problems that follow the same pattern:

| # | Problem | Variant |
|---|---------|---------|
| 49 | Group Anagrams | Hash map on sorted key |
| 242 | Valid Anagram | Frequency hash map |
| 217 | Contains Duplicate | Hash set (existence) |
| 347 | Top K Frequent Elements | Hash map + sort/heap |

## What I Learned

- The key to optimization is **rephrasing the question**: instead of “which pair sums to target?”, ask “for this element, does its complement already exist?” — that shift turns an O(n²) problem into O(n).
- In Python, `in` on a dict is O(1) on average thanks to hash tables. That’s what makes this pattern practical.
- Hash Map Lookup is likely the most common pattern in interviews. Recognizing it quickly saves a lot of time.
