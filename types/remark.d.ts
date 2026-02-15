/**
 * Type declarations for remark and plugins when node_modules is not yet installed
 * or when package types are not resolved. Remove or ignore once npm install succeeds.
 */
declare module 'remark' {
  interface Processor {
    use(plugin: unknown): Processor;
    process(input: string): Promise<{ toString(): string }>;
  }
  export function remark(): Processor;
}

declare module 'remark-gfm' {
  const plugin: unknown;
  export default plugin;
}

declare module 'remark-html' {
  const plugin: unknown;
  export default plugin;
}
