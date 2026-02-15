/**
 * Fallback JSX namespace when @types/react is not resolved (e.g. node_modules missing).
 * Ensures "JSX.IntrinsicElements" exists so JSX elements don't get implicit 'any' type.
 * Safe to keep; React's types take precedence when available.
 */
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: Record<string, unknown>;
  }
}
