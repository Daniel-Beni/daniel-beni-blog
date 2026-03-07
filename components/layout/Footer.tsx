import {useTranslations} from 'next-intl';

interface FooterProps {
  locale: string;
}

export function Footer({locale}: FooterProps) {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container-narrow py-6">
        <div className="flex flex-col items-center justify-between gap-2 text-sm text-gray-400 sm:flex-row">
          <p>{t('copyright', {year: currentYear})}</p>
          <p>{t('builtWith')}</p>
        </div>
      </div>
    </footer>
  );
}
