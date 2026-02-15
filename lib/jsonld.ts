import { Article, Locale } from '@/types/content';

const SITE_URL = 'https://www.danielbeni.com';

const authorJsonLd = {
  '@type': 'Person',
  name: 'Daniel Beni Niyobuzima',
  url: SITE_URL,
  sameAs: [
    'https://github.com/Daniel-Beni',
    'https://www.linkedin.com/in/daniel-beni/',
    'https://gitlab.com/Daniel_Beni',
  ],
  jobTitle: 'Étudiant Ingénieur Logiciel & Cloud',
  knowsAbout: [
    'Cloud Computing', 'DevOps', 'Docker', 'Kubernetes',
    'Python', 'TypeScript', 'CI/CD', 'Machine Learning',
  ],
};

/**
 * JSON-LD pour les articles de blog — Schema type: TechArticle
 */
export function getBlogPostingJsonLd(article: Article, locale: Locale) {
  const url = `${SITE_URL}/${locale}/blog/${article.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.frontmatter.title,
    description: article.frontmatter.description,
    url,
    datePublished: article.frontmatter.date,
    dateModified: article.frontmatter.lastModified || article.frontmatter.date,
    author: authorJsonLd,
    publisher: {
      '@type': 'Person',
      name: 'Daniel Beni Niyobuzima',
      url: SITE_URL,
    },
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
    keywords: article.frontmatter.tags.join(', '),
    proficiencyLevel:
      article.frontmatter.difficulty === 'beginner'
        ? 'Beginner'
        : article.frontmatter.difficulty === 'advanced'
          ? 'Expert'
          : 'Intermediate',
    timeRequired: `PT${article.readingTime}M`,
    ...(article.frontmatter.githubRepo && {
      codeRepository: article.frontmatter.githubRepo,
    }),
  };
}

/**
 * JSON-LD pour les labs — Schema type: HowTo
 */
export function getLabJsonLd(article: Article, locale: Locale) {
  const url = `${SITE_URL}/${locale}/labs/${article.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: article.frontmatter.title,
    description: article.frontmatter.description,
    url,
    datePublished: article.frontmatter.date,
    dateModified: article.frontmatter.lastModified || article.frontmatter.date,
    author: authorJsonLd,
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
    totalTime: article.frontmatter.duration || `PT${article.readingTime}M`,
    tool: article.frontmatter.tags.map((tag) => ({
      '@type': 'HowToTool',
      name: tag,
    })),
    ...(article.frontmatter.githubRepo && {
      codeRepository: article.frontmatter.githubRepo,
    }),
  };
}

/**
 * JSON-LD pour les projets — Schema type: SoftwareSourceCode
 */
export function getProjectJsonLd(article: Article, locale: Locale) {
  const url = `${SITE_URL}/${locale}/projects/${article.slug}`;
  const langTags = ['python', 'typescript', 'javascript', 'rust', 'java', 'c++', 'go', 'c'];
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: article.frontmatter.title,
    description: article.frontmatter.description,
    url,
    datePublished: article.frontmatter.date,
    dateModified: article.frontmatter.lastModified || article.frontmatter.date,
    author: authorJsonLd,
    programmingLanguage: article.frontmatter.tags.filter((t) =>
      langTags.includes(t.toLowerCase())
    ),
    ...(article.frontmatter.githubRepo && {
      codeRepository: article.frontmatter.githubRepo,
    }),
    ...(article.frontmatter.liveDemo && {
      installUrl: article.frontmatter.liveDemo,
    }),
  };
}

/**
 * JSON-LD pour la page About — Schema type: ProfilePage
 */
export function getProfilePageJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      ...authorJsonLd,
      '@type': 'Person',
      description:
        locale === 'fr'
          ? 'Étudiant ingénieur en développement logiciel, cloud computing et intelligence artificielle à ISEN Méditerranée. Expérience en administration systèmes et réseaux chez BRARUDI (Heineken).'
          : 'Software engineering student specializing in cloud computing and AI at ISEN Méditerranée. Background in systems and network administration at BRARUDI (Heineken).',
      alumniOf: [
        {
          '@type': 'EducationOrganization',
          name: 'ISEN Méditerranée',
          department: 'Ingénierie Logicielle & Cloud',
        },
        {
          '@type': 'EducationOrganization',
          name: 'Université de Limoges',
          department: 'Informatique',
        },
      ],
      knowsAbout: [
        'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Python',
        'TypeScript', 'Next.js', 'Machine Learning', 'DevOps',
        'Linux', 'Git', 'Rust', 'Java', 'C++',
      ],
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          name: 'DUT Systèmes et Réseaux',
        },
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Étudiant Ingénieur Logiciel',
        occupationLocation: { '@type': 'City', name: 'Toulon' },
      },
    },
  };
}

/**
 * JSON-LD pour le contenu DSA — Schema type: TechArticle + étendu
 */
export function getDsaJsonLd(article: Article, locale: Locale) {
  const url = `${SITE_URL}/${locale}/dsa/${article.slug}`;
  const fm = article.frontmatter as any;
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.frontmatter.title,
    description: article.frontmatter.description,
    url,
    datePublished: article.frontmatter.date,
    dateModified: article.frontmatter.lastModified || article.frontmatter.date,
    author: authorJsonLd,
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
    keywords: article.frontmatter.tags.join(', '),
    proficiencyLevel:
      fm.leetcode_difficulty === 'easy'
        ? 'Beginner'
        : fm.leetcode_difficulty === 'hard'
          ? 'Expert'
          : 'Intermediate',
    timeRequired: `PT${article.readingTime}M`,
    ...(article.frontmatter.githubRepo && {
      codeRepository: article.frontmatter.githubRepo,
    }),
    ...(fm.leetcode_url && {
      isBasedOn: fm.leetcode_url,
    }),
  };
}
