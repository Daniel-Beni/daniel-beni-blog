import {getAllArticles} from '@/lib/content';
import type {Category, Locale} from '@/types/content';

export interface Domain {
  id: string;
  icon: string;
  categories: Category[];
  name: {fr: string; en: string};
  description: {fr: string; en: string};
  accentColor: string; // tailwind text color for the progress circle
}

export const domains: Domain[] = [
  {
    id: 'devops-cloud',
    icon: '☁️',
    categories: ['cloud', 'devops'],
    name: {fr: 'DevOps & Cloud', en: 'DevOps & Cloud'},
    description: {
      fr: 'Docker, Kubernetes, CI/CD GitLab, AWS',
      en: 'Docker, Kubernetes, GitLab CI/CD, AWS',
    },
    accentColor: 'text-teal-600',
  },
  {
    id: 'backend-api',
    icon: '⚙️',
    categories: ['backend'],
    name: {fr: 'Backend & API', en: 'Backend & API'},
    description: {
      fr: 'Python, Django, REST, microservices',
      en: 'Python, Django, REST, microservices',
    },
    accentColor: 'text-blue-600',
  },
  {
    id: 'frontend-mobile',
    icon: '🎨',
    categories: ['emerging-tech'],
    name: {fr: 'Frontend & Mobile', en: 'Frontend & Mobile'},
    description: {
      fr: 'Next.js, React, Vue.js, Kotlin',
      en: 'Next.js, React, Vue.js, Kotlin',
    },
    accentColor: 'text-purple-600',
  },
  {
    id: 'network-security',
    icon: '🔒',
    categories: ['networking'],
    name: {fr: 'Réseaux & Sécurité', en: 'Networks & Security'},
    description: {
      fr: 'TCP/IP, Cisco, cybersécurité, Rust',
      en: 'TCP/IP, Cisco, cybersecurity, Rust',
    },
    accentColor: 'text-orange-600',
  },
  {
    id: 'data-ai',
    icon: '🧠',
    categories: ['ai-data'],
    name: {fr: 'Data & IA', en: 'Data & AI'},
    description: {
      fr: 'CNN, Transfer Learning, deep learning',
      en: 'CNN, Transfer Learning, deep learning',
    },
    accentColor: 'text-pink-600',
  },
  {
    id: 'dsa',
    icon: '🧩',
    categories: ['dsa'],
    name: {fr: 'Algorithmique (DSA)', en: 'Algorithms (DSA)'},
    description: {
      fr: 'LeetCode, NeetCode 150',
      en: 'LeetCode, NeetCode 150',
    },
    accentColor: 'text-amber-600',
  },
];

/**
 * Count all content items across content types for a given domain
 */
export function getDomainContentCount(domain: Domain, locale: Locale): number {
  let count = 0;

  // For DSA domain, count from 'dsa' content type
  if (domain.id === 'dsa') {
    count += getAllArticles('dsa', locale).length;
    return count;
  }

  // For other domains, count from blog (and later labs, projects)
  for (const category of domain.categories) {
    count += getAllArticles('blog', locale, {category}).length;
    // Uncomment when you have labs/projects content:
    // count += getAllArticles('lab', locale, {category}).length;
    // count += getAllArticles('project', locale, {category}).length;
  }

  return count;
}

/**
 * Get all articles for a domain across its categories
 */
export function getDomainArticles(domain: Domain, locale: Locale) {
  if (domain.id === 'dsa') {
    return getAllArticles('dsa', locale, {sortBy: 'date'});
  }

  const articles = domain.categories.flatMap((category) =>
    getAllArticles('blog', locale, {category})
  );

  // Sort by date descending
  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

/**
 * Find a domain by its id
 */
export function getDomainById(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}
