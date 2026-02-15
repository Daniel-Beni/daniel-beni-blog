import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

type RequestParams = { locale: string; requestLocale?: Promise<string | undefined> };

// Cast needed: package types declare old API { locale: string } but runtime uses requestLocale (next-intl 3.22+)
export default getRequestConfig((async (params: RequestParams) => {
  const requestLocale = 'requestLocale' in params && params.requestLocale ? params.requestLocale : Promise.resolve(params.locale);
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any);
