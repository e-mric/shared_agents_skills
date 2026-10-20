export function createMarkdownRenderer(window: Window): (source: string) => string;
export function formatMarkdown(text: string, start: number, end: number, format: string): { value: string; selectionStart: number; selectionEnd: number };
