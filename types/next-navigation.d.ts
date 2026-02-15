/**
 * Type declarations for next/navigation when node_modules is not yet installed
 * or when package types are not resolved. Remove or ignore once npm install succeeds.
 */
declare module 'next/navigation' {
  export function notFound(): never;
  export function redirect(url: string): never;
  export function usePathname(): string;
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (url: string) => void;
  };
  export function useSearchParams(): Readonly<URLSearchParams>;
}
