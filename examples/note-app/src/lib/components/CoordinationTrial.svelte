<script lang="ts">
  let selected = $state(0);
  const steps = [
    { label: 'Codex builds', detail: 'Codex implemented title and author search from the shared brief and design.', handoff: 'To Claude: the code changes and acceptance criteria.' },
    { label: 'Claude checks', detail: 'Claude found confusing empty-library and search-result states.', handoff: 'Back to Codex: findings and steps to reproduce them.' },
    { label: 'Codex fixes', detail: 'Codex repaired the states. The coordinator reran the tests and checked desktop and phone layouts.', handoff: 'Result: 10 tests passed, type checks and build passed.' },
  ];
  const current = $derived(steps[selected]);
</script>

<div class="coordination-trial">
  <h2>Reading-list search</h2>
  <nav class="trial-steps" aria-label="Replay the Claude and Codex trial">
    {#each steps as item, i}
      <button aria-pressed={selected === i} aria-controls="trial-detail" onclick={() => { selected = i; }}><span>{i + 1}</span>{item.label}</button>
    {/each}
  </nav>
  <div id="trial-detail" class="trial-detail" aria-live="polite" aria-atomic="true">
    <p>{current.detail}</p>
    <p class="trial-handoff">{current.handoff}</p>
  </div>
  <p class="trial-adapter"><strong>AI DevKit is optional.</strong> It carried the messages; a coordinator directed the handoffs. You can also hand off manually.</p>
  <details class="trial-limits"><summary>What this trial proved</summary><p>A real implementation → review → fix cycle. Claude reviewed the code, but its tool permissions blocked tests. The coordinator verified the fixes. This was a guided trial, not unattended automation.</p><a href="https://github.com/e-mric/shared_agents_skills/blob/6bbc375/docs/evaluations/reading-list-live-pilot.md" target="_blank" rel="noreferrer">Read the trial evidence</a></details>
  <p class="choice-footnote">Replay only. These controls start no agents.</p>
</div>
