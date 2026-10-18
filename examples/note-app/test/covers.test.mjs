import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coverFor } from '../src/lib/covers.mjs';

test('reflective and blank notes get the calm boat fallback', () => {
  for (const title of ['', 'A thought worth keeping', 'Triplicate invoices']) {
    assert.equal(coverFor({ title, body: '' }), '/illustrations/paper-boat.png');
  }
});
test('travel themes in the title or body select the landscape locally', () => {
  assert.equal(coverFor({ title: 'WEEKEND wanderings', body: '' }), '/illustrations/wandering-path.png');
  assert.equal(coverFor({ title: 'Plans', body: 'Take a walk by the river.' }), '/illustrations/wandering-path.png');
});

test('new themes select their matching artwork from title or body', () => {
  for (const [text, file] of [
    ['Books to read', 'reading-corner'],
    ['Creative ideas', 'paper-ideas'],
    ['Dinner recipes', 'kitchen-table'],
  ]) {
    for (const note of [{ title: text, body: '' }, { title: 'For later', body: text }]) {
      assert.equal(coverFor(note), `/illustrations/${file}.png`);
    }
  }
});
test('title subjects outrank incidental body themes', () => {
  assert.equal(coverFor({ title: 'Dinner recipes', body: 'Ideas for a book about a weekend trip.' }), '/illustrations/kitchen-table.png');
});
test('distinct matches decide mixed themes with stable ties', () => {
  assert.equal(coverFor({ title: 'Book recipes cooking', body: '' }), '/illustrations/kitchen-table.png');
  assert.equal(coverFor({ title: 'Book recipe', body: '' }), '/illustrations/reading-corner.png');
  assert.equal(coverFor({ title: 'book book book recipe cooking', body: '' }), '/illustrations/kitchen-table.png');
});
test('matching tolerates accents and punctuation without substring false positives', () => {
  assert.equal(coverFor({ title: 'IDÉES — créativité !', body: '' }), '/illustrations/paper-ideas.png');
  assert.equal(coverFor({ title: 'Randonnée', body: '' }), '/illustrations/wandering-path.png');
  assert.equal(coverFor({ title: 'Booking a readership survey', body: '' }), '/illustrations/paper-boat.png');
});
