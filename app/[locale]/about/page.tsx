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
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
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
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const isFr = locale === 'fr';

  const intro = isFr
    ? "Je suis Daniel Beni Niyobuzima, étudiant ingénieur en développement logiciel, cloud computing et intelligence artificielle à ISEN Méditerranée (Toulon). Ce site documente ma veille technologique, mes labs pratiques et ma progression en algorithmique."
    : "I'm Daniel Beni Niyobuzima, a software engineering student specializing in cloud computing and AI at ISEN Méditerranée (Toulon). This site documents my tech watch, hands-on labs, and progress in algorithms.";

  const goal = isFr
    ? "Objectif : rejoindre une équipe dynamique et exigeante (cloud, backend, DevOps ou IA) où je peux appliquer et approfondir ces compétences."
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
      title: isFr ? 'Licence Informatique' : 'Computer Science degree',
      org: isFr ? 'Université de Limoges' : 'University of Limoges',
      detail: isFr ? 'Licence' : 'Bachelor',
    },
    {
      period: '2020 – 2022',
      title: isFr ? 'Administrateur systèmes et réseaux' : 'Systems & network administrator',
      org: 'BRARUDI (Heineken)',
      detail: isFr ? 'Infrastructure, support, déploiements' : 'Infrastructure, support, deployments',
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
    <div className="mx-auto max-w-[780px] space-y-12 py-12 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getProfilePageJsonLd(locale as Locale)),
        }}
      />
      
      {/* Header Profile */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <UserRound className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Daniel Beni Niyobuzima
          </h1>
          <p className="mt-2 flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            Toulon, France
          </p>
        </div>
      </header>

      {/* Intro Text */}
      <section className="prose prose-lg text-gray-700">
        <p>{intro}</p>
        <p className="font-medium text-gray-900">{goal}</p>
      </section>

      <hr className="border-gray-100" />

      {/* Links */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          {isFr ? 'Réseaux & Liens' : 'Links & Networks'}
        </h2>
        <div className="flex flex-col gap-3">
          {proofLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-gray-700 transition-colors hover:text-primary-600"
            >
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
              <span className="font-medium">{link.label}</span>
              <span className="text-gray-500">— {link.desc}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Code2 className="h-6 w-6 text-primary-600" />
          {isFr ? 'Compétences Techniques' : 'Technical Skills'}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {skillsByDomain.map((domain) => (
            <div key={domain.title}>
              <h3 className="mb-3 font-semibold text-gray-900">{domain.title}</h3>
              <ul className="flex flex-wrap gap-2">
                {domain.items.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Experience / Timeline */}
      <section>
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
          <GraduationCap className="h-6 w-6 text-primary-600" />
          {isFr ? 'Parcours' : 'Background'}
        </h2>
        <div className="space-y-6">
          {timeline.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:gap-6">
              <div className="mb-1 shrink-0 sm:mb-0 sm:w-40">
                <span className="text-sm font-medium text-gray-500">{item.period}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="font-medium text-primary-600">{item.org}</p>
                <p className="mt-1 text-gray-600">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}