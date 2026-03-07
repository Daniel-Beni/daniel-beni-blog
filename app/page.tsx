import Link from 'next/link';
import {ChevronRight} from 'lucide-react';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n';
import {domains, getDomainContentCount} from '@/lib/domains';
import type {Locale} from '@/types/content';

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const isFr = locale === 'fr';

  // Precompute content counts for each domain
  const domainData = domains.map((domain) => ({
    ...domain,
    count: getDomainContentCount(domain, locale as Locale),
  }));

  return (
    <div className="container-narrow">
      {/* Hero - centered, simple, like Odin's dashboard */}
      <section className="pb-8 pt-16 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
          
        </div>
        <h1 className="text-base font-semibold text-gray-900">Daniel</h1>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-gray-500">
          {isFr
            ? 'Je documente mon apprentissage en ingénierie logicielle, Cloud, DevOps et IA. Explorez mes projets, guides et labs par domaine.'
            : 'I document my learning in software engineering, Cloud, DevOps and AI. Explore my projects, guides and labs by domain.'}
        </p>
      </section>

      {/* Section title - centered like Odin's "Skills Progress" */}
      <h2 className="pb-4 pt-4 text-center text-lg font-semibold text-gray-900">
        {isFr ? 'Domaines' : 'Domains'}
      </h2>

      {/* Domain list - like Odin's path list */}
      <div className="mb-16">
        {domainData.map((domain) => (
          <Link
            key={domain.id}
            href={`/${locale}/domain/${domain.id}`}
            className="group flex items-center gap-5 border-b border-gray-100 px-0 py-5 transition-colors last:border-b-0 hover:bg-gray-50 hover:-mx-4 hover:px-4 hover:rounded-lg"
          >
            {/* Progress circle with count */}
            <div
              className={`flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full border-[3px] ${
                domain.count > 0
                  ? 'border-teal-500'
                  : 'border-gray-200'
              }`}
            >
              <span
                className={`font-mono text-xs font-medium ${
                  domain.count > 0 ? 'text-teal-600' : 'text-gray-400'
                }`}
              >
                {domain.count}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-gray-900">
                {domain.name[locale as Locale]}
              </h3>
              <p className="text-[13px] text-gray-400">
                {domain.count} {isFr ? 'contenus' : 'items'} · {domain.description[locale as Locale]}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
