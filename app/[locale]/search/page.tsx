import {SearchBar} from '@/components/search/SearchBar';
import {ArticleCard} from '@/components/blog/ArticleCard';
import {searchContent} from '@/lib/search';
import type {Locale} from '@/types/content';
import {locales} from '@/i18n';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

export default async function SearchPage({
  params,
  searchParams
}: {
  params: {locale: string};
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const {locale} = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const queryParam = searchParams.q;
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam || '';

  const t = await getTranslations({locale, namespace: 'search'});
  const results = query
    ? searchContent(query, locale as Locale, {limit: 24, types: ['blog']})
    : [];

  return (
    <div className="container-custom space-y-8 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
          {locale === 'fr' ? 'Recherche' : 'Search'}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('placeholder')}
        </h1>
      </header>

      <SearchBar locale={locale} initialQuery={query} placeholder={await t('placeholder')} autoFocus />

      {query && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('showing', {count: results.length})} – {t('resultsFor')} "{query}"
        </p>
      )}

      {!query ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {locale === 'fr'
            ? 'Tapez quelques mots-clés pour lancer une recherche.'
            : 'Type a few keywords to start searching.'}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {t('noResults')}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <ArticleCard
              key={`${result.type}-${result.slug}`}
              article={{
                slug: result.slug,
                content: '',
                readingTime: 0,
                type: result.type,
                frontmatter: {
                  title: result.title,
                  description: result.description,
                  date: result.date,
                  author: '',
                  category: result.category,
                  tags: result.tags,
                  language: locale as Locale,
                  published: true
                }
              }}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
