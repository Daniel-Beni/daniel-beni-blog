import {unstable_setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ArticleCard} from '@/components/blog/ArticleCard';
import {CategoryFilter} from '@/components/blog/CategoryFilter';
import {getAllArticles} from '@/lib/content';
import {getCategoryName} from '@/lib/utils';
import type {Category, Locale} from '@/types/content';
import {locales} from '@/i18n';

export default async function BlogPage({
  params,
  searchParams
}: {
  params: {locale: string};
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const {locale} = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const categories: Category[] = [
    'cloud',
    'devops',
    'backend',
    'networking',
    'ai-data',
    'emerging-tech'
  ];

  const requestedCategory =
    typeof searchParams?.category === 'string' ? searchParams?.category : undefined;
  const activeCategory = categories.includes(requestedCategory as Category)
    ? (requestedCategory as Category)
    : undefined;

  unstable_setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'blog'});
  const articles = getAllArticles('blog', locale as Locale, {
    sortBy: 'date',
    category: activeCategory
  });
  const topicsLabel = locale === 'fr' ? 'Sujets' : 'Topics';

  return (
    <div className="container-custom space-y-10 py-10">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
            {locale === 'fr' ? 'Veille technique' : 'Tech watch'}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="max-w-2xl text-gray-600 dark:text-gray-400">{t('description')}</p>
        </div>

        <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {topicsLabel}
            </p>
            {activeCategory && (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {locale === 'fr' ? 'Filtrage par' : 'Filtered by'}{' '}
                {getCategoryName(activeCategory, locale as Locale)}
              </span>
            )}
          </div>
          <CategoryFilter
            locale={locale}
            categories={categories}
            currentCategory={activeCategory}
          />
        </div>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {locale === 'fr'
            ? 'Ajoutez des articles Markdown dans content/blog pour les afficher ici.'
            : 'Add Markdown articles in content/blog to display them here.'}
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
