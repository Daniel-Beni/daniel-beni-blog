import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-950">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400">
          404
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page introuvable</h1>
        <p className="text-gray-600 dark:text-gray-400">
          La page demandée n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
