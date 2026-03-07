import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
// Import des logos propres pour chaque matière
import { Cloud, Server, Layout, Shield, LineChart, Code2 } from 'lucide-react';
import { domains } from '@/lib/domains';
import { locales } from '@/i18n';

// Fonction pour associer un logo SVG à chaque matière
const DomainIcon = ({ id, className }: { id: string; className: string }) => {
  switch (id) {
    case 'devops': return <Cloud className={className} />;
    case 'backend': return <Server className={className} />;
    case 'frontend': return <Layout className={className} />;
    case 'network': return <Shield className={className} />;
    case 'data': return <LineChart className={className} />;
    case 'dsa': return <Code2 className={className} />;
    default: return <Code2 className={className} />;
  }
};

export default async function CataloguePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const isFr = locale === 'fr';

  return (
    <div className="mx-auto max-w-[850px] space-y-12 py-16 px-4 sm:px-6">
      
      {/* En-tête centré façon Odin Project */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Catalogue
        </h1>
      </header>

      {/* Grille des matières */}
      <div className="flex flex-col gap-6">
        {domains.map((domain) => (
          <Link
            key={domain.id}
            href={`/${locale}/domain/${domain.id}`}
            className="group flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:border-primary-600 hover:shadow-lg sm:flex-row sm:items-start"
          >
            {/* Le Logo de la matière */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gray-50 transition-colors duration-200 group-hover:bg-primary-50">
              <DomainIcon 
                id={domain.id} 
                className="h-10 w-10 text-gray-500 transition-colors duration-200 group-hover:text-primary-600" 
              />
            </div>
            
            {/* Le Titre et le Sommaire (Overview) */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
                {isFr ? domain.titleFr : domain.titleEn}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                {isFr ? domain.descFr : domain.descEn}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
    </div>
  );
}