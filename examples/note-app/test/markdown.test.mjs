import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createMarkdownRenderer, formatMarkdown } from '../src/lib/markdown.mjs';
import { createNotesStore } from '../src/lib/notes.mjs';
const { window } = new JSDOM('');
const render = createMarkdownRenderer(window);

test('Markdown supports headings, emphasis, lists, tasks, code and tables', () => {
  const html = render('## Plan\n\n**Focus** and _care_\n\n- [x] Write\n- [ ] Review\n\n```js\nconst n = 1;\n```\n\n| Step | State |\n| --- | --- |\n| Save | Done |');
  for (const pattern of [/<h2>Plan<\/h2>/, /<strong>Focus<\/strong>/, /<em>care<\/em>/, /type="checkbox"/, /disabled/, /checked/, /<pre><code>/, /<table>/]) assert.match(html, pattern);
});
test('preview never executes HTML or silently loads external images', () => {
  const html = render('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[unsafe](javascript:alert%281%29)\n\n![A picture](https://example.com/private.png)');
  const doc = new JSDOM(html).window.document;
  assert.equal(doc.querySelector('script,img,iframe,style'), null);
  assert.equal(doc.querySelector('a[href^="javascript:"]'), null);
  assert.equal(doc.querySelector('a[href="https://example.com/private.png"]')?.textContent, 'A picture (open image)');
});
test('toolbar wraps selected text and keeps a useful selection', () => {
  assert.deepEqual(formatMarkdown('hello world', 6, 11, 'bold'), {value:'hello **world**',selectionStart:8,selectionEnd:13});
  assert.equal(formatMarkdown('one\ntwo', 0, 7, 'task').value, '- [ ] one\n- [ ] two');
  assert.equal(formatMarkdown('', 0, 0, 'heading').value, '## Write here');
});
test('saving and reopening preserves exact Markdown source', () => {
  const map = new Map();
  const storage = {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};
  const store = createNotesStore(()=>storage);
  const body = '# Heading\n\n- [ ] Task\n\n```\n<raw>\n```';
  store.save({id:'markdown-note',title:'Markdown',body},null);
  assert.equal(createNotesStore(()=>storage).load()[0].body,body);
});
