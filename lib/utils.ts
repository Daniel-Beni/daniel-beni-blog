import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Locale } from '@/types/content';

/**
 * Fusionne les classes Tailwind avec clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate une date selon la locale
 */
export function formatDate(
  date: string | Date,
  locale: Locale,
  formatStr = 'PP'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'fr' ? fr : enUS;
  return format(dateObj, formatStr, { locale: localeObj });
}

/**
 * Retourne une date relative (ex: "il y a 2 jours")
 */
export function formatRelativeDate(date: string | Date, locale: Locale): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'fr' ? fr : enUS;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: localeObj });
}

/**
 * Génère un slug à partir d'une chaîne
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Tronque un texte à une longueur donnée
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Extrait le texte brut du contenu Markdown
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
    .replace(/`(.+?)`/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/>\s/g, '') // Blockquotes
    .replace(/^\s*[-*+]\s/gm, '') // Lists
    .trim();
}

/**
 * Génère un extrait du contenu
 */
export function generateExcerpt(content: string, length = 160): string {
  const stripped = stripMarkdown(content);
  return truncate(stripped, length);
}

/**
 * Obtient le nom lisible d'une catégorie
 */
export function getCategoryName(
  category: string,
  locale: Locale
): string {
  const categories: Record<string, { fr: string; en: string }> = {
    'cloud': { fr: 'Cloud Computing', en: 'Cloud Computing' },
    'devops': { fr: 'DevOps & CI/CD', en: 'DevOps & CI/CD' },
    'backend': { fr: 'Backend Development', en: 'Backend Development' },
    'networking': { fr: 'Réseau & Sécurité', en: 'Network & Security' },
    'ai-data': { fr: 'IA & Data Science', en: 'AI & Data Science' },
    'emerging-tech': { fr: 'Technologies Émergentes', en: 'Emerging Technologies' },
  };

  return categories[category]?.[locale] || category;
}

/**
 * Obtient la couleur d'une catégorie
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'cloud': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'devops': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'backend': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'networking': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'ai-data': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'emerging-tech': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  };

  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
}

/**
 * Obtient le niveau de difficulté traduit
 */
export function getDifficultyLabel(
  difficulty: string,
  locale: Locale
): string {
  const labels: Record<string, { fr: string; en: string }> = {
    'beginner': { fr: 'Débutant', en: 'Beginner' },
    'intermediate': { fr: 'Intermédiaire', en: 'Intermediate' },
    'advanced': { fr: 'Avancé', en: 'Advanced' },
  };

  return labels[difficulty]?.[locale] || difficulty;
}

/**
 * Copie du texte dans le presse-papiers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * Détermine si on est côté client
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Génère une URL de partage Twitter
 */
export function getTwitterShareUrl(title: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
}

/**
 * Génère une URL de partage LinkedIn
 */
export function getLinkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;
}

/**
 * Génère une URL de partage par email
 */
export function getEmailShareUrl(title: string, url: string): string {
  return `mailto:?subject=${encodeURIComponent(
    title
  )}&body=${encodeURIComponent(url)}`;
}
