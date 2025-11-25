import {UserRound} from 'lucide-react';
import {unstable_setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n';

export default async function AboutPage({
  params
}: {
  params: {locale: string};
}) {
  const {locale} = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  const intro =
    locale === 'fr'
      ? "Salut, je suis Daniel. Ce blog est l'endroit où je documente ma veille technologique et mes expériences en Cloud, DevOps, backend, réseautique et IA."
      : 'Hi, I am Daniel. This blog is where I document my tech watch and experiments in Cloud, DevOps, backend, networking and AI.';


  return (
    <div className="container-custom space-y-6 py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300">
          <UserRound className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
            {locale === 'fr' ? 'A propos' : 'About'}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {locale === 'fr' ? 'Tech Watch Blog' : 'Tech Watch Blog'}
          </h1>
        </div>
      </div>

      <p className="text-lg text-gray-700 dark:text-gray-300">{intro}</p>
      

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {locale === 'fr' ? 'Ce que vous trouverez ici' : 'What you will find here'}
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
          <li>
            {locale === 'fr'
              ? 'Guides pratiques et retours d\'expérience sur le cloud et le DevOps.'
              : 'Practical guides and experience reports on cloud and DevOps.'}
          </li>
          <li>
            {locale === 'fr'
              ? 'Labs pas à pas pour tester des stacks complètes.'
              : 'Step-by-step labs to try full stacks.'}
          </li>
          <li>
            {locale === 'fr'
              ? 'Projets personnels avec code source et architecture.'
              : 'Personal projects with source code and architecture notes.'}
          </li>
        </ul>
      </div>
    </div>
  );
}
