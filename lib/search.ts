import Fuse, { IFuseOptions } from 'fuse.js';
import { SearchResult, Article, Locale } from '@/types/content';
import { getAllArticles } from './content';

/**
 * Configure et retourne une instance Fuse.js pour la recherche
 */
function createSearchIndex(articles: Article[]): Fuse<SearchResult> {
  const searchData: SearchResult[] = articles.map(article => ({
    slug: article.slug,
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    category: article.frontmatter.category,
    tags: article.frontmatter.tags,
    type: article.type,
    date: article.frontmatter.date,
    excerpt: article.content.slice(0, 200),
  }));

  const options: IFuseOptions<SearchResult> = {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'description', weight: 2 },
      { name: 'tags', weight: 2 },
      { name: 'excerpt', weight: 1 },
      { name: 'category', weight: 1 },
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  };

  return new Fuse(searchData, options);
}

/**
 * Recherche dans tous les types de contenu
 */
export function searchContent(
  query: string,
  locale: Locale,
  options?: {
    limit?: number;
    types?: Array<'blog' | 'lab' | 'project'>;
    category?: string;
  }
): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const types = options?.types || ['blog', 'lab', 'project'];
  const allArticles: Article[] = [];

  types.forEach(type => {
    const articles = getAllArticles(type, locale);
    allArticles.push(...articles);
  });

  const fuse = createSearchIndex(allArticles);
  const results = fuse.search(query);

  let filtered = results.map(result => result.item);

  // Filtre par catégorie si spécifié
  if (options?.category) {
    filtered = filtered.filter(result => result.category === options.category);
  }

  // Limite les résultats
  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

/**
 * Recherche par tags
 */
export function searchByTags(
  tags: string[],
  locale: Locale,
  options?: {
    limit?: number;
    type?: 'blog' | 'lab' | 'project';
  }
): SearchResult[] {
  const type = options?.type || 'blog';
  const articles = getAllArticles(type, locale);

  const results = articles
    .filter(article =>
      tags.some(tag => article.frontmatter.tags.includes(tag))
    )
    .map(article => ({
      slug: article.slug,
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      category: article.frontmatter.category,
      tags: article.frontmatter.tags,
      type: article.type,
      date: article.frontmatter.date,
      excerpt: article.content.slice(0, 200),
    }));

  if (options?.limit) {
    return results.slice(0, options.limit);
  }

  return results;
}

/**
 * Obtient des suggestions de recherche basées sur une requête partielle
 */
export function getSuggestions(
  query: string,
  locale: Locale,
  limit = 5
): string[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const allArticles = [
    ...getAllArticles('blog', locale),
    ...getAllArticles('lab', locale),
    ...getAllArticles('project', locale),
  ];

  const titles = allArticles.map(a => a.frontmatter.title);
  const tags = Array.from(
    new Set(allArticles.flatMap(a => a.frontmatter.tags))
  );

  const suggestions = [...titles, ...tags]
    .filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, limit);

  return suggestions;
}
