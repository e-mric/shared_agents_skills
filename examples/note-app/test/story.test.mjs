import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimate, stages, plans } from '../src/lib/story.mjs';

test('the story begins with a labelled baseline and ends with a handoff', () => {
  assert.equal(stages[0].kind, 'baseline');
  assert.equal(stages.at(-1).kind, 'handoff');
  assert.equal(new Set(stages.map(s => s.label)).size, stages.length);
});
test('live chapters progressively add writing, persistence, recovery and review', () => {
  const live = stages.filter(s => s.kind === 'live');
  assert.deepEqual(live.map(s => s.iteration), [0, 1, 2, 3]);
});
test('the fixed uncached API scenarios use the verified role allocations', () => {
  for (const [id, expected] of [['single', .22], ['depth', .54], ['budget', .445]]) {
    assert.ok(Math.abs(estimate(id).usd - expected) < 1e-9);
  }
});
test('credit estimates use credit rates rather than converting API dollars', () => {
  for (const [id, expected] of [['single', 5.5], ['depth', 13.5], ['budget', 11.125]]) {
    assert.ok(Math.abs(estimate(id).credits - expected) < 1e-9);
  }
});
test('all role shares account for the full illustrative workload', () => {
  for (const plan of plans) {
    assert.ok(Math.abs(plan.allocation.reduce((s, a) => s + a[1], 0) - 1) < 1e-9);
    assert.ok(Math.abs(plan.allocation.reduce((s, a) => s + a[2], 0) - 1) < 1e-9);
  }
});
test('estimates scale and reject invalid model or workload assumptions', () => {
  assert.equal(estimate('single', 120000, 20000).usd, .44);
  assert.deepEqual(estimate('single', 0, 0), { usd: 0, credits: 0 });
  assert.throws(() => estimate('unknown'));
  assert.throws(() => estimate('single', -1, 0));
  assert.throws(() => estimate('single', 0, Infinity));
});
