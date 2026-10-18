import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNotesStore, STORAGE_KEY } from '../src/lib/notes.mjs';

function setup() {
  const data = new Map();
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  return { data, storage, store: createNotesStore(() => storage, () => '2026-10-18T10:00:00.000Z') };
}
const draft = { id: 'a', title: 'A thought', body: 'One line\nAnother line <script>literal text</script>' };

test('a new library is empty, then saving survives a fresh repository instance', () => {
  const { store, storage } = setup();
  assert.deepEqual(store.load(), []);
  const saved = store.save(draft);
  assert.deepEqual(createNotesStore(() => storage).load(), [saved]);
  assert.equal(saved.body, draft.body);
});
test('editing replaces one note, preserves other notes and avoids duplicates', () => {
  const { store } = setup();
  const first = store.save(draft);
  const other = store.save({ ...draft, id: 'b', title: 'Another note' });
  const edited = store.save({ ...draft, body: 'Changed' }, first);
  assert.equal(store.load().length, 2);
  assert.deepEqual(store.load().find(n => n.id === 'b'), other);
  assert.deepEqual(store.load().find(n => n.id === 'a'), edited);
});
test('blank notes cannot save, but a title-only or body-only note can', () => {
  const { store } = setup();
  assert.throws(() => store.save({ id: 'a', title: ' ', body: '\n ' }), { code: 'empty' });
  store.save({ id: 'a', title: '', body: 'A thought' });
  store.save({ id: 'b', title: 'A title', body: '' });
  assert.equal(store.load().length, 2);
});
test('a real failed write preserves the previous saved version and the supplied draft', () => {
  const { store, storage } = setup();
  const original = store.save(draft);
  const changed = { ...draft, body: 'Do not lose this text' };
  const write = storage.setItem;
  storage.setItem = () => { throw new Error('Quota exceeded'); };
  assert.throws(() => store.save(changed, original), { code: 'storage' });
  assert.deepEqual(store.load(), [original]);
  assert.equal(changed.body, 'Do not lose this text');
  storage.setItem = write;
  assert.equal(store.save(changed, original).body, changed.body);
});
test('demo failure affects exactly one save and does not modify storage', () => {
  const { store, data } = setup();
  store.armFailure();
  assert.throws(() => store.save(draft), { code: 'simulated' });
  assert.equal(data.size, 0);
  assert.equal(store.save(draft).body, draft.body);
});
test('a presenter can cancel the armed failure', () => {
  const { store } = setup(); store.armFailure(); store.cancelFailure();
  assert.equal(store.save(draft).id, draft.id);
});
test('malformed and unfamiliar data cannot be silently replaced', () => {
  for (const raw of ['not-json', '{"version":2,"notes":[]}', '{"version":1,"notes":[{}]}']) {
    const { data, store } = setup(); data.set(STORAGE_KEY, raw);
    assert.throws(() => store.load(), { code: 'corrupt' });
    assert.throws(() => store.save(draft), { code: 'corrupt' });
    assert.equal(data.get(STORAGE_KEY), raw);
  }
});
test('duplicate IDs are treated as damaged data', () => {
  const { data, store } = setup();
  data.set(STORAGE_KEY, JSON.stringify({ version: 1, notes: [{ ...draft, updatedAt: '2026-10-18' }, { ...draft, updatedAt: '2026-10-18' }] }));
  assert.throws(() => store.load(), { code: 'corrupt' });
});
test('blocked storage access produces an actionable error', () => {
  const store = createNotesStore(() => { throw new Error('SecurityError'); });
  assert.throws(() => store.load(), { code: 'storage' });
  assert.throws(() => store.save(draft), { code: 'storage' });
});
test('an earlier edit from another tab is detected, preserving its saved content', () => {
  const { store, storage } = setup(); const otherTab = createNotesStore(() => storage);
  const original = store.save(draft);
  const theirs = otherTab.save({ ...draft, body: 'Written in another tab' }, original);
  assert.throws(() => store.save({ ...draft, body: 'Stale edit' }, original), { code: 'conflict' });
  assert.deepEqual(store.load(), [theirs]);
});
test('saving merges unrelated notes written by another tab after initial load', () => {
  const { store, storage } = setup();
  store.load(); createNotesStore(() => storage).save({ ...draft, id: 'other' });
  store.save(draft);
  assert.equal(store.load().length, 2);
});
