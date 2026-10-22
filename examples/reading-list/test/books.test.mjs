import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBookStore, STORAGE_KEY } from '../src/lib/books.mjs';
function storage() {
  const map = new Map();
  return { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) };
}
test('add a book with optional author, then reload exact content', () => {
  const disk = storage(); const store = createBookStore(() => disk);
  assert.deepEqual(store.load(), []);
  store.add({ id: 'one', title: '  Earthsea  ', author: ' Ursula K. Le Guin ' });
  store.add({ id: 'two', title: '<A title>', author: '' });
  assert.deepEqual(createBookStore(() => disk).load(), [
    { id: 'two', title: '<A title>', author: '', read: false },
    { id: 'one', title: 'Earthsea', author: 'Ursula K. Le Guin', read: false },
  ]);
});
test('read and unread survive reload without changing unrelated books', () => {
  const disk = storage(); const store = createBookStore(() => disk);
  store.add({ id: 'one', title: 'One' }); store.add({ id: 'two', title: 'Two' });
  store.setRead('one', true);
  assert.equal(createBookStore(() => disk).load().find(b => b.id === 'one').read, true);
  assert.equal(store.load().find(b => b.id === 'two').read, false);
  store.setRead('one', false);
  assert.equal(store.load().find(b => b.id === 'one').read, false);
});
test('failed add or toggle leaves saved data unchanged', () => {
  const disk = storage(); const store = createBookStore(() => disk);
  store.add({ id: 'one', title: 'One' }); const before = disk.getItem(STORAGE_KEY);
  const blocked = createBookStore(() => ({ ...disk, setItem() { throw new Error('Storage full'); } }));
  assert.throws(() => blocked.add({ id: 'two', title: 'Two' }), /Storage full/);
  assert.throws(() => blocked.setRead('one', true), /Storage full/);
  assert.equal(disk.getItem(STORAGE_KEY), before);
});
test('invalid saved data is never replaced by add or demo mode', () => {
  for (const raw of ['not-json', '{"version":9,"books":[]}', '{"version":1,"books":[{"id":"x"}]}']) {
    const disk = storage(); disk.setItem(STORAGE_KEY, raw); const store = createBookStore(() => disk);
    assert.throws(() => store.load());
    assert.throws(() => store.add({ id: 'one', title: 'One' }));
    assert.throws(() => store.seedDemo());
    assert.equal(disk.getItem(STORAGE_KEY), raw);
  }
});
test('blank titles, duplicate identifiers and missing toggle targets do not write', () => {
  const disk = storage(); const store = createBookStore(() => disk);
  assert.throws(() => store.add({ id: 'x', title: '  ' }), /title/);
  store.add({ id: 'x', title: 'One' }); const before = disk.getItem(STORAGE_KEY);
  assert.throws(() => store.add({ id: 'x', title: 'Other' }));
  assert.throws(() => store.setRead('missing', true));
  assert.equal(disk.getItem(STORAGE_KEY), before);
});
test('demo starts once and never replaces a saved list, even an empty one', () => {
  const disk = storage(); const store = createBookStore(() => disk);
  assert.equal(store.seedDemo().length, 4);
  store.add({ id: 'mine', title: 'My book' });
  assert.equal(store.seedDemo()[0].title, 'My book');
  disk.setItem(STORAGE_KEY, '{"version":1,"books":[]}');
  assert.deepEqual(store.seedDemo(), []);
});
