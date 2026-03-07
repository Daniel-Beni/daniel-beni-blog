import { getAllSlugs, getAllArticles } from '@/lib/content';
import type { Locale, Article } from '@/types/content';

export type Domain = {
  id: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  icon: string;
  count: number;
};

// Configuration des domaines avec de vrais overviews (style Odin Project)
export const domains: Domain[] = [
  {
    id: 'devops',
    titleFr: 'DevOps & Cloud',
    titleEn: 'DevOps & Cloud',
    descFr: "Maîtrisez l'infrastructure moderne. Apprenez à déployer, gérer et mettre à l'échelle des applications de manière automatisée et résiliente.",
    descEn: 'Master modern infrastructure. Learn to deploy, manage, and scale applications in an automated and resilient way.',
    icon: '☁️',
    count: 0,
  },
  {
    id: 'backend',
    titleFr: 'Backend & API',
    titleEn: 'Backend & API',
    descFr: 'Concevez les fondations du web. Construisez des serveurs robustes, des bases de données optimisées et des API performantes.',
    descEn: 'Design the foundations of the web. Build robust servers, optimized databases, and high-performance APIs.',
    icon: '⚙️',
    count: 0,
  },
  {
    id: 'frontend',
    titleFr: 'Frontend & Mobile',
    titleEn: 'Frontend & Mobile',
    descFr: 'Donnez vie aux interfaces. Créez des expériences utilisateurs interactives, accessibles et réactives sur tous les écrans.',
    descEn: 'Bring interfaces to life. Create interactive, accessible, and responsive user experiences across all screens.',
    icon: '🎨',
    count: 0,
  },
  {
    id: 'network',
    titleFr: 'Réseaux & Sécurité',
    titleEn: 'Networking & Security',
    descFr: 'Comprenez et protégez le web. Explorez les protocoles de communication, l\'administration système et les principes de cybersécurité.',
    descEn: 'Understand and protect the web. Explore communication protocols, system administration, and cybersecurity principles.',
    icon: '🔒',
    count: 0,
  },
  {
    id: 'data',
    titleFr: 'Data & IA',
    titleEn: 'Data & AI',
    descFr: 'Exploitez le pouvoir de la donnée. Entraînez des modèles d\'apprentissage automatique et construisez des algorithmes intelligents.',
    descEn: 'Harness the power of data. Train machine learning models and build intelligent algorithms.',
    icon: '📊',
    count: 0,
  },
  {
    id: 'dsa',
    titleFr: 'Algorithmique (DSA)',
    titleEn: 'Algorithms (DSA)',
    descFr: 'Aiguisez votre logique. Résolvez des problèmes complexes, optimisez votre code et maîtrisez les structures de données.',
    descEn: 'Sharpen your logic. Solve complex problems, optimize your code, and master data structures.',
    icon: '🧠',
    count: 0,
  }
];

// Calcul dynamique du nombre d'articles
domains.forEach(domain => {
  try {
    if (domain.id === 'dsa') {
      domain.count = getAllSlugs('dsa', 'fr').length;
    } else {
      domain.count = getAllSlugs('blog', 'fr').filter(slug => slug.includes(domain.id)).length;
    }
  } catch (e) {
    domain.count = 0;
  }
});

export function getDomainById(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}

export function getDomainArticles(domain: Domain, locale: Locale): Article[] {
  if (domain.id === 'dsa') {
    return getAllArticles('dsa', locale);
  }
  return getAllArticles('blog', locale).filter((article) => 
    article.slug.startsWith(`${domain.id}/`)
  );
}