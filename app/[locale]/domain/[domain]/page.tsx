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

// Group articles by a rough "format" based on tags or content type
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
  // Default: treat blog posts with project context as tutorials
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

  // Group articles by format
  const grouped: Record<string, Article[]> = {};
  for (const article of articles) {
    const format = getContentFormat(article);
    if (!grouped[format]) grouped[format] = [];
    grouped[format].push(article);
  }

  // Order of format sections
  const formatOrder: Array<keyof typeof formatConfig> = ['tutorial', 'guide', 'lab', 'note'];
  let globalIndex = 0;

  return (
    <div className="container-narrow">
      {/* Back link */}
      <div className="pt-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {isFr ? 'Accueil' : 'Home'}
        </Link>
      </div>

      {/* Domain header - centered like Odin */}
      <section className="pb-6 pt-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-3xl">
          {domain.icon}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {domain.name[locale as Locale]}
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {domain.description[locale as Locale]}
        </p>
      </section>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-5 pb-2 pt-2">
        {formatOrder.map((format) => (
          <div key={format} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${formatConfig[format].dotColor}`} />
            <span className="text-xs text-gray-400">
              {formatConfig[format].label[locale as Locale]}
            </span>
          </div>
        ))}
      </div>

      {/* Content list */}
      <div className="mb-16 mt-4">
        {articles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 px-6 py-12 text-center">
            <p className="text-sm text-gray-400">
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
              <div key={format}>
                {/* Section title */}
                <h3 className="pb-2 pt-8 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {formatConfig[format].label[locale as Locale]}
                </h3>

                {/* Items */}
                {items.map((article) => {
                  globalIndex += 1;
                  const contentType = article.type === 'dsa' ? 'dsa' : 'blog';

                  return (
                    <Link
                      key={article.slug}
                      href={`/${locale}/${contentType}/${article.slug}`}
                      className="group flex items-center gap-4 border-b border-gray-100 py-3.5 transition-colors last:border-b-0 hover:bg-gray-50 hover:-mx-3 hover:px-3 hover:rounded-md"
                    >
                      {/* Number */}
                      <span className="w-6 flex-shrink-0 text-center font-mono text-xs text-gray-300">
                        {globalIndex}
                      </span>

                      {/* Format dot */}
                      <div className={`h-2 w-2 flex-shrink-0 rounded-full ${formatConfig[format].dotColor}`} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-medium text-gray-800 group-hover:text-gray-900">
                          {article.frontmatter.title}
                        </h4>
                        <p className="mt-0.5 truncate text-xs text-gray-400">
                          {article.frontmatter.tags.slice(0, 4).join(' · ')}
                          {article.frontmatter.difficulty && (
                            <> — {getDifficultyLabel(article.frontmatter.difficulty, locale as Locale)}</>
                          )}
                        </p>
                      </div>

                      {/* Reading time */}
                      <span className="flex-shrink-0 font-mono text-xs text-gray-300">
                        {article.readingTime} min
                      </span>
                    </Link>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
