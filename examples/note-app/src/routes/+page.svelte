<script lang="ts">
  import { onMount } from 'svelte';
  import NoteEditor from '../lib/components/NoteEditor.svelte';
  import Scrolly from '../lib/components/Scrolly.svelte';
  import { stages, plans, estimate } from '../lib/story.mjs';

  let step = $state(0);
  let comparison = $state('baseline');
  let proposal = $state(false);
  let role = $state('Implementation');
  let document = $state('AGENTS.md');
  let method = $state('Storage behavior');
  let plan = $state('single');
  let workload = $state(1);
  let billing = $state('api');
  let criteria = $state<boolean[]>([false, false, false]);
  let review = $state<boolean[]>([false, false, false]);
  let evidence = $state<Record<string, boolean>>({});
  let showNotes = $state(false);
  let noteDirty = $state(false);
  let ready = $state(false);
  let fullScreenError = $state('');
  let handoffReady = $state(false);
  let chapterElements = $state<HTMLElement[]>([]);
  let mobile = $state(false);
  const stage = $derived(stages[step]);
  const cost = $derived(estimate(plan, 60000 * workload, 10000 * workload));
  const selectedPlan = $derived(plans.find(p => p.id === plan)!);
  const isLive = $derived(stage.kind === 'live');
  const lastLiveIteration = $derived(step < 8 ? 0 : step < 9 ? 1 : step < 10 ? 2 : 3);
  const storageKey = 'marginal.story.v1';
  const docs: Record<string, { purpose: string; text: string }> = {
    'AGENTS.md': { purpose: 'Working rules', text: 'Read the project index and current state.\nPreserve unrelated work and existing notes.\nA successful write is the basis for “Saved”.\nRun checks and review the complete journey.' },
    'docs/product.md': { purpose: 'Intent and acceptance criteria', text: 'Audience: a presenter and people capturing notes.\nOutcome: write, save and reopen one note.\nIntent: calm, clear and dependable.\nOn failure: retain text, explain and offer recovery.' },
    'docs/project-state.md': { purpose: 'Current state and handoff', text: 'Goal: an interactive workflow presentation.\nStack: SvelteKit, requested by the user.\nEvidence: record checks with their scope.\nNext: use the live demo and review its limits.' },
    'docs/index.md': { purpose: 'Navigation', text: 'Product intent\nStorage research\nCurrent state\nPresentation script\nFocused chat starters' },
  };
  const roles: Record<string, string> = {
    'Product & design': 'Resolve one user problem. Define the journey, intended feeling and observable acceptance criteria. Proposals remain proposals until accepted.',
    Research: 'Answer one bounded question with primary sources. Record dates, uncertainty and applicability. Update the owning research page.',
    Implementation: 'Deliver one accepted outcome. Preserve unrelated work, verify meaningful behavior and leave an actionable handoff.',
    Testing: 'Evaluate a named revision with demo data. Record expected and observed results, reproducible failures and coverage limits.',
  };
  const methods: Record<string, { name: string; text: string }> = {
    'Storage behavior': { name: 'Research', text: 'Can this browser keep notes across reloads? Check primary documentation and the real environment.' },
    'A failed save': { name: 'Diagnosis', text: 'Reproduce the failure, isolate the cause, fix it and add regression coverage.' },
    'A finished change': { name: 'Review', text: 'Compare the final change against accepted criteria and repository conventions.' },
  };
  function persist() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ step, plan, workload, billing, criteria, review, evidence })); } catch { /* Presentation preferences can remain in memory. */ }
  }
  function go(index: number) {
    step = Math.max(0, Math.min(stages.length - 1, index));
    if (ready) {
      persist();
      if (!mobile) chapterElements[step]?.scrollIntoView({ block: 'start', behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
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
  function handoff() {
    const checks = Object.entries(evidence).filter(([, value]) => value).map(([key]) => `- ${key}`).join('\n') || '- No live observations recorded yet';
    return `# Marginal presentation handoff\n\nGoal: explain the shared workflow through an evolving note app.\nStack: SvelteKit. Notes stay in this browser.\n\n## Recorded interactions in this browser session\n${checks}\n\n## Experience review\n${review.filter(Boolean).length} of 3 presenter observations checked.\n\n## Team example explored\n${selectedPlan.name}. This does not start agents or change models.\n\n## Limits and next step\nThis is a local demonstration, not a participant study or a cloud-sync product.\nBrowser storage can be cleared. Unsaved text can be lost on forced close.\nConfirm device/browser behavior before presenting. Recheck current rates before estimating real work.\n`;
  }
  function downloadHandoff() {
    handoffReady = true;
    const url = URL.createObjectURL(new Blob([handoff()], { type: 'text/markdown;charset=utf-8' }));
    const a = window.document.createElement('a'); a.href = url; a.download = 'marginal-handoff.md'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  onMount(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      if (saved) {
        if (Number.isInteger(saved.step)) step = Math.max(0, Math.min(stages.length - 1, saved.step));
        if (plans.some(p => p.id === saved.plan)) plan = saved.plan;
        if ([1, 2, 5].includes(saved.workload)) workload = saved.workload;
        if (['api', 'credits'].includes(saved.billing)) billing = saved.billing;
        if (Array.isArray(saved.criteria) && saved.criteria.length === 3) criteria = saved.criteria.map(Boolean);
        if (Array.isArray(saved.review) && saved.review.length === 3) review = saved.review.map(Boolean);
        if (saved.evidence && typeof saved.evidence === 'object') evidence = { ...evidence, ...saved.evidence };
      }
    } catch { /* Invalid story state never changes notes. */ }
    ready = true;
    const media = window.matchMedia('(max-width: 760px)');
    function updateLayout() { mobile = media.matches; }
    updateLayout();
    const frame = requestAnimationFrame(() => {
      if (!mobile && step > 0) chapterElements[step]?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    media.addEventListener('change', updateLayout);
    return () => { cancelAnimationFrame(frame); media.removeEventListener('change', updateLayout); };
  });
  $effect(() => { if (ready) { step; plan; workload; billing; criteria; review; evidence; persist(); } });
</script>

<svelte:head><title>Marginal — an app, built step by step</title><meta name="description" content="An interactive presentation of a shared development workflow, told through a note app that evolves with each iteration." /></svelte:head>
<svelte:window onkeydown={keyboard} />
<a class="skip-link" href="#chapter">Skip to chapter</a>
<header class="presentation-header"><a href="#chapter" class="wordmark">marginal</a><span class="header-caption">an app, built step by step</span><div class="header-actions"><button onclick={() => { go(0); }}>Restart story</button><button onclick={() => { showNotes = !showNotes; }} aria-pressed={showNotes}>Speaker notes</button><button class="fullscreen" onclick={fullscreen} aria-label="Toggle fullscreen">⛶</button></div></header>
{#if fullScreenError}<p role="status" class="fullscreen-message">{fullScreenError}</p>{/if}
<main id="chapter" class="presentation-main">
  <div class="narrative-track">
    <Scrolly bind:value={step} top={84} bottom={175} disabled={mobile}>
    {#each stages as item, index}
      <section class="scroll-chapter" class:active-chapter={step === index} id={`chapter-${index}`} data-chapter={index} bind:this={chapterElements[index]} aria-labelledby={`chapter-title-${index}`}>
        <div class="narrative">
          <p class="chapter-number">{item.section}</p>
          <h1 id={`chapter-title-${index}`}>{item.title}</h1>
          <p class="chapter-description">{item.description}</p>
          <p class="addition"><span aria-hidden="true">+</span> {item.addition}</p>
          {#if index === 8}<button class="outline reload-check" onclick={reloadCheck} disabled={noteDirty || !evidence.saved}>Reload to check persistence <span aria-hidden="true">↻</span></button>{/if}
          {#if index === 10}<div class="review-list" aria-label="Presenter experience review">{#each ['Save status and next steps are clear', 'List and editor use consistent titles', 'A failed save keeps the draft and allows retry'] as observation, i}<label><input type="checkbox" bind:checked={review[i]} /><span>{observation}</span></label>{/each}</div>{/if}
          {#if showNotes}<aside class="speaker-cue"><p class="eyebrow">PRESENTER CUE</p><p>{item.cue}</p></aside>{/if}
          <p class="interaction-hint">{item.kind === 'live' ? 'Try it in the live app' : index === 0 ? 'Scroll to see the app take shape' : 'Explore, then scroll to continue'} <span aria-hidden="true">{item.kind === 'live' ? '↗' : '↓'}</span></p>
        </div>
      </section>
    {/each}
    </Scrolly>
  </div>
  <section class="stage-canvas" aria-label={`${stage.label} demonstration`}>
    <div class="live-host" hidden={!isLive}><NoteEditor active={isLive} iteration={lastLiveIteration} onEvidence={record} onDirty={(value) => { noteDirty = value; }} /></div>
    {#if stage.kind === 'baseline'}
      <div class="comparison-stage"><div class="canvas-top"><span>One prompt. Many unanswered decisions.</span><div class="text-tabs"><button class:active={comparison === 'baseline'} onclick={() => { comparison = 'baseline'; }}>Naive prompt</button><button class:active={comparison === 'direction'} onclick={() => { comparison = 'direction'; }}>With intent</button></div></div><div class="comparison-image"><img src={comparison === 'baseline' ? '/design/generic-baseline.png' : '/design/visual-notes-concept-v2.png'} alt={comparison === 'baseline' ? 'Generated illustrative baseline: a conventional blue note app with a sidebar, search and editor' : 'Generated illustrated note app proposal with blue landscape covers and a spacious writing pane'} /></div><p class="canvas-caption">Generated design explorations, not a measured model comparison. The following chapters build the live app in iterations.</p></div>
    {:else if stage.kind === 'brief'}
      <div class="paper-example"><p class="eyebrow">THE BRIEF</p><h2>One thought.<br>Saved and found again.</h2><p class="document-copy">A simple browser note app that explains how we build, verify and refine a complete outcome.</p><div class="scope-lines"><div><span>In scope</span><strong>Write, save, reopen</strong></div><div><span>Environment</span><strong>One browser, one device</strong></div><div><span>Who decides?</span><strong>Presenter and project owner</strong></div></div><label class="proposal-toggle"><input type="checkbox" bind:checked={proposal} /><span>Explore adding collaboration</span></label>{#if proposal}<p class="inline-observation">That proposal adds accounts, permissions and sync conflicts. We’ll keep it outside the first milestone.</p>{/if}</div>
    {:else if stage.kind === 'guidance'}
      <div class="paper-example"><p class="eyebrow">AGENTS.md / SHARED WORKING RULES</p><h2>A small set of rules.</h2><pre>{docs['AGENTS.md'].text}</pre><p class="eyebrow role-label">FOUR FOCUSED CHAT ROLES</p><div class="text-tabs roles">{#each Object.keys(roles) as item}<button class:active={role === item} onclick={() => { role = item; }}>{item}</button>{/each}</div><p class="role-copy">{roles[role]}</p><p class="canvas-caption">These roles can run sequentially in one chat. Separate chats are optional.</p></div>
    {:else if stage.kind === 'context'}
      <div class="documents-example"><nav aria-label="Project documents">{#each Object.keys(docs) as name}<button class:active={document === name} onclick={() => { document = name; }}>{name}</button>{/each}</nav><div class="document-preview"><p class="eyebrow">{docs[document].purpose}</p><h2>{document.split('/').at(-1)}</h2><pre>{docs[document].text}</pre><p class="canvas-caption">Condensed excerpts of this project’s guidance. The owning files hold the full context.</p></div></div>
    {:else if stage.kind === 'methods'}
      <div class="paper-example"><p class="eyebrow">TASK FIRST, METHOD SECOND</p><h2>What needs answering?</h2><div class="method-options">{#each Object.keys(methods) as item}<button class:active={method === item} onclick={() => { method = item; }}>{item}<span aria-hidden="true">↗</span></button>{/each}</div><div class="method-result"><span class="eyebrow">A RELEVANT METHOD</span><h3>{methods[method].name}</h3><p>{methods[method].text}</p></div><p class="canvas-caption">Inspect the available skill instructions. Installation is not required for every task.</p></div>
    {:else if stage.kind === 'team'}
      <div class="team-example"><div class="canvas-top"><span>Optional team setup</span><span class="quiet-label">Codex example</span></div><fieldset class="plan-options"><legend class="sr-only">Explore an illustrative team assignment</legend>{#each plans as option}<label class:chosen={plan === option.id}><input type="radio" name="plan" value={option.id} bind:group={plan} /><span><strong>{option.name}</strong><small>{option.description}</small></span></label>{/each}</fieldset><div class="cost-controls"><label>Assumed workload <select bind:value={workload}><option value={1}>60k input / 10k output</option><option value={2}>120k input / 20k output</option><option value={5}>300k input / 50k output</option></select></label><div class="text-tabs"><button class:active={billing === 'api'} onclick={() => { billing = 'api'; }}>API model cost</button><button class:active={billing === 'credits'} onclick={() => { billing = 'credits'; }}>Codex credits</button></div></div><div class="cost-figure"><strong>{billing === 'api' ? '$' + cost.usd.toFixed(3) : cost.credits.toFixed(3)}</strong><span>{billing === 'api' ? 'USD, model tokens only' : 'model credits, credit-based billing'}</span></div><p class="cost-disclosure">Worked estimate, not this app’s bill. Standard short-context rates, no caching or tool fees. Total assumed tokens span all roles and calls. Teams may need more work.</p><p class="cost-disclosure">Included subscription quota cannot be predicted from these credits. Your account’s usage dashboard is the source for remaining allowance.</p><details class="rates"><summary>Sources and assumptions · 18 Oct 2026</summary><p>Astra: $10 input / $50 output. Sol: $2 / $10. Luna: $0.10 / $0.50 per million tokens. Reasoning counts toward billable output. Each request assumes short context.</p><p>Credit rates per million input / output: Astra 250 / 1,250. Sol 50 / 250. Luna 2.5 / 12.5. No universal credits-to-USD conversion.</p><p><a href="https://developers.openai.com/api/docs/models/gpt-6-astra" target="_blank" rel="noreferrer">Astra rates</a> · <a href="https://developers.openai.com/api/docs/models/gpt-6.1-sol" target="_blank" rel="noreferrer">Sol rates</a> · <a href="https://developers.openai.com/api/docs/models/gpt-6-luna" target="_blank" rel="noreferrer">Luna rates</a> · <a href="https://learn.chatgpt.com/docs/pricing" target="_blank" rel="noreferrer">Codex pricing</a></p></details><p class="canvas-caption">Exploring this plan does not start agents, switch models or change account settings.</p></div>
    {:else if stage.kind === 'intent'}
      <div class="paper-example"><p class="eyebrow">PRODUCT INTENT</p><h2>Calm. Clear.<br>Dependable.</h2><p class="document-copy">Turn a feeling into behavior the team can inspect.</p><div class="criteria-list">{#each [['Clarity', 'Show “Unsaved changes” after editing and “Saved in this browser” only after a successful write.'], ['Consistency', 'Use the same title in the note list and editor, with a clear current selection.'], ['Recovery', 'Keep the draft on failure. Explain the issue and offer retry or download.']] as item, i}<button aria-expanded={criteria[i]} onclick={() => { criteria[i] = !criteria[i]; }}><span>{item[0]}</span><span aria-hidden="true">{criteria[i] ? '−' : '+'}</span></button>{#if criteria[i]}<p>{item[1]}</p>{/if}{/each}</div></div>
    {:else if stage.kind === 'handoff'}
      <div class="paper-example handoff-example"><p class="eyebrow">A HANDOFF YOU CAN USE</p><h2>A working outcome.<br>With honest limits.</h2><div class="evidence-lines">{#each [['saved', 'Successful save observed'], ['reopened', 'Saved content opened from storage or the library'], ['recovery-shown', 'Controlled save failure observed']] as [key, label]}<div><span class:recorded={evidence[key]}>{evidence[key] ? '✓' : '○'}</span><span>{label}</span><small>{evidence[key] ? 'Observed' : 'Not recorded'}</small></div>{/each}</div><p class="document-copy">{review.filter(Boolean).length} of 3 experience observations checked by the presenter.</p><button class="solid" onclick={downloadHandoff}>Download this handoff <span aria-hidden="true">↓</span></button><details class="handoff-preview" open={handoffReady}><summary>Read or copy the handoff</summary><pre>{handoff()}</pre></details><p class="canvas-caption">Local browser evidence. No independent user study, backup or device sync.</p><a class="source-link" href="https://github.com/e-mric/shared_agents_skills" target="_blank" rel="noreferrer">Read the full shared workflow ↗</a></div>
    {/if}
  </section>
</main>
<nav class="storyboard" aria-label="Workflow storyboard">{#each stages as item, i}<button class:current={step === i} class:visited={step > i} aria-current={step === i ? 'step' : undefined} onclick={() => go(i)} aria-label={`Chapter ${i + 1}: ${item.label}`}><span class="frame-label"><span>{String(i).padStart(2, '0')}</span>{item.label}</span><span class="mini-frame" class:mini-live={i >= 7 && i <= 10} class:mini-recovery={i === 9} class:mini-team={i === 5}><i class="mini-top"></i><i class="mini-side"></i><i class="mini-line one"></i><i class="mini-line two"></i><i class="mini-line three"></i></span></button>{/each}</nav>
<footer class="presentation-footer"><p><span>{String(step + 1).padStart(2, '0')}</span> / {stages.length} <span class="keyboard-hint">Scroll to explore · ← → for chapters</span></p><div><button class="outline" disabled={step === 0} onclick={() => go(step - 1)}>Previous</button><button class="solid" onclick={() => go(step === stages.length - 1 ? 0 : step + 1)}>{step === stages.length - 1 ? 'Back to the beginning' : 'Next step'} <span aria-hidden="true">→</span></button></div></footer>
