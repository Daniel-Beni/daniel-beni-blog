import Link from 'next/link';
import { ArrowLeft, Cloud, Server, Layout, Shield, LineChart, Code2, Brain } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { domains, getDomainById } from '@/lib/domains';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    domains.map((domain) => ({
      locale,
      domain: domain.id,
    }))
  );
}

// Fini les émojis, on utilise les icônes Lucide de manière uniforme !
const DomainIcon = ({ id, className }: { id: string; className: string }) => {
  switch (id) {
    case 'devops': return <Cloud className={className} />;
    case 'backend': return <Server className={className} />;
    case 'frontend': return <Layout className={className} />;
    case 'network': return <Shield className={className} />;
    case 'data': return <Brain className={className} />; // Le fameux cerveau pour l'IA
    case 'dsa': return <Code2 className={className} />;
    default: return <Code2 className={className} />;
  }
};

export default async function DomainPage({
  params,
}: {
  params: Promise<{ locale: string; domain: string }>;
}) {
  const { locale, domain: domainId } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const domain = getDomainById(domainId);
  if (!domain) {
    notFound();
  }

  setRequestLocale(locale);
  const isFr = locale === 'fr';

  return (
    <div className="mx-auto max-w-[780px] px-4 sm:px-6">
      {/* Lien de retour */}
      <div className="pt-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {isFr ? 'Retour au catalogue' : 'Back to catalogue'}
        </Link>
      </div>

      {/* En-tête de la matière (Propre et centré) */}
      <section className="pb-8 pt-10 text-center border-b border-gray-100">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <DomainIcon id={domain.id} className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isFr ? domain.titleFr : domain.titleEn}
        </h1>
        <p className="mt-2 text-gray-600">
          {isFr ? domain.descFr : domain.descEn}
        </p>
      </section>

      {/* ZONE VIDE POUR LE FUTUR SOMMAIRE ODIN PROJECT */}
      <div className="mb-20 mt-8">
        {/* On part sur une page 100% saine ! Le sommaire viendra ici */}
      </div>
    </div>
  );
}