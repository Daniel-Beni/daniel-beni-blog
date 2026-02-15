import {FlaskConical, Rocket} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n';

export default async function LabsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'labs'});

  return (
    <div className="container-custom space-y-8 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Labs
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="max-w-2xl text-gray-600 dark:text-gray-400">{t('description')}</p>
      </header>

      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300">
          <FlaskConical className="h-6 w-6" />
        </div>
        <p className="mt-4 font-semibold">
          {locale === 'fr'
            ? 'Les labs arrivent bientôt.'
            : 'Labs are coming soon.'}
        </p>
        <p className="text-sm">
          {locale === 'fr'
            ? 'Ajoutez du contenu dans content/labs pour les afficher ici.'
            : 'Add Markdown content under content/labs to show them here.'}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-200">
          <Rocket className="h-4 w-4" />
          {locale === 'fr' ? 'En construction' : 'Work in progress'}
        </div>
      </div>
    </div>
  );
}
