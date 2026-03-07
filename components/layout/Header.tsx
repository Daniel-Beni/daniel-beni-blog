'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Menu, X, Globe} from 'lucide-react';
import {useState} from 'react';
import {cn} from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

export function Header({locale}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');

  const navigation = [
    {name: t('home'), href: `/${locale}`},
    {name: t('catalogue') || 'Catalogue', href: `/${locale}/catalogue`},
    {name: t('about'), href: `/${locale}/about`},
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const toggleLocale = () => {
    const newLocale = locale === 'fr' ? 'en' : 'fr';
    const newPath = pathname?.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath || `/${newLocale}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="container-narrow">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-sm font-bold text-white">
              DB
            </div>
            <span className="text-[15px] font-semibold text-gray-900">
              daniel.beni
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Language toggle */}
            <button
              onClick={toggleLocale}
              className="ml-4 flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600"
              title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">{locale === 'fr' ? 'EN' : 'FR'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400"
              >
                <Globe className="h-4 w-4" />
                {locale === 'fr' ? 'English' : 'Français'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
