<script lang="ts">
  import { onMount } from 'svelte';
  import { coverFor } from '../covers.mjs';
  import { createNotesStore, STORAGE_KEY, type Note, type Draft } from '../notes.mjs';
  let { active = false, iteration = 0, onEvidence = (_key: string) => {}, onDirty = (_dirty: boolean) => {} }: { active?: boolean; iteration: number; onEvidence?: (key: string) => void; onDirty?: (dirty: boolean) => void } = $props();
  const store = createNotesStore(() => window.localStorage);
  let notes = $state<Note[]>([]);
  let draft = $state<Draft>({ id: '', title: '', body: '' });
  let original = $state<Note | null>(null);
  let failure = $state<{ code?: string; message: string } | null>(null);
  let loadFailure = $state('');
  let ready = $state(false);
  let armed = $state(false);
  let search = $state('');
  const filteredNotes = $derived(notes.filter(note => `${note.title} ${note.body}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())));
  const editorCover = $derived(coverFor(original ?? { title: '', body: '' }));
  let dialog: HTMLDialogElement;
  let titleField: HTMLInputElement;
  let pending: (() => void) | null = null;
  const dirty = $derived(draft.title !== (original?.title ?? '') || draft.body !== (original?.body ?? ''));
  const hasText = $derived(!!(draft.title.trim() || draft.body.trim()));
  const words = $derived(draft.body.trim() ? draft.body.trim().split(/\s+/u).length : 0);
  const status = $derived(failure ? 'Not saved' : dirty ? 'Unsaved changes' : original ? 'Saved in this browser' : 'New note');
  const title = (note: Pick<Note, 'title'>) => note.title.trim() || 'Untitled note';
  function open(note: Note, focus = true) {
    original = { ...note }; draft = { id: note.id, title: note.title, body: note.body }; failure = null;
    if (focus) titleField?.focus();
    onEvidence('reopened');
  }
  function navigate(action: () => void) {
    if (!dirty) { action(); return; }
    pending = action; dialog.showModal();
  }
  function newNote() {
    navigate(() => { original = null; draft = { id: crypto.randomUUID(), title: '', body: '' }; failure = null; titleField?.focus(); });
  }
  function load() {
    try {
      notes = store.load(); loadFailure = '';
      if (notes.length) open(notes[0], false);
      else { original = null; draft = { id: crypto.randomUUID(), title: '', body: '' }; }
      ready = true;
    } catch (error) { loadFailure = (error as Error).message; ready = false; }
  }
  function save() {
    if (!ready || !dirty || !hasText || iteration < 1) return;
    try {
      const saved = store.save(draft, original);
      original = { ...saved }; draft = { id: saved.id, title: saved.title, body: saved.body };
      notes = store.load(); failure = null; onEvidence('saved');
    } catch (error) {
      failure = error as { code?: string; message: string };
      if (failure.code === 'simulated') onEvidence('recovery-shown');
    }
    armed = false;
  }
  function arm() {
    armed = !armed;
    if (armed) store.armFailure(); else store.cancelFailure();
  }
  function discard() {
    navigate(() => {
      failure = null;
      if (original) open(original);
      else { draft = { id: crypto.randomUUID(), title: '', body: '' }; }
    });
  }
  function download() {
    const url = URL.createObjectURL(new Blob([draft.title + '\n\n' + draft.body], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'marginal-draft.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onEvidence('draft-downloaded');
  }
  function unload(event: BeforeUnloadEvent) { if (dirty) { event.preventDefault(); event.returnValue = ''; } }
  $effect(() => { onDirty(dirty); });
  $effect(() => {
    if (typeof window === 'undefined' || !dirty) return;
    window.addEventListener('beforeunload', unload);
    return () => window.removeEventListener('beforeunload', unload);
  });
  $effect(() => { if (iteration < 2) { armed = false; store.cancelFailure(); } });
  function shortcut(event: KeyboardEvent) {
    if (active && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's' && !dialog?.open) { event.preventDefault(); save(); }
  }
  function refresh(event: StorageEvent) {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    try {
      notes = store.load();
      const current = notes.find(note => note.id === draft.id);
      if (current && !dirty) open(current, false);
    } catch (error) { loadFailure = (error as Error).message; }
  }
  onMount(() => {
    load(); window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  });
</script>

<svelte:window onkeydown={shortcut} />
<div class="note-app" class:writing-only={iteration === 0} class:illustrated={iteration >= 1} class:refined={iteration >= 3}>
  <header class="note-top"><span class="app-brand"><span aria-hidden="true">⌁</span> marginal</span><span class="app-tagline">A little room for thought.</span><button onclick={newNote} disabled={!ready}>+ New note</button></header>
  {#if loadFailure}<div class="note-alert" role="alert"><p>{loadFailure}</p><button onclick={load}>Try opening notes again</button></div>{/if}
  <div class="note-workspace">
    {#if iteration >= 1}
      <nav class="note-list" aria-label="Saved notes">
        <div class="library-heading"><h2>Your notes</h2><span>{notes.length}</span></div>
        <label class="sr-only" for="note-search">Search notes</label>
        <input id="note-search" class="note-search" type="search" bind:value={search} placeholder="Search your thoughts…" />
        <div class="note-cards">
          {#if !notes.length}
            <div class="empty-library"><img src="/illustrations/paper-boat.png" alt="" /><p>A thought starts here.</p><span>Write your first note, then save it to keep it here.</span></div>
          {:else if !filteredNotes.length}
            <p class="empty-list">No matching notes.<br>Try another search.</p>
          {/if}
          {#each filteredNotes as note (note.id)}
            <button class="note-card" class:chosen={draft.id === note.id} aria-current={draft.id === note.id ? 'true' : undefined} onclick={() => { if (note.id !== draft.id) navigate(() => open(note)); }}>
              <img class="note-cover" src={coverFor(note)} alt="" />
              <span class="note-card-copy"><strong>{title(note)}</strong><span class="note-excerpt">{note.body.trim() || 'A little space for your next thought.'}</span><time datetime={note.updatedAt}>{new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(note.updatedAt))}</time></span>
            </button>
          {/each}
        </div>
        <span class="storage-caption">Stored in this browser only<small>Covers selected locally from note text.</small></span>
      </nav>
    {/if}
    <section class="note-editor" aria-label="Note editor">
      <div class="note-toolbar">
        <p class:error={!!failure} class:unsaved={dirty && !failure} role="status">{iteration === 0 ? 'Draft in memory' : status}</p>
        {#if iteration >= 1}<div><button class="subtle-button" disabled={!dirty} onclick={discard}>Discard</button><button class="save-button" disabled={!ready || !dirty || !hasText} onclick={save}>{failure ? 'Retry save' : 'Save note'}</button></div>{/if}
      </div>
      {#if failure}
        <div class="note-alert" role="alert"><strong>Your text is still here.</strong><p>{failure.message}</p><div>{#if !['corrupt', 'conflict'].includes(failure.code ?? '')}<button onclick={save} disabled={!hasText}>Try saving again</button>{/if}<button onclick={download}>Download draft</button></div></div>
      {/if}
      {#if iteration >= 2}<div class="editor-cover"><img src={editorCover} alt="" /></div>{/if}
      <label class="sr-only" for="note-title">Note title</label><input id="note-title" bind:this={titleField} bind:value={draft.title} disabled={!ready} placeholder="Untitled note" maxlength="160" autocomplete="off" />
      <label class="sr-only" for="note-body">Note text</label><textarea id="note-body" bind:value={draft.body} disabled={!ready} placeholder="What’s on your mind?" spellcheck="true"></textarea>
      <div class="note-word-count">{words} {words === 1 ? 'word' : 'words'}</div>
    </section>
  </div>
  {#if iteration >= 2}
    <div class="recovery-tools"><button onclick={arm} disabled={!ready}>{armed ? 'Cancel interruption' : 'Interrupt next save'}</button><span role="status">{armed ? 'Next save will fail once. Edit, then save.' : 'Controlled demo. Saved notes stay untouched.'}</span></div>
  {/if}
  <footer class="note-bottom"><span>Iteration {String(iteration + 1).padStart(2, '0')} / {['Writing', 'Persistence', 'Recovery', 'Experience review'][iteration]}</span><span><i></i> LIVE APP</span></footer>
</div>
<dialog bind:this={dialog} aria-labelledby="unsaved-heading" oncancel={() => { pending = null; }}>
  <h2 id="unsaved-heading">Keep this thought?</h2><p>You have unsaved changes. Keep editing to save them, or discard them to continue.</p>
  <div class="dialog-actions"><button class="solid" onclick={() => { pending = null; dialog.close(); }}>Keep editing</button><button onclick={() => { const action = pending; pending = null; dialog.close(); action?.(); }}>Discard changes</button></div>
</dialog>
