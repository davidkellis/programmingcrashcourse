declare module 'markdown-it' {
  interface MarkdownIt {
    render(content: string): string;
    renderer: {
      rules: {
        fence?: (tokens: Array<{ info: string; content: string }>, idx: number) => string;
        code_inline?: (tokens: Array<{ content: string }>, idx: number) => string;
      };
    };
  }

  const MarkdownIt: {
    new (options?: Record<string, unknown>): MarkdownIt;
  };
  export default MarkdownIt;
}
