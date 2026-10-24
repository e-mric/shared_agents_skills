<script lang="ts">
  import { onMount, tick } from 'svelte';
  import NoteEditor from '../lib/components/NoteEditor.svelte';
  import Scrolly from '../lib/components/Scrolly.svelte';
  import DesignSource from '../lib/components/DesignSource.svelte';
  import TeamSetup from '../lib/components/TeamSetup.svelte';
  import CoordinationTrial from '../lib/components/CoordinationTrial.svelte';
  import { stages, plans, estimate, workflowLoop } from '../lib/story.mjs';

  let step = $state(0);
  let comparison = $state('baseline');
  let designView = $state('source');
  let designSource = $state('generated');
  let figmaAccess = $state('connected');
  let imageGeneration = $state('available');
  let stackScenario = $state('local');
  let teamView = $state('setup');
  let role = $state('Implementation');
  let document = $state('AGENTS.md');
  let method = $state('Storage behavior');
  let plan = $state('single');
  let workload = $state(1);
  let billing = $state('api');
  let criteria = $state<boolean[]>([false, false, false]);
  let review = $state<boolean[]>([false, false, false]);
  let evidence = $state<Record<string, boolean>>({});
  let noteDirty = $state(false);
  let ready = $state(false);
  let fullScreenError = $state('');
  let chapterElements = $state<HTMLElement[]>([]);
  let mobile = $state(false);
  let canvas: HTMLElement;
  let navigating = $state(false);
  let navigationId = 0;
  const stage = $derived(stages[step]);
  const cost = $derived(estimate(plan, 60000 * workload, 10000 * workload));
  const isLive = $derived(stage.kind === 'live');
  const isReview = $derived(stage.phase === 'review');
  const lastLiveIteration = $derived(step < 8 ? 0 : step < 9 ? 1 : step < 10 ? 2 : 3);
  const storageKey = 'marginal.story.v1';
  const docs: Record<string, { purpose: string; text: string }> = {
    'AGENTS.md': { purpose: 'Working rules', text: 'Read the brief and current state.\nPreserve notes and unrelated work.\nDesign, implement, then review.\nVerify before calling it done.' },
    'docs/product.md': { purpose: 'Intent and acceptance criteria', text: 'Audience: a presenter and people capturing notes.\nOutcome: write, save and reopen one note.\nIntent: calm, clear and dependable.\nOn failure: retain text, explain and offer recovery.' },
    'docs/project-state.md': { purpose: 'Current state and handoff', text: 'Goal: an interactive workflow presentation.\nStack: SvelteKit, requested by the user.\nEvidence: record checks with their scope.\nNext: use the live demo and review its limits.' },
    'docs/index.md': { purpose: 'Navigation', text: 'Product intent\nStorage research\nCurrent state\nPresentation script\nFocused chat starters' },
  };
  const roles: Record<string, string> = {
    'Product & design': 'Define the problem, design and signs of success.',
    Research: 'Answer a specific question. Save sources and uncertainty.',
    Implementation: 'Build one agreed feature. Verify it and record the result.',
    Testing: 'Try the agreed journey. Report failures and untested cases.',
  };
  const methods: Record<string, { name: string; text: string }> = {
    'Storage behavior': { name: 'Research', text: 'Check how browser storage works, then test a reload.' },
    'A failed save': { name: 'Diagnosis', text: 'Reproduce the failure, find its cause and verify the fix.' },
    'A finished change': { name: 'Review', text: 'Compare the change with the brief, design and checks.' },
  };
  function persist() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ step, plan, workload, billing, criteria, review, evidence, designSource, figmaAccess, imageGeneration, stackScenario })); } catch { /* Presentation preferences can remain in memory. */ }
  }
  async function resetReviewScroll() {
    await tick();
    if (!isReview) return;
    canvas?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    canvas?.querySelectorAll('.note-editor, .note-body').forEach(element => {
      element.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }
  $effect(() => { if (ready && isReview) void resetReviewScroll(); });
  async function go(index: number) {
    const id = ++navigationId;
    navigating = true;
    step = Math.max(0, Math.min(stages.length - 1, index));
    // Review changes the layout. Scroll only after its dimensions have settled,
    // with the observer paused so it cannot override an explicit chapter choice.
    await tick();
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    if (id !== navigationId) return;
    if (ready) {
      persist();
      chapterElements[step]?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
      if (!mobile) chapterElements[step]?.scrollIntoView({ block: 'start', behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      if (stages[step].phase === 'review') await resetReviewScroll();
    }
    // Recheck alignment after the layout and scroll notifications settle.
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    if (id !== navigationId) return;
    if (!mobile) chapterElements[step]?.scrollIntoView({ block: 'start', behavior: 'instant' });
    // Keep an explicit choice until the presenter starts scrolling again.
  }
  function resumeScroll(event: Event) {
    if (canvas?.contains(event.target as Node)) return;
    if (window.document.activeElement?.matches('select:focus')) return;
    if (event.type !== 'pointerdown' || event.target === window.document.documentElement) navigating = false;
  }
  function keyboard(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('input,textarea,select,dialog,[contenteditable="true"]') || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); go(step + 1); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); go(step - 1); }
  }
  async function fullscreen() {
    fullScreenError = '';
    try { if (window.document.fullscreenElement) await window.document.exitFullscreen(); else await window.document.documentElement.requestFullscreen(); }
    catch { fullScreenError = 'Fullscreen is unavailable here. You can use your browser’s fullscreen option.'; }
  }
  function record(key: string) { evidence[key] = true; }
  function reloadCheck() {
    if (noteDirty) return;
    evidence['reload-requested'] = true; persist(); location.reload();
  }
  onMount(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      if (saved) {
        if (Number.isInteger(saved.step)) step = Math.max(0, Math.min(stages.length - 1, saved.step));
        if (plans.some(p => p.id === saved.plan)) plan = saved.plan;
        if (['generated', 'figma'].includes(saved.designSource)) designSource = saved.designSource;
        if (['connected', 'unavailable'].includes(saved.figmaAccess)) figmaAccess = saved.figmaAccess;
        if (['available', 'external'].includes(saved.imageGeneration)) imageGeneration = saved.imageGeneration;
        if (['local', 'sync'].includes(saved.stackScenario)) stackScenario = saved.stackScenario;
        if ([1, 2, 5].includes(saved.workload)) workload = saved.workload;
        if (['api', 'credits'].includes(saved.billing)) billing = saved.billing;
        if (Array.isArray(saved.criteria) && saved.criteria.length === 3) criteria = saved.criteria.map(Boolean);
        if (Array.isArray(saved.review) && saved.review.length === 3) review = saved.review.map(Boolean);
        if (saved.evidence && typeof saved.evidence === 'object') evidence = { ...evidence, ...saved.evidence };
      }
    } catch { /* Invalid story state never changes notes. */ }
    navigating = step > 0;
    ready = true;
    const media = window.matchMedia('(max-width: 960px)');
    function updateLayout() { mobile = media.matches; }
    updateLayout();
    const frame = requestAnimationFrame(() => {
      if (!mobile && step > 0) chapterElements[step]?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    media.addEventListener('change', updateLayout);
    return () => { cancelAnimationFrame(frame); media.removeEventListener('change', updateLayout); };
  });
  $effect(() => { if (ready) { step; plan; workload; billing; criteria; review; evidence; designSource; figmaAccess; imageGeneration; stackScenario; persist(); } });
</script>

<svelte:head><title>Marginal — an app, built step by step</title><meta name="description" content="An interactive presentation of a shared development workflow, told through a note app that evolves with each iteration." /></svelte:head>
<svelte:window onkeydown={keyboard} onwheel={resumeScroll} ontouchmove={resumeScroll} onpointerdown={resumeScroll} />
<a class="skip-link" href="#chapter">Skip to chapter</a>
<header class="presentation-header"><a href="#chapter" class="wordmark">marginal</a><span class="header-caption">design first → implement → review</span><div class="header-actions"><button onclick={() => { go(0); }}>Restart story</button><button class="fullscreen" onclick={fullscreen} aria-label="Toggle fullscreen">⛶</button></div></header>
{#if fullScreenError}<p role="status" class="fullscreen-message">{fullScreenError}</p>{/if}
<main id="chapter" class="presentation-main" class:review-layout={isReview}>
  <div class="narrative-track">
    <Scrolly bind:value={step} top={84} bottom={175} disabled={mobile || navigating}>
    {#each stages as item, index}
      <section class="scroll-chapter" class:active-chapter={step === index} id={`chapter-${index}`} data-chapter={index} bind:this={chapterElements[index]} aria-labelledby={`chapter-title-${index}`}>
        <div class="narrative">
          <p class="chapter-number">{item.section}</p>
          <h1 id={`chapter-title-${index}`} tabindex="-1">{item.title}</h1>
          <p class="chapter-description">{item.description}</p>
          {#if index === 8}<button class="outline reload-check" onclick={reloadCheck} disabled={noteDirty || !evidence.saved}>Reload to check persistence <span aria-hidden="true">↻</span></button>{/if}
          {#if index === 10}<div class="review-list" aria-label="Presenter experience review">{#each ['Save status and next steps are clear', 'List and editor use consistent titles', 'A failed save keeps the draft and allows retry'] as observation, i}<label><input type="checkbox" bind:checked={review[i]} /><span>{observation}</span></label>{/each}</div><button class="outline refine-design" onclick={() => { designView = 'reference'; go(6); }}>Refine the design <span aria-hidden="true">↶</span></button>{/if}
        </div>
      </section>
    {/each}
    </Scrolly>
  </div>
  <section bind:this={canvas} onfocusin={() => { navigating = true; }} class="stage-canvas" aria-label={`${stage.label} demonstration`}>
    {#if step >= 6}
      <nav class="workflow-loop" aria-label="Design, implement and review loop">
        {#each workflowLoop as item, index}
          {#if index > 0}<span class="loop-arrow" aria-hidden="true">→</span>{/if}
          <button class:active={stage.phase === item.phase} aria-current={stage.phase === item.phase ? 'step' : undefined} onclick={() => go(item.chapter)}>{item.label}</button>
        {/each}
      </nav>
    {/if}
    <div class="canvas-content" class:review-grid={isReview}>
    <aside class="review-reference" hidden={!isReview} aria-label="Generated reference and iteration changes">
      <h2>Generated design</h2>
      <p>A visual reference, not a working app.</p>
      <a href="/design/visual-notes-concept-v2.png" target="_blank" rel="noreferrer" aria-label="Open the generated design at full size"><img src="/design/visual-notes-concept-v2.png" alt="Generated design with illustrated blue note cards and a spacious writing pane" /></a>
      <a class="reference-full-size" href="/design/visual-notes-concept-v2.png" target="_blank" rel="noreferrer">View full-size design</a>
      <h3>What the iterations added</h3>
      <ol class="iteration-changes">
        <li><strong>Write</strong><span>An editable title and draft.</span></li>
        <li><strong>Save</strong><span>Local persistence, search and illustrated cards.</span></li>
        <li><strong>Recover</strong><span>Retained drafts, retry and download after failure.</span></li>
        <li><strong>Review</strong><span>Wrapping titles, readable controls and responsive layouts.</span></li>
      </ol>
      <p class="review-scope">Browser only. Accounts, Favorites and Archive stay outside scope.</p>
    </aside>
    <div class="live-host" hidden={!isLive}>
      {#if isReview}<div class="review-live-heading"><h2>Working note app</h2></div>{/if}
      {#if step === 7}
        <details class="build-choices">
          <summary>Before building: technologies &amp; team</summary>
          <div class="workflow-choices build-decisions">
            <div><label class="choice-select">Project needs <select bind:value={stackScenario}><option value="local">Notes in this browser</option><option value="sync">Accounts and device sync</option></select></label>
            {#if stackScenario === 'local'}
              <dl class="stack-recommendation"><div><dt>SvelteKit + TypeScript</dt><dd>Reuse this app’s stack for interactive UI and type checks.</dd></div><div><dt>Plain CSS + local illustrations</dt><dd>Keep the approved design and avoid a UI framework.</dd></div><div><dt>Browser storage</dt><dd>Simple persistence; no backup or device sync.</dd></div></dl>
            {:else}
              <p class="choice-outcome">Keep SvelteKit; evaluate a backend, authentication and database before adding sync. Hosting cost and data ownership become part of the decision.</p>
            {/if}
            <p class="choice-outcome">Confirm or adjust the recommendation before building.</p></div>
            <div><fieldset class="choice-options"><legend>Would you like to use subagents?</legend><label><input type="radio" name="build-team" checked={plan === 'single'} onchange={() => { plan = 'single'; }} /> One agent</label><label><input type="radio" name="build-team" checked={plan !== 'single'} onchange={() => { plan = 'depth'; }} /> A small team</label></fieldset>
            <p class="choice-outcome">{plan === 'single' ? 'One agent handles the phases in order. Less coordination.' : 'Separate planning/review from execution. Share the accepted design, brief and test results; allow for extra usage.'}</p>
            <button class="outline" onclick={() => { teamView = 'costs'; go(5); }}>Explore roles and costs</button>
            <p class="choice-footnote">Example choices only. The stack stays unchanged and no agents start.</p></div>
          </div>
        </details>
      {/if}
      <NoteEditor active={isLive} iteration={lastLiveIteration} onEvidence={record} onDirty={(value) => { noteDirty = value; }} /></div>
    {#if stage.kind === 'baseline'}
      <div class="comparison-stage"><div class="canvas-top"><span>One prompt. Many unanswered decisions.</span><div class="text-tabs"><button class:active={comparison === 'baseline'} onclick={() => { comparison = 'baseline'; }}>Naive prompt</button><button class:active={comparison === 'direction'} onclick={() => { comparison = 'direction'; }}>With intent</button></div></div><div class="comparison-image"><img src={comparison === 'baseline' ? '/design/generic-baseline.png' : '/design/visual-notes-concept-v2.png'} alt={comparison === 'baseline' ? 'Generated illustrative baseline: a conventional blue note app with a sidebar, search and editor' : 'Generated illustrated note app proposal with blue landscape covers and a spacious writing pane'} /></div><p class="canvas-caption">Illustrative generated designs. The next steps build the working app.</p></div>
    {:else if stage.kind === 'brief'}
      <div class="paper-example"><p class="eyebrow">THE BRIEF</p><h2>One thought.<br>Saved and found again.</h2><p class="document-copy">Write a note, save it, then find it again.</p><div class="scope-lines"><div><span>In scope</span><strong>Write, save, reopen</strong></div><div><span>Environment</span><strong>One browser, one device</strong></div><div><span>Who decides?</span><strong>Presenter and project owner</strong></div></div></div>
    {:else if stage.kind === 'guidance'}
      <div class="paper-example guidance-example"><h2>Rules for every chat.</h2><pre>{docs['AGENTS.md'].text}</pre><h3 class="role-label">Choose a role</h3><div class="text-tabs roles">{#each Object.keys(roles) as item}<button class:active={role === item} onclick={() => { role = item; }}>{item}</button>{/each}</div><p class="role-copy">{roles[role]}</p><p class="canvas-caption">One chat can handle every role. Separate chats are optional.</p></div>
    {:else if stage.kind === 'context'}
      <div class="documents-example"><nav aria-label="Project documents">{#each Object.keys(docs) as name}<button class:active={document === name} onclick={() => { document = name; }}>{name}</button>{/each}</nav><div class="document-preview"><p class="eyebrow">{docs[document].purpose}</p><h2>{document.split('/').at(-1)}</h2><pre>{docs[document].text}</pre><p class="canvas-caption">Condensed excerpts of this project’s guidance. The owning files hold the full context.</p></div></div>
    {:else if stage.kind === 'methods'}
      <div class="paper-example methods-example"><h2>What needs answering?</h2><div class="method-options">{#each Object.keys(methods) as item}<button class:active={method === item} onclick={() => { method = item; }}>{item}</button>{/each}</div><div class="method-result"><h3>{methods[method].name}</h3><p>{methods[method].text}</p></div><p class="canvas-caption">A skill gives reusable instructions. Choose only what the task needs.</p></div>
    {:else if stage.kind === 'team'}
      <div class="team-example"><div class="canvas-top"><span>Optional team</span><div class="text-tabs"><button class:active={teamView === 'setup'} aria-pressed={teamView === 'setup'} onclick={() => { teamView = 'setup'; }}>Roles</button><button class:active={teamView === 'trial'} aria-pressed={teamView === 'trial'} onclick={() => { teamView = 'trial'; }}>Trial replay</button><button class:active={teamView === 'costs'} aria-pressed={teamView === 'costs'} onclick={() => { teamView = 'costs'; }}>Cost examples</button></div></div>{#if teamView === 'setup'}<TeamSetup />{:else if teamView === 'trial'}<CoordinationTrial />{:else}<fieldset class="plan-options"><legend class="sr-only">Explore a separate Codex-only cost example</legend>{#each plans as option}<label class:chosen={plan === option.id}><input type="radio" name="plan" value={option.id} bind:group={plan} /><span><strong>{option.name}</strong><small>{option.description}</small></span></label>{/each}</fieldset><div class="cost-controls"><label>Assumed workload <select bind:value={workload}><option value={1}>60k input / 10k output</option><option value={2}>120k input / 20k output</option><option value={5}>300k input / 50k output</option></select></label><div class="text-tabs"><button class:active={billing === 'api'} onclick={() => { billing = 'api'; }}>API model cost</button><button class:active={billing === 'credits'} onclick={() => { billing = 'credits'; }}>Codex credits</button></div></div><div class="cost-figure"><strong>{billing === 'api' ? '$' + cost.usd.toFixed(3) : cost.credits.toFixed(3)}</strong><span>{billing === 'api' ? 'USD, model tokens only' : 'model credits, credit-based billing'}</span></div><p class="cost-disclosure">Separate Codex-only examples, not prices for the Claude + Codex preset. Standard short-context rates, no caching or tool fees. Total assumed tokens span all roles and calls. Teams may need more work.</p><p class="cost-disclosure">Included subscription quota cannot be predicted from these credits. Your account’s usage dashboard is the source for remaining allowance.</p><details class="rates"><summary>Sources and assumptions · 18 Oct 2026</summary><p>Astra: $10 input / $50 output. Sol: $2 / $10. Luna: $0.10 / $0.50 per million tokens. Reasoning counts toward billable output. Each request assumes short context.</p><p>Credit rates per million input / output: Astra 250 / 1,250. Sol 50 / 250. Luna 2.5 / 12.5. No universal credits-to-USD conversion.</p><p><a href="https://developers.openai.com/api/docs/models/gpt-6-astra" target="_blank" rel="noreferrer">Astra rates</a> · <a href="https://developers.openai.com/api/docs/models/gpt-6.1-sol" target="_blank" rel="noreferrer">Sol rates</a> · <a href="https://developers.openai.com/api/docs/models/gpt-6-luna" target="_blank" rel="noreferrer">Luna rates</a> · <a href="https://learn.chatgpt.com/docs/pricing" target="_blank" rel="noreferrer">Codex pricing</a></p></details><p class="canvas-caption">Exploring this plan does not start agents, switch models or change account settings.</p>{/if}</div>
    {:else if stage.kind === 'design'}
      <div class="design-stage">
        <div class="canvas-top"><span>Choose the design source</span><div class="text-tabs"><button class:active={designView === 'source'} aria-pressed={designView === 'source'} onclick={() => { designView = 'source'; }}>Design source</button><button class:active={designView === 'reference'} aria-pressed={designView === 'reference'} onclick={() => { designView = 'reference'; }}>Generated design</button><button class:active={designView === 'criteria'} aria-pressed={designView === 'criteria'} onclick={() => { designView = 'criteria'; }}>Acceptance criteria</button></div><button class="solid" onclick={() => go(7)}>Implement this direction</button></div>
        {#if designView === 'source'}
          <DesignSource bind:source={designSource} bind:access={figmaAccess} bind:generation={imageGeneration} />
        {:else if designView === 'reference'}
          <img class="design-reference" src="/design/visual-notes-concept-v2.png" alt="Generated Marginal design reference: illustrated blue note cards beside a spacious writing pane" />
          <div class="design-explanation"><p>Agree on the design before building.</p><p class="canvas-caption">Generated reference. Extra pictured features stay outside scope; scrolling runs no models.</p></div>
        {:else}
          <div class="paper-example"><h2>Calm. Clear.<br>Dependable.</h2><p class="document-copy">Agree on these checks, then try them in the working app.</p><div class="criteria-list">{#each [['Clarity', 'Show “Unsaved changes” after editing and “Saved in this browser” only after a successful write.'], ['Consistency', 'Use the same title in the note list and editor, with a clear current selection.'], ['Recovery', 'Keep the draft on failure. Explain the issue and offer retry or download.']] as item, i}<button aria-expanded={criteria[i]} onclick={() => { criteria[i] = !criteria[i]; }}><span>{item[0]}</span><span aria-hidden="true">{criteria[i] ? '−' : '+'}</span></button>{#if criteria[i]}<p>{item[1]}</p>{/if}{/each}</div><p class="canvas-caption">Criteria describe expected behavior. The live app provides the place to verify it.</p></div>
        {/if}
      </div>
    {:else if stage.kind === 'handoff'}
      <div class="paper-example handoff-example"><p class="eyebrow">A HANDOFF YOU CAN USE</p><h2>A working outcome.<br>With honest limits.</h2><div class="evidence-lines">{#each [['saved', 'Successful save observed'], ['reopened', 'Saved content opened from storage or the library'], ['recovery-shown', 'Controlled save failure observed']] as [key, label]}<div><span class:recorded={evidence[key]}>{evidence[key] ? '✓' : '○'}</span><span>{label}</span><small>{evidence[key] ? 'Observed' : 'Not recorded'}</small></div>{/each}</div><a class="source-link" href="https://github.com/e-mric/shared_agents_skills" target="_blank" rel="noreferrer">Read the full shared workflow ↗</a></div>
    {/if}
    </div>
  </section>
</main>
<nav class="storyboard" class:compact-review={isReview} aria-label="Workflow storyboard">{#each stages as item, i}<button class:current={step === i} class:visited={step > i} aria-current={step === i ? 'step' : undefined} onclick={() => go(i)} aria-label={`Chapter ${i + 1}: ${item.label}`}><span class="frame-label"><span>{String(i).padStart(2, '0')}</span>{item.label}</span><span class="mini-frame" class:mini-live={i >= 7 && i <= 10} class:mini-recovery={i === 9} class:mini-team={i === 5}><i class="mini-top"></i><i class="mini-side"></i><i class="mini-line one"></i><i class="mini-line two"></i><i class="mini-line three"></i></span></button>{/each}</nav>
<footer class="presentation-footer" class:compact-review={isReview}><p><span>{String(step + 1).padStart(2, '0')}</span> / {stages.length} <span class="keyboard-hint">Scroll to explore · ← → for chapters</span></p><div><button class="outline" disabled={step === 0} onclick={() => go(step - 1)}>Previous</button><button class="solid" onclick={() => go(step === stages.length - 1 ? 0 : step + 1)}>{step === stages.length - 1 ? 'Back to the beginning' : 'Next step'} <span aria-hidden="true">→</span></button></div></footer>
