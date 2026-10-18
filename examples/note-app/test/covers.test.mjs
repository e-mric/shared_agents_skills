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
