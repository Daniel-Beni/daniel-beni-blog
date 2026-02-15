import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/content';
import { Locale, ContentType } from '@/types/content';

const SITE_URL = 'https://www.danielbeni.com';
const locales: Locale[] = ['fr', 'en'];
const contentTypes: ContentType[] = ['blog', 'lab', 'project', 'dsa'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Pages statiques
  for (const locale of locales) {
    entries.push(
      { url: `${SITE_URL}/${locale}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
      { url: `${SITE_URL}/${locale}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${SITE_URL}/${locale}/labs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${SITE_URL}/${locale}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${SITE_URL}/${locale}/dsa`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
      { url: `${SITE_URL}/${locale}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    );
  }

  // Contenu dynamique
  for (const type of contentTypes) {
    for (const locale of locales) {
      try {
        const slugs = getAllSlugs(type, locale);
        for (const slug of slugs) {
          entries.push({
            url: `${SITE_URL}/${locale}/${type}/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      } catch {
        // Content type directory might not exist yet
      }
    }
  }

  return entries;
}
