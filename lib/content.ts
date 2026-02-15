import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { Article, Frontmatter, ContentType, Series, Locale } from '@/types/content';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Récupère tous les slugs pour un type de contenu donné
 */
export function getAllSlugs(type: ContentType, locale: Locale): string[] {
  const typeDirectory = path.join(contentDirectory, type);
  
  if (!fs.existsSync(typeDirectory)) {
    return [];
  }

  const categories = fs.readdirSync(typeDirectory);
  const slugs: string[] = [];

  const slugSet = new Set<string>();

  categories.forEach(category => {
    const categoryPath = path.join(typeDirectory, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      files.forEach(file => {
        if (file.endsWith('.md') || file.endsWith('.mdx')) {
          const filePath = path.join(categoryPath, file);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContents);
          if (data.published === false) return;

          let slugBase = file.replace(/\.mdx?$/, '');
          const localeSuffix = slugBase.endsWith('.en')
            ? 'en'
            : slugBase.endsWith('.fr')
              ? 'fr'
              : null;
          if (localeSuffix) slugBase = slugBase.slice(0, -(localeSuffix.length + 1));
          const slug = `${category}/${slugBase}`;

          const matchesLocale =
            localeSuffix !== null
              ? localeSuffix === locale
              : data.language === locale;
          if (matchesLocale) slugSet.add(slug);
        }
      });
    }
  });

  return Array.from(slugSet);
}

/**
 * Récupère un article par son slug
 */
export function getArticleBySlug(
  type: ContentType,
  slug: string,
  locale: Locale
): Article | null {
  try {
    const localeSuffixPath = path.join(contentDirectory, type, `${slug}.${locale}.md`);
    const defaultPath = path.join(contentDirectory, type, `${slug}.md`);
    const defaultMdxPath = path.join(contentDirectory, type, `${slug}.mdx`);

    const actualPath = fs.existsSync(localeSuffixPath)
      ? localeSuffixPath
      : fs.existsSync(defaultPath)
        ? defaultPath
        : fs.existsSync(defaultMdxPath)
          ? defaultMdxPath
          : null;

    if (!actualPath || !fs.existsSync(actualPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(actualPath, 'utf8');
    const { data, content } = matter(fileContents);
    const { minutes } = readingTime(content);

    // Vérifie que l'article est dans la bonne langue
    if (data.language !== locale) {
      return null;
    }

    return {
      slug,
      frontmatter: data as Frontmatter,
      content,
      readingTime: Math.ceil(minutes),
      type,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

/**
 * Récupère tous les articles d'un type donné
 */
export function getAllArticles(
  type: ContentType,
  locale: Locale,
  options?: {
    limit?: number;
    category?: string;
    tags?: string[];
    featured?: boolean;
    sortBy?: 'date' | 'title';
  }
): Article[] {
  const slugs = getAllSlugs(type, locale);
  const articles = slugs
    .map(slug => getArticleBySlug(type, slug, locale))
    .filter((article): article is Article => article !== null);

  // Filtres
  let filtered = articles;

  if (options?.category) {
    filtered = filtered.filter(
      article => article.frontmatter.category === options.category
    );
  }

  if (options?.tags && options.tags.length > 0) {
    filtered = filtered.filter(article =>
      options.tags!.some(tag => article.frontmatter.tags.includes(tag))
    );
  }

  if (options?.featured) {
    filtered = filtered.filter(article => article.frontmatter.featured === true);
  }

  // Tri
  const sortBy = options?.sortBy || 'date';
  filtered.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.frontmatter.date).getTime() - 
             new Date(a.frontmatter.date).getTime();
    }
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });

  // Limite
  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

/**
 * Récupère tous les articles d'une série
 */
export function getSeriesArticles(
  seriesName: string,
  locale: Locale
): Series | null {
  const allArticles = getAllArticles('blog', locale);
  const seriesArticles = allArticles
    .filter(article => article.frontmatter.series === seriesName)
    .sort((a, b) => {
      const orderA = a.frontmatter.seriesOrder || 0;
      const orderB = b.frontmatter.seriesOrder || 0;
      return orderA - orderB;
    });

  if (seriesArticles.length === 0) {
    return null;
  }

  return {
    name: seriesName,
    description: seriesArticles[0].frontmatter.description,
    articles: seriesArticles,
    totalParts: seriesArticles.length,
  };
}

/**
 * Récupère tous les tags uniques
 */
export function getAllTags(type: ContentType, locale: Locale): string[] {
  const articles = getAllArticles(type, locale);
  const tags = new Set<string>();

  articles.forEach(article => {
    article.frontmatter.tags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).sort();
}

/**
 * Récupère les articles liés
 */
export function getRelatedArticles(
  article: Article,
  locale: Locale,
  limit = 3
): Article[] {
  const allArticles = getAllArticles(article.type, locale);
  
  // Exclure l'article actuel
  const otherArticles = allArticles.filter(a => a.slug !== article.slug);

  // Calculer le score de similarité
  const scored = otherArticles.map(other => {
    let score = 0;

    // Même catégorie
    if (other.frontmatter.category === article.frontmatter.category) {
      score += 3;
    }

    // Tags communs
    const commonTags = other.frontmatter.tags.filter(tag =>
      article.frontmatter.tags.includes(tag)
    );
    score += commonTags.length * 2;

    // Même série
    if (
      other.frontmatter.series &&
      other.frontmatter.series === article.frontmatter.series
    ) {
      score += 5;
    }

    return { article: other, score };
  });

  // Trier par score et retourner les meilleurs
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article);
}

/**
 * Récupère les articles suivant et précédent dans une série
 */
export function getSeriesNavigation(article: Article, locale: Locale) {
  if (!article.frontmatter.series) {
    return { previous: null, next: null };
  }

  const series = getSeriesArticles(article.frontmatter.series, locale);
  if (!series) {
    return { previous: null, next: null };
  }

  const currentIndex = series.articles.findIndex(a => a.slug === article.slug);
  
  return {
    previous: currentIndex > 0 ? series.articles[currentIndex - 1] : null,
    next: currentIndex < series.articles.length - 1 
      ? series.articles[currentIndex + 1] 
      : null,
  };
}
