import { Marked } from 'marked';
import createDOMPurify from 'dompurify';

const escape = text => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const parser = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    html: ({ text }) => escape(text),
    // Images are explicit links so a note cannot silently contact a remote host.
    image: ({ href, text }) => `<a href="${escape(href)}">${escape(text || 'Image')} (open image)</a>`,
  },
});

export function createMarkdownRenderer(window) {
  const purify = createDOMPurify(window);
  return source => purify.sanitize(parser.parse(source, { async: false }), {
    ALLOWED_TAGS: ['p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'del', 'blockquote', 'ul', 'ol', 'li', 'input', 'a', 'pre', 'code', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['href', 'title', 'start', 'type', 'checked', 'disabled'],
  });
}

export function formatMarkdown(text, start, end, format) {
  const selected = text.slice(start, end);
  const wraps = { bold: ['**', '**', 'bold text'], italic: ['_', '_', 'emphasis'], link: ['[', '](https://example.com)', 'link text'], code: ['`', '`', 'code'] };
  let value, selectionStart, selectionEnd;
  if (wraps[format]) {
    const [before, after, fallback] = wraps[format];
    const content = selected || fallback;
    value = text.slice(0, start) + before + content + after + text.slice(end);
    selectionStart = start + before.length; selectionEnd = selectionStart + content.length;
  } else {
    const prefixes = { heading: '## ', list: '- ', task: '- [ ] ', quote: '> ' };
    const prefix = prefixes[format];
    if (!prefix) throw new Error('Unknown Markdown format');
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const nextBreak = text.indexOf('\n', end);
    const lineEnd = nextBreak === -1 ? text.length : nextBreak;
    const content = text.slice(lineStart, lineEnd) || 'Write here';
    const replacement = content.split('\n').map(line => prefix + line).join('\n');
    value = text.slice(0, lineStart) + replacement + text.slice(lineEnd);
    selectionStart = lineStart + prefix.length; selectionEnd = lineStart + replacement.length;
  }
  return { value, selectionStart, selectionEnd };
}
