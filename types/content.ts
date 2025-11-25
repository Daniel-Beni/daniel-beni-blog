export type Category = 
  | 'cloud' 
  | 'devops' 
  | 'backend' 
  | 'networking' 
  | 'ai-data' 
  | 'emerging-tech';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ContentType = 'blog' | 'lab' | 'project';

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
