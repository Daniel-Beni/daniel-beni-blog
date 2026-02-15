import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ArticleCard} from '@/components/blog/ArticleCard';
import {getAllArticles} from '@/lib/content';
import {getCategoryName} from '@/lib/utils';
import type {Category, Locale} from '@/types/content';
import {locales} from '@/i18n';

const categories: Category[] = [
  'cloud',
  'devops',
  'backend',
  'networking',
  'ai-data',
  'emerging-tech'
];

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.map((category) => ({
      locale,
      category
    }))
  );
}

export default async function CategoryPage({
  params
}: {
  params: {locale: string; category: string};
}) {
  const {locale, category} = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  if (!categories.includes(category as Category)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'blog'});
  const articles = getAllArticles('blog', locale as Locale, {
    sortBy: 'date',
    category: category as Category
  });

  const categoryLabel = getCategoryName(category, locale as Locale);
  const topicsLabel = locale === 'fr' ? 'Sujets' : 'Topics';

  return (
    <div className="container-custom space-y-10 py-10">
      <div className="space-y-3">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {locale === 'fr' ? 'Retour au blog' : 'Back to blog'}
        </Link>
        <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
          {topicsLabel}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{categoryLabel}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {locale === 'fr'
            ? 'Articles de blog filtrés par cette thématique.'
            : 'Blog posts filtered by this topic.'}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {locale === 'fr'
            ? 'Aucun article publié dans cette thématique pour le moment.'
            : 'No articles published under this topic yet.'}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
