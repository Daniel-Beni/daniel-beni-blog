
import Link from 'next/link';

function DBLogo({ className }: { className?: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Daniel Beni - Logo"
    >
      {/* Teal accent bar on the left */}
      <rect x="0" y="0" width="4" height="36" rx="2" fill="#0d9488" />
      {/* D letter */}
      <text
        x="9"
        y="26"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="22"
        fill="#111827"
      >
        D
      </text>
      {/* B letter — slightly overlapping for cohesion */}
      <text
        x="21"
        y="26"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="22"
        fill="#111827"
      >
        B
      </text>
    </svg>
  );
}

export function Header({ locale }: { locale: string }) {
  const isFr = locale === 'fr';

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-[780px] items-center justify-between px-4 sm:px-6">
        {/* Logo monogramme */}
        <Link
          href={`/${locale}`}
          className="transition-opacity hover:opacity-80"
          aria-label="Accueil"
        >
          <DBLogo />
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
