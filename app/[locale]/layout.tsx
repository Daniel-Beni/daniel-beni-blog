import {NextIntlClientProvider} from 'next-intl';
import type {AbstractIntlMessages} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ThemeProvider} from 'next-themes';
import {Footer} from '@/components/layout/Footer';
import {Header} from '@/components/layout/Header';
import {locales} from '@/i18n';
import type {Metadata} from 'next';

const SITE_URL = 'https://www.danielbeni.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Daniel Beni — Tech Watch Blog',
    template: '%s | Daniel Beni',
  },
  description:
    'Articles, labs, projets et solutions DSA. Veille technique et apprentissage en cloud, DevOps, backend et IA — Daniel Beni Niyobuzima.',
  authors: [{name: 'Daniel Beni Niyobuzima', url: SITE_URL}],
  openGraph: {
    type: 'website',
    siteName: 'Daniel Beni - Tech Watch Blog',
    locale: 'fr_FR',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await getMessages()) as AbstractIntlMessages;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Header locale={locale} />
              <main className="flex-1">{children}</main>
              <Footer locale={locale} />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
