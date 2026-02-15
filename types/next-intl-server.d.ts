/**
 * Type declarations for next-intl/server when node_modules is not yet installed
 * or when package types are not resolved. Remove or ignore once npm install succeeds.
 */
declare module 'next-intl/server' {
  export function unstable_setRequestLocale(locale: string): void;
  export function setRequestLocale(locale: string): void;
  export function getTranslations(
    config: { locale: string; namespace?: string }
  ): (key: string, values?: Record<string, string | number>) => Promise<string>;
  export function getMessages(): Promise<Record<string, unknown>>;
  export function getRequestConfig(config: {
    locale: string;
  }): Promise<{ messages: Record<string, unknown> }>;
}
