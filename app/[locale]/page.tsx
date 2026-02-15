import Link from 'next/link';
import {BookOpen, FolderGit2, FlaskConical, ArrowRight, Sparkles, Code2} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArticleCard} from '@/components/blog/ArticleCard';
import {Badge} from '@/components/ui/Badge';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/Card';
import {getAllArticles} from '@/lib/content';
import type {Locale} from '@/types/content';
import {locales} from '@/i18n';
import {notFound} from 'next/navigation';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'home'});
  const featuredArticles = getAllArticles('blog', locale as Locale, {
    featured: true,
    limit: 3
  });
  const latestArticles = getAllArticles('blog', locale as Locale, {
    limit: 3
  });
  const latestDsa = getAllArticles('dsa', locale as Locale, {limit: 3});

  const categories = [
    {id: 'cloud', label: t('categories.cloud')},
    {id: 'devops', label: t('categories.devops')},
    {id: 'backend', label: t('categories.backend')},
    {id: 'networking', label: t('categories.networking')},
    {id: 'ai-data', label: t('categories.ai')},
    {id: 'emerging-tech', label: t('categories.emerging')}
  ];

  return (
    <div className="space-y-16">
      <section className="bg-gradient-to-br from-primary-600/10 via-white to-purple-600/10 py-16 dark:from-primary-900/20 dark:via-gray-950 dark:to-purple-900/10">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Badge variant="primary" className="text-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              {t('hero.greeting')}
            </Badge>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/blog`}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                {t('hero.cta.blog')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/projects`}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                {t('hero.cta.projects')}
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
                <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                Blog, guides, veille tech
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
                <FlaskConical className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                Labs pratiques
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
                <FolderGit2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                Projets open-source
              </span>
            </div>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'fr' ? 'Thèmes principaux' : 'Main Topics'}</CardTitle>
                <CardDescription>
                  {locale === 'fr'
                    ? 'Cloud, DevOps, backend, réseau, IA et nouvelles tendances technologiques.'
                    : 'Cloud, DevOps, backend, networking, AI and emerging tech.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.label}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'fr' ? 'Formats' : 'Formats'}</CardTitle>
                <CardDescription>
                  {locale === 'fr'
                    ? 'Articles, séries, labs guidés, notes et projets.'
                    : 'Articles, series, guided labs, notes and projects.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {['Blog', 'Labs', 'Projects', 'Series', 'Notes'].map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-custom space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
              {locale === 'fr' ? 'Le meilleur du moment' : 'Top picks'}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('featured.title')}
            </h2>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {t('featured.viewAll')}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {featuredArticles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
            {locale === 'fr'
              ? 'Ajoutez un article avec le champ featured: true pour le voir ici.'
              : 'Add an article with featured: true to showcase it here.'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        )}
      </section>

      <section className="container-custom space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
              {locale === 'fr' ? 'Dernières publications' : 'Latest posts'}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {locale === 'fr' ? 'Nouveaux articles' : 'New articles'}
            </h2>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {locale === 'fr' ? 'Voir tout' : 'View all'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {latestArticles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
            {locale === 'fr'
              ? 'Aucun article publié pour le moment.'
              : 'No articles published yet.'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        )}
      </section>

      <section className="container-custom space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
              {locale === 'fr' ? 'DSA' : 'DSA'}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {locale === 'fr' ? 'Dernières solutions DSA' : 'Latest DSA solutions'}
            </h2>
          </div>
          <Link
            href={`/${locale}/dsa`}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {locale === 'fr' ? 'Voir tout' : 'View all'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {latestDsa.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
            <Code2 className="mx-auto mb-2 h-10 w-10 text-primary-500 dark:text-primary-400" />
            <p className="text-sm">
              {locale === 'fr'
                ? 'Les solutions LeetCode apparaîtront ici. Utilisez scripts/new-dsa.js pour en ajouter.'
                : 'LeetCode solutions will appear here. Use scripts/new-dsa.js to add some.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestDsa.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
