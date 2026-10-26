<script lang="ts">
  let selected = $state(0);
  const roleButtons: HTMLButtonElement[] = [];
  const roles = [
    { role: 'Plan', owner: 'CTO / planner', model: 'Claude · Opus 5.5 High', action: 'Define success and how we will verify it.', handoff: 'To Design: goal, constraints, checks and failure cases.' },
    { role: 'Design', owner: 'Designer / asset creator', model: 'Codex · Astra High', action: 'Propose the design, reusable assets and failure states.', handoff: 'To Build: accepted design, asset files and interaction states.' },
    { role: 'Build', owner: 'Engineer', model: 'Codex · GPT-6.1 Sol Medium', action: 'For bugs, show the failing test first. Then implement.', handoff: 'To Review: exact code changes, screenshots and test evidence.' },
    { role: 'Review', owner: 'Reviewer / QA', model: 'Claude · Opus 5.5 High', action: 'Check what tests prove. Try the journey. Recheck fixes.', handoff: 'Back to Build: findings and steps to reproduce. Then recheck the fixes.' },
  ];
  const current = $derived(roles[selected]);
</script>

<section class="team-setup" aria-label="Optional Claude and Codex workflow">
  <h2>Clear roles. Clear handoffs.</h2>
  <p class="intro">One possible team. The roles work with other agents, too.</p>
  <nav class="role-flow" aria-label="Explore role handoffs">
    {#each roles as item, i}
      <button bind:this={roleButtons[i]} aria-pressed={selected === i} aria-controls="role-handoff" onclick={() => { selected = i; }}>
        <span>{i + 1}. {item.role}</span>
      </button>
    {/each}
  </nav>
  <div id="role-handoff" class="role-detail" aria-live="polite" aria-atomic="true">
    <div class="role-heading"><h3>{current.owner}</h3><p class="model">{current.model}</p></div>
    <p>{current.action}</p>
    {#if selected !== 3}<p class="handoff">{current.handoff}</p>{/if}
    {#if selected === 3}
      <button class="return-findings" onclick={() => { selected = 2; roleButtons[2]?.focus(); }}>Return findings to Build</button>
    {/if}
  </div>
  <details>
    <summary>Hard tickets, chores &amp; design tools</summary>
    <dl>
      <div><dt>Hard tickets</dt><dd>Senior engineer · Codex · GPT-6.1 Sol High</dd></div>
      <div><dt>Chores</dt><dd>Claude · Haiku 5.5 Medium or Codex · GPT-6 Luna High</dd></div>
      <div><dt>Design tools</dt><dd>Mobbin MCP for references; image generation or Higgsfield MCP for assets, when available.</dd></div>
    </dl>
  </details>
  <p class="adapter">Paperclip or AI DevKit can carry the handoffs. Both are optional.</p>
  <p class="simulation">Example only. No agents start and no models change.</p>
</section>

<style>
  .team-setup { padding: 16px 0 0; }
  h2 { font: 400 30px/1.2 Georgia, serif; margin: 0 0 8px; }
  p { font-size: 14px; line-height: 1.6; margin: 0; }
  .intro, .model, .simulation { color: var(--muted); }
  .intro { margin-bottom: 18px; }
  .role-flow { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .role-flow button, .return-findings { min-height: 44px; padding: 10px 8px; border: 1px solid var(--line); border-radius: 5px; font-size: 14px; }
  .role-flow button[aria-pressed=true] { color: white; background: var(--accent); border-color: var(--accent); }
  .role-flow button[aria-pressed=true]:hover { background: var(--ink); }
  .role-detail { padding: 14px 0; min-height: 140px; }
  .role-heading { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 14px; margin-bottom: 10px; }
  h3 { margin: 0; font-size: 16px; font-weight: 600; }
  .model { font-size: 14px; }
  .handoff { margin-top: 10px; color: var(--accent); }
  .return-findings { margin-top: 10px; color: var(--accent); }
  details { border-top: 1px solid var(--line); font-size: 14px; line-height: 1.6; }
  summary { min-height: 44px; padding: 10px 0; cursor: pointer; color: var(--accent); }
  dl { margin: 0 0 14px; }
  dl div { margin: 0 0 10px; }
  dt { font-weight: 600; }
  dd { margin: 2px 0 0; overflow-wrap: anywhere; }
  .adapter { margin-top: 8px; }
  .simulation { font-size: 12px; margin-top: 8px; }
  @media (max-width: 600px) {
    .team-setup { padding-top: 16px; }
    h2 { font-size: 26px; }
    .role-flow { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .role-detail { min-height: 0; }
  }
</style>
