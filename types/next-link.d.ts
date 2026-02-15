/**
 * Type declarations for next/link when node_modules is not yet installed
 * or when package types are not resolved. Remove or ignore once npm install succeeds.
 */
declare module 'next/link' {
  interface LinkProps {
    href: string;
    replace?: boolean;
    scroll?: boolean;
    prefetch?: boolean;
    className?: string;
    children?: unknown;
    [key: string]: unknown;
  }
  const Link: (props: LinkProps) => JSX.Element;
  export default Link;
}
