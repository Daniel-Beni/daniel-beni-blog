import {Code2} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {ArticleCard} from '@/components/blog/ArticleCard';
import {getAllArticles} from '@/lib/content';
import type {Locale} from '@/types/content';
import {locales} from '@/i18n';

export async function generateMetadata({
  params,
}: {
  params: {locale: string};
}): Promise<Metadata> {
  const {locale} = params;
  const isFr = locale === 'fr';
  return {
    title: isFr
      ? 'Structures de données & Algorithmes — Daniel Beni'
      : 'Data Structures & Algorithms — Daniel Beni',
    description: isFr
      ? 'Solutions LeetCode documentées avec analyse de complexité et patterns algorithmiques.'
      : 'Documented LeetCode solutions with complexity analysis and algorithmic patterns.',
    alternates: {
      canonical: `https://www.danielbeni.com/${locale}/dsa`,
      languages: {fr: '/fr/dsa', en: '/en/dsa'},
    },
  };
}

export default async function DsaPage({
  params,
}: {
  params: {locale: string};
}) {
  const {locale} = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'dsa'});
  const articles = getAllArticles('dsa', locale as Locale, {sortBy: 'date'});

  return (
    <div className="container-custom space-y-10 py-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
          DSA
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('title')}
        </h1>
        <p className="max-w-2xl text-gray-600 dark:text-gray-400">
          {t('description')}
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300">
            <Code2 className="h-6 w-6" />
          </div>
          <p className="mt-4 font-semibold">
            {locale === 'fr'
              ? 'Les solutions DSA arrivent bientôt.'
              : 'DSA solutions are coming soon.'}
          </p>
          <p className="text-sm">
            {locale === 'fr'
              ? 'Utilisez le script scripts/new-dsa.js pour créer un nouveau problème.'
              : 'Use scripts/new-dsa.js to create a new problem.'}
          </p>
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
