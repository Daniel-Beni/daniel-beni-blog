import {redirect} from 'next/navigation';
import {locales} from '@/i18n';

export default async function CataloguePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // For now, catalogue = homepage (the domain list IS the catalogue)
  // Later you can make this a separate expanded view
  redirect(`/${locale}`);
}
