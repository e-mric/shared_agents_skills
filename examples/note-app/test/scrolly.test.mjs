import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mostVisible } from '../src/lib/scrolly.mjs';

test('forward scrolling activates the more visible chapter', () => {
  assert.equal(mostVisible([.2, .6, 0], 0), 1);
});
test('scrolling back can reactivate a previous chapter', () => {
  assert.equal(mostVisible([0, .7, .1], 2), 1);
});
test('equally visible chapters keep the current selection without flicker', () => {
  assert.equal(mostVisible([.4, .4], 1), 1);
});
test('leaving the observed story preserves the last chapter instead of jumping to baseline', () => {
  assert.equal(mostVisible([0, 0, 0], 2), 2);
  assert.equal(mostVisible([], 0), 0);
});
