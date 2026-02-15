import {UserRound, MapPin, GraduationCap, Briefcase, Code2, ExternalLink} from 'lucide-react';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {locales} from '@/i18n';
import {getProfilePageJsonLd} from '@/lib/jsonld';
import type {Locale} from '@/types/content';

export async function generateMetadata({
  params,
}: {
  params: {locale: string};
}): Promise<Metadata> {
  const {locale} = params;
  const isFr = locale === 'fr';
  return {
    title: isFr
      ? 'À propos — Daniel Beni Niyobuzima'
      : 'About — Daniel Beni Niyobuzima',
    description: isFr
      ? 'Étudiant ingénieur en développement logiciel, cloud computing et IA. Parcours, compétences et liens.'
      : 'Software engineering student specializing in cloud computing and AI. Background, skills and links.',
    alternates: {
      canonical: `https://www.danielbeni.com/${locale}/about`,
      languages: {fr: '/fr/about', en: '/en/about'},
    },
    openGraph: {
      title: 'Daniel Beni Niyobuzima',
      description: isFr
        ? 'Portfolio technique — Cloud, DevOps, Backend, IA'
        : 'Technical portfolio — Cloud, DevOps, Backend, AI',
      url: `https://www.danielbeni.com/${locale}/about`,
      type: 'profile',
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: {locale: string};
}) {
  const {locale} = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const isFr = locale === 'fr';

  const intro = isFr
    ? "Je suis Daniel Beni Niyobuzima, étudiant ingénieur en développement logiciel, cloud computing et intelligence artificielle à ISEN Méditerranée (Toulon). Ce site documente ma veille technologique, mes labs pratiques et ma progression en algorithmique."
    : "I'm Daniel Beni Niyobuzima, a software engineering student specializing in cloud computing and AI at ISEN Méditerranée (Toulon). This site documents my tech watch, hands-on labs, and progress in algorithms.";

  const goal = isFr
    ? "Objectif : rejoindre une équipe technique exigeante (cloud, backend, DevOps ou IA) où je peux appliquer et approfondir ces compétences."
    : "Goal: join a demanding technical team (cloud, backend, DevOps or AI) where I can apply and deepen these skills.";

  const timeline = [
    {
      period: isFr ? '2024 – aujourd\'hui' : '2024 – present',
      title: isFr ? 'Étudiant ingénieur' : 'Engineering student',
      org: 'ISEN Méditerranée',
      detail: isFr ? 'Ingénierie logicielle & cloud' : 'Software & cloud engineering',
    },
    {
      period: '2022 – 2024',
      title: isFr ? 'Administrateur systèmes et réseaux' : 'Systems & network administrator',
      org: 'BRARUDI (Heineken)',
      detail: isFr ? 'Infrastructure, support, déploiements' : 'Infrastructure, support, deployments',
    },
    {
      period: '2020 – 2022',
      title: isFr ? 'Licence Informatique' : 'Computer Science degree',
      org: isFr ? 'Université de Limoges' : 'University of Limoges',
      detail: isFr ? 'Licence' : 'Bachelor',
    },
    {
      period: '2018 – 2020',
      title: isFr ? 'DUT Systèmes et Réseaux' : 'DUT Systems & Networks',
      org: isFr ? 'Burundi' : 'Burundi',
      detail: 'DUT',
    },
  ];

  const skillsByDomain = [
    {
      title: isFr ? 'Cloud & DevOps' : 'Cloud & DevOps',
      items: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Git'],
    },
    {
      title: isFr ? 'Développement' : 'Development',
      items: ['Python', 'TypeScript', 'Next.js', 'Rust', 'Java', 'C++'],
    },
    {
      title: isFr ? 'IA & Data' : 'AI & Data',
      items: ['Machine Learning', 'Algorithmes', 'Structures de données'],
    },
  ];

  const proofLinks = [
    { label: 'GitHub', href: 'https://github.com/Daniel-Beni', desc: isFr ? 'Repos et contributions' : 'Repos and contributions' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/daniel-beni/', desc: isFr ? 'Parcours et expérience' : 'Profile and experience' },
    { label: 'GitLab', href: 'https://gitlab.com/Daniel_Beni', desc: isFr ? 'Projets académiques' : 'Academic projects' },
  ];

  return (
    <div className="container-custom space-y-10 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getProfilePageJsonLd(locale as Locale)),
        }}
      />
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300">
          <UserRound className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
            {isFr ? 'À propos' : 'About'}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Daniel Beni Niyobuzima
          </h1>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            Toulon, France
          </p>
        </div>
      </header>

      <p className="max-w-3xl text-lg text-gray-700 dark:text-gray-300">
        {intro}
      </p>
      <p className="max-w-3xl text-gray-600 dark:text-gray-400">
        {goal}
      </p>

      <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
          <GraduationCap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          {isFr ? 'Parcours' : 'Background'}
        </h2>
        <ul className="space-y-4">
          {timeline.map((item, i) => (
            <li key={i} className="border-l-2 border-primary-200 pl-4 dark:border-primary-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.period}</span>
              <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
              <p className="text-primary-600 dark:text-primary-400">{item.org}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
          <Code2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          {isFr ? 'Compétences' : 'Skills'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {skillsByDomain.map((domain) => (
            <div key={domain.title}>
              <h3 className="mb-2 font-medium text-gray-800 dark:text-gray-200">{domain.title}</h3>
              <ul className="flex flex-wrap gap-2">
                {domain.items.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
          <Briefcase className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          {isFr ? 'Ce que vous trouverez sur ce site' : 'What you will find here'}
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
          <li>
            {isFr
              ? 'Articles de veille et retours d\'expérience sur le cloud, DevOps et l\'IA.'
              : 'Tech watch articles and experience reports on cloud, DevOps and AI.'}
          </li>
          <li>
            {isFr
              ? 'Labs pas à pas avec code source et résultats.'
              : 'Step-by-step labs with source code and results.'}
          </li>
          <li>
            {isFr
              ? 'Projets avec repos GitHub et architecture.'
              : 'Projects with GitHub repos and architecture notes.'}
          </li>
          <li>
            {isFr
              ? 'Solutions DSA (LeetCode) avec analyse de complexité et patterns.'
              : 'DSA solutions (LeetCode) with complexity analysis and patterns.'}
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {isFr ? 'Liens' : 'Links'}
        </h2>
        <div className="flex flex-wrap gap-4">
          {proofLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ExternalLink className="h-4 w-4" />
              {link.label}
              <span className="text-sm text-gray-500 dark:text-gray-400">— {link.desc}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
