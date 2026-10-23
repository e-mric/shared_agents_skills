import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterBooks } from '../src/lib/books.mjs';

const books = [
  { id: 'wizard', title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', read: false },
  { id: 'night', title: 'Night', author: 'Elie Wiesel', read: true },
  { id: 'essays', title: 'Earthsea Essays', author: '', read: true },
  { id: 'notes', title: 'Field Notes', author: 'EARTHSEA Society', read: false },
];
const ids = matches => matches.map(book => book.id);

test('search matches title OR author, ignoring case and surrounding whitespace', () => {
  assert.deepEqual(ids(filterBooks(books, 'All', '  eArThSeA \t')), ['wizard', 'essays', 'notes']);
  assert.deepEqual(ids(filterBooks(books, 'All', 'le GUIN')), ['wizard']);
  assert.deepEqual(ids(filterBooks(books, 'All', 'ESSAYS')), ['essays']);
  assert.deepEqual(filterBooks(books, 'All', 'missing'), []);
});

test('search combines with each read-status filter; blank queries keep that filter', () => {
  assert.deepEqual(ids(filterBooks(books, 'Unread', 'earthsea')), ['wizard', 'notes']);
  assert.deepEqual(ids(filterBooks(books, 'Read', 'earthsea')), ['essays']);
  assert.deepEqual(filterBooks(books, 'Unread', 'night'), []);
  for (const query of ['', ' \t\n ']) {
    assert.deepEqual(ids(filterBooks(books, 'All', query)), ['wizard', 'night', 'essays', 'notes']);
    assert.deepEqual(ids(filterBooks(books, 'Unread', query)), ['wizard', 'notes']);
    assert.deepEqual(ids(filterBooks(books, 'Read', query)), ['night', 'essays']);
  }
  assert.deepEqual(filterBooks([], 'All', 'earthsea'), []);
});

test('author-only matches respect Read and Unread filters', () => {
  assert.deepEqual(ids(filterBooks(books, 'Read', '  WIESEL  ')), ['night']);
  assert.deepEqual(filterBooks(books, 'Unread', '  WIESEL  '), []);
  assert.deepEqual(ids(filterBooks(books, 'Unread', 'le GUIN')), ['wizard']);
  assert.deepEqual(filterBooks(books, 'Read', 'le GUIN'), []);
});

test('filtering preserves source books and order, and returns a separate result array', () => {
  const source = Object.freeze(books.map(book => Object.freeze({ ...book })));
  const before = structuredClone(source);
  for (const filter of ['All', 'Unread', 'Read']) {
    for (const query of ['', '  EARTHSEA  ', 'missing']) {
      const result = filterBooks(source, filter, query);
      assert.notEqual(result, source);
      result.reverse();
      result.pop();
      assert.deepEqual(source, before);
    }
  }
});
