/**
 * Type declarations for next when node_modules is not yet installed
 * or when package types are not resolved. Remove or ignore once npm install succeeds.
 */
declare module 'next' {
  export interface Metadata {
    title?: string | { default?: string; template?: string };
    description?: string;
    authors?: Array<{ name: string; url?: string }>;
    keywords?: string | string[];
    alternates?: {
      canonical?: string;
      languages?: Record<string, string>;
    };
    openGraph?: Record<string, unknown>;
    twitter?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export namespace MetadataRoute {
    interface SitemapEntry {
      url: string;
      lastModified?: string | Date;
      changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority?: number;
    }
    type Sitemap = SitemapEntry[];
    interface Robots {
      rules?: Array<{ userAgent: string; allow?: string; disallow?: string | string[] }>;
      sitemap?: string;
    }
  }
}
