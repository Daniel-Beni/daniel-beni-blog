import {FolderGit2, Sparkles} from 'lucide-react';
import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n';

export default async function ProjectsPage({
  params
}: {
  params: {locale: string};
}) {
  const {locale} = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  unstable_setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'projects'});

  return (
    <div className="container-custom space-y-8 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Portfolio
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="max-w-2xl text-gray-600 dark:text-gray-400">{t('description')}</p>
      </header>

      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300">
          <FolderGit2 className="h-6 w-6" />
        </div>
      /*
        <p className="mt-4 font-semibold">
          {locale === 'fr'
            ? 'Ajoutez vos projets dans content/projects.'
            : 'Add your projects under content/projects.'}
        </p>
      */
        <p className="text-sm">
          {locale === 'fr'
            ? 'Ils apparaîtront ici avec leur stack, liens et statut.'
            : 'They will appear here with stack, links and status.'}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-200">
          <Sparkles className="h-4 w-4" />
          {locale === 'fr' ? 'Aucun projet publié pour le moment' : 'No projects yet'}
        </div>
      </div>
    </div>
  );
}
