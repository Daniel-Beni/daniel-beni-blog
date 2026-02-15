import Link from 'next/link';
import {Calendar, ArrowLeft, ExternalLink} from 'lucide-react';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {remark} from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import type {Metadata} from 'next';
import {Badge} from '@/components/ui/Badge';
import {ArticleCard} from '@/components/blog/ArticleCard';
import {
  getAllSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from '@/lib/content';
import {formatDate, getCategoryColor, getCategoryName, getDifficultyLabel} from '@/lib/utils';
import {getDsaJsonLd} from '@/lib/jsonld';
import type {Locale} from '@/types/content';
import {locales} from '@/i18n';

async function markdownToHtml(markdown: string) {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return result.toString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string[]}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const fullSlug = Array.isArray(slug) ? slug.join('/') : slug;
  const article = getArticleBySlug('dsa', fullSlug, locale as Locale);
  if (!article) return {title: locale === 'fr' ? 'Problème non trouvé' : 'Problem not found'};

  const {frontmatter} = article;
  const url = `https://www.danielbeni.com/${locale}/dsa/${fullSlug}`;

  return {
    title: `${frontmatter.title} | Daniel Beni`,
    description: frontmatter.description,
    authors: [{name: frontmatter.author}],
    keywords: frontmatter.tags,
    alternates: {
      canonical: url,
      languages: {
        fr: `/fr/dsa/${fullSlug}`,
        en: `/en/dsa/${fullSlug}`,
      },
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url,
      type: 'article',
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.lastModified || frontmatter.date,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
      siteName: 'Daniel Beni - Tech Watch Blog',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
    },
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllSlugs('dsa', locale as Locale).map((slug) => ({
      locale,
      slug: slug.split('/'),
    }))
  );
}

export default async function DsaArticlePage({
  params,
}: {
  params: Promise<{locale: string; slug: string[]}>;
}) {
  const {locale, slug} = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const fullSlug = Array.isArray(slug) ? slug.join('/') : slug;
  const article = getArticleBySlug('dsa', fullSlug, locale as Locale);

  if (!article) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: 'blog'});
  const html = await markdownToHtml(article.content);
  const related = getRelatedArticles(article, locale as Locale, 3);
  const {frontmatter} = article;
  const fm = frontmatter as typeof frontmatter & {
    leetcode_url?: string;
    leetcode_number?: number;
    leetcode_difficulty?: string;
    pattern?: string;
    complexity_level?: string;
  };

  return (
    <article className="container-custom space-y-12 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getDsaJsonLd(article, locale as Locale)),
        }}
      />
      <div className="flex flex-col gap-4">
        <Link
          href={`/${locale}/dsa`}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {locale === 'fr' ? 'Retour au DSA' : 'Back to DSA'}
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className={getCategoryColor(frontmatter.category)}>
            {getCategoryName(frontmatter.category, locale as Locale)}
          </Badge>
          {fm.pattern && (
            <Badge variant="secondary">
              {fm.pattern}
            </Badge>
          )}
          {frontmatter.difficulty && (
            <Badge variant="secondary">
              {getDifficultyLabel(frontmatter.difficulty, locale as Locale)}
            </Badge>
          )}
          {fm.leetcode_difficulty && (
            <Badge variant="outline">
              LeetCode {fm.leetcode_difficulty}
            </Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white">
          {frontmatter.title}
        </h1>
        <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          {frontmatter.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('publishedOn')} {formatDate(frontmatter.date, locale as Locale)}
          </span>
          {frontmatter.lastModified && (
            <span>
              {t('updatedOn')} {formatDate(frontmatter.lastModified, locale as Locale)}
            </span>
          )}
          <span>
            {t('author')} {frontmatter.author}
          </span>
          {fm.complexity_level && (
            <span className="font-mono text-primary-600 dark:text-primary-400">
              {fm.complexity_level}
            </span>
          )}
        </div>

        {fm.leetcode_url && (
          <a
            href={fm.leetcode_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4" />
            {locale === 'fr' ? 'Voir sur LeetCode' : 'View on LeetCode'}
          </a>
        )}

        {frontmatter.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{__html: html}}
      />

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {locale === 'fr' ? 'Problèmes similaires' : 'Related problems'}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
