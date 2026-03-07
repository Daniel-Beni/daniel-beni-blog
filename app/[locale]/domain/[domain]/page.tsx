import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n';
import {domains, getDomainById, getDomainArticles} from '@/lib/domains';
import {getDifficultyLabel} from '@/lib/utils';
import type {Locale, Article} from '@/types/content';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    domains.map((domain) => ({
      locale,
      domain: domain.id,
    }))
  );
}

function getContentFormat(article: Article): 'tutorial' | 'guide' | 'lab' | 'note' {
  const tags = article.frontmatter.tags.map((t) => t.toLowerCase());
  const title = article.frontmatter.title.toLowerCase();

  if (tags.includes('post-mortem') || tags.includes('incident') || article.readingTime <= 5) {
    return 'note';
  }
  if (tags.includes('lab') || tags.includes('exercice') || tags.includes('hands-on')) {
    return 'lab';
  }
  if (
    tags.includes('guide') ||
    tags.includes('tutorial') ||
    title.includes('guide') ||
    title.includes('de a à z') ||
    title.includes('complet')
  ) {
    return 'guide';
  }
  return 'guide';
}

const formatConfig = {
  tutorial: {
    label: {fr: 'Tutoriels projets', en: 'Project tutorials'},
    dotColor: 'bg-blue-500',
  },
  guide: {
    label: {fr: 'Guides', en: 'Guides'},
    dotColor: 'bg-teal-500',
  },
  lab: {
    label: {fr: 'Labs pratiques', en: 'Practical labs'},
    dotColor: 'bg-orange-500',
  },
  note: {
    label: {fr: 'Notes & veille', en: 'Notes & watch'},
    dotColor: 'bg-purple-500',
  },
} as const;

export default async function DomainPage({
  params,
}: {
  params: Promise<{locale: string; domain: string}>;
}) {
  const {locale, domain: domainId} = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const domain = getDomainById(domainId);
  if (!domain) {
    notFound();
  }

  setRequestLocale(locale);
  const isFr = locale === 'fr';
  const articles = getDomainArticles(domain, locale as Locale);

  const grouped: Record<string, Article[]> = {};
  for (const article of articles) {
    const format = getContentFormat(article);
    if (!grouped[format]) grouped[format] = [];
    grouped[format].push(article);
  }

  const formatOrder: Array<keyof typeof formatConfig> = ['tutorial', 'guide', 'lab', 'note'];
  let globalIndex = 0;

  return (
    <div className="mx-auto max-w-[780px] px-4 sm:px-6">
      {/* Back link */}
      <div className="pt-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {isFr ? 'Retour au catalogue' : 'Back to catalogue'}
        </Link>
      </div>

      {/* Domain header */}
      <section className="pb-8 pt-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-3xl">
          {domain.icon}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isFr ? domain.titleFr : domain.titleEn}
        </h1>
        <p className="mt-2 text-gray-600">
          {isFr ? domain.descFr : domain.descEn}
        </p>
      </section>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pb-4 pt-2 border-b border-gray-100">
        {formatOrder.map((format) => (
          <div key={format} className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${formatConfig[format].dotColor}`} />
            <span className="text-sm font-medium text-gray-600">
              {formatConfig[format].label[locale as Locale]}
            </span>
          </div>
        ))}
      </div>

      {/* Content list */}
      <div className="mb-20 mt-8">
        {articles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 px-6 py-12 text-center">
            <p className="text-gray-500">
              {isFr
                ? 'Aucun contenu publié dans ce domaine pour le moment.'
                : 'No content published in this domain yet.'}
            </p>
          </div>
        ) : (
          formatOrder.map((format) => {
            const items = grouped[format];
            if (!items || items.length === 0) return null;

            return (
              <div key={format} className="mb-8">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {formatConfig[format].label[locale as Locale]}
                </h3>

                <div className="flex flex-col gap-2">
                  {items.map((article) => {
                    globalIndex += 1;
                    const contentType = article.type === 'dsa' ? 'dsa' : 'blog';

                    return (
                      <Link
                        key={article.slug}
                        href={`/${locale}/${contentType}/${article.slug}`}
                        className="group flex items-center gap-4 rounded-lg border border-transparent p-3 transition-colors hover:bg-gray-50 hover:border-gray-100"
                      >
                        <span className="w-8 flex-shrink-0 text-center font-mono text-sm text-gray-400 group-hover:text-primary-600">
                          {globalIndex.toString().padStart(2, '0')}
                        </span>

                        <div className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${formatConfig[format].dotColor}`} />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-gray-900 group-hover:text-primary-700">
                            {article.frontmatter.title}
                          </h4>
                          <p className="mt-1 truncate text-sm text-gray-500">
                            {article.frontmatter.tags.slice(0, 4).join(' · ')}
                            {article.frontmatter.difficulty && (
                              <> — {getDifficultyLabel(article.frontmatter.difficulty, locale as Locale)}</>
                            )}
                          </p>
                        </div>

                        <span className="hidden sm:block flex-shrink-0 font-mono text-sm text-gray-400">
                          {article.readingTime} min
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}