import Link from 'next/link';

export function Header({ locale }: { locale: string }) {
  const isFr = locale === 'fr';

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-[780px] items-center justify-between px-4 sm:px-6">
        {/* Logo / Marque */}
        <Link
          href={`/${locale}`}
          className="text-xl font-bold tracking-tight text-gray-900 transition-colors hover:text-primary-600"
        >
          DB.
        </Link>
        
        {/* Navigation minimaliste (2 liens) */}
        <nav className="flex gap-6">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Catalogue
          </Link>
          <Link
            href={`/${locale}/about`}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {isFr ? 'À propos' : 'About'}
          </Link>
        </nav>
      </div>
    </header>
  );
}