export type Category =
  | 'cloud'
  | 'devops'
  | 'backend'
  | 'networking'
  | 'ai-data'
  | 'emerging-tech'
  | 'dsa';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ContentType = 'blog' | 'lab' | 'project' | 'dsa';

export type Locale = 'fr' | 'en';

export interface Author {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  lastModified?: string;
  author: string;
  category: Category;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  difficulty?: Difficulty;
  githubRepo?: string;
  liveDemo?: string;
  language: Locale;
  published: boolean;
  featured?: boolean;
  image?: string;
  duration?: string;
  prerequisites?: string[];

  // ===== AIO Metadata =====

  /** Compétences démontrées — pour le sourcing IA et recruteurs
   *  Ex: ["containerization", "orchestration", "yaml-configuration"] */
  competencies?: string[];

  /** Outils/technologies utilisés — matching recruteur
   *  Ex: ["Docker", "kubectl", "Minikube"] */
  tools_used?: string[];

  /** Niveau de complexité ou notation Big-O
   *  Ex: "production-ready" | "proof-of-concept" | "O(n log n)" */
  complexity_level?: string;

  /** Résumé TL;DR optimisé pour l'extraction IA
   *  Ex: "Comment déployer un pod Kubernetes en 5 étapes avec Minikube" */
  tldr?: string;

  // ===== DSA-specific =====

  /** URL du problème LeetCode */
  leetcode_url?: string;

  /** Numéro du problème LeetCode */
  leetcode_number?: number;

  /** Difficulté LeetCode */
  leetcode_difficulty?: 'easy' | 'medium' | 'hard';

  /** Pattern algorithmique identifié
   *  Ex: "hash-map", "two-pointers", "sliding-window" */
  pattern?: string;
}

export interface Article {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  readingTime: number;
  type: ContentType;
}

export interface Series {
  name: string;
  description: string;
  articles: Article[];
  totalParts: number;
}

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  type: ContentType;
  date: string;
  excerpt: string;
}

export interface CategoryInfo {
  id: Category;
  name: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  icon: string;
  color: string;
}

export interface TableOfContents {
  id: string;
  title: string;
  level: number;
}
