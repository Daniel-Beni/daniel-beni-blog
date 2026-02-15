import Link from 'next/link';
import {Calendar, ArrowLeft} from 'lucide-react';
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
  getSeriesNavigation
} from '@/lib/content';
import {formatDate, getCategoryColor, getCategoryName, getDifficultyLabel} from '@/lib/utils';
import {getBlogPostingJsonLd} from '@/lib/jsonld';
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
  const article = getArticleBySlug('blog', fullSlug, locale as Locale);
  if (!article) return {title: locale === 'fr' ? 'Article non trouvé' : 'Article not found'};

  const {frontmatter} = article;
  const url = `https://www.danielbeni.com/${locale}/blog/${fullSlug}`;

  return {
    title: `${frontmatter.title} | Daniel Beni`,
    description: frontmatter.description,
    authors: [{name: frontmatter.author}],
    keywords: frontmatter.tags,
    alternates: {
      canonical: url,
      languages: {
        fr: `/fr/blog/${fullSlug}`,
        en: `/en/blog/${fullSlug}`,
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
    getAllSlugs('blog', locale as Locale).map((slug) => ({
      locale,
      slug: slug.split('/')
    }))
  );
}

export default async function ArticlePage({
  params
}: {
  params: Promise<{locale: string; slug: string[]}>;
}) {
  const {locale, slug} = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const fullSlug = Array.isArray(slug) ? slug.join('/') : slug;
  const article = getArticleBySlug('blog', fullSlug, locale as Locale);

  if (!article) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: 'blog'});
  const html = await markdownToHtml(article.content);
  const related = getRelatedArticles(article, locale as Locale, 3);
  const seriesNav = getSeriesNavigation(article, locale as Locale);
  const {frontmatter} = article;

  return (
    <article className="container-custom space-y-12 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBlogPostingJsonLd(article, locale as Locale)),
        }}
      />
      <div className="flex flex-col gap-4">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {locale === 'fr' ? 'Retour au blog' : 'Back to blog'}
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className={getCategoryColor(frontmatter.category)}>
            {getCategoryName(frontmatter.category, locale as Locale)}
          </Badge>
          {frontmatter.featured && (
            <Badge variant="warning">
              {locale === 'fr' ? 'En vedette' : 'Featured'}
            </Badge>
          )}
          {frontmatter.difficulty && (
            <Badge variant="secondary">
              {getDifficultyLabel(frontmatter.difficulty, locale as Locale)}
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
        </div>

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

      {(seriesNav.previous || seriesNav.next) && (
        <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:grid-cols-2">
          {seriesNav.previous && (
            <Link
              href={`/${locale}/blog/${seriesNav.previous.slug}`}
              className="group block rounded-lg border border-transparent p-3 transition hover:border-primary-200 dark:hover:border-primary-900"
            >
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {t('previousArticle')}
              </p>
              <p className="mt-1 font-semibold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                {seriesNav.previous.frontmatter.title}
              </p>
            </Link>
          )}
          {seriesNav.next && (
            <Link
              href={`/${locale}/blog/${seriesNav.next.slug}`}
              className="group block rounded-lg border border-transparent p-3 transition hover:border-primary-200 dark:hover:border-primary-900 md:text-right"
            >
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {t('nextArticle')}
              </p>
              <p className="mt-1 font-semibold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                {seriesNav.next.frontmatter.title}
              </p>
            </Link>
          )}
        </div>
      )}

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('relatedArticles')}
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
