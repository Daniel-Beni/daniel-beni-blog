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
        <div className="flex items-center justify-center text-sm text-gray-400">
          <p>{t('copyright', {year: currentYear})}</p>
        </div>
      </div>
    </footer>
  );
}
