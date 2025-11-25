import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tech Watch Blog',
  description:
    'Blog technique sur le cloud, le DevOps, le backend, le réseau et l’IA.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
