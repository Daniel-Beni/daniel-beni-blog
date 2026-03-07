import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tech Watch Blog',
  description:
    'Blog technique sur le cloud, le DevOps, le backend, le réseau et l\'IA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
