<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { createBookStore, STORAGE_KEY, type Book } from '../lib/books.mjs';
  import '../style.css';

  const store = createBookStore(() => window.localStorage);
  const filters = ['All', 'Unread', 'Read'] as const;
  let filter = $state<(typeof filters)[number]>('All');
  let books = $state<Book[]>([]);
  let ready = $state(false);
  let adding = $state(false);
  let title = $state('');
  let author = $state('');
  let titleError = $state(false);
  let error = $state('');
  let announcement = $state('');
  let titleField = $state<HTMLInputElement>();
  let addButton = $state<HTMLButtonElement>();
  const readCount = $derived(books.filter(book => book.read).length);
  const visibleBooks = $derived(books.filter(book => filter === 'All' || (filter === 'Read' ? book.read : !book.read)));
  const cover = (id: string) => [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;

  function load() {
    try {
      books = new URLSearchParams(location.search).get('demo') === '1' ? store.seedDemo() : store.load();
      ready = true; error = '';
    } catch (cause) {
      ready = false;
      error = cause instanceof Error && cause.message.includes('left untouched')
        ? cause.message : 'Your browser could not open the list. Check that browser storage is available, then try again.';
    }
  }
  async function showForm() {
    adding = true; titleError = false;
    await tick(); titleField?.focus();
  }
  async function cancel() {
    adding = false; title = ''; author = ''; titleError = false;
    await tick(); addButton?.focus();
  }
  async function save(event: SubmitEvent) {
    event.preventDefault();
    if (!title.trim()) { titleError = true; titleField?.focus(); return; }
    try {
      books = store.add({ id: crypto.randomUUID(), title, author });
      announcement = `Added ${title.trim()}.`;
      error = ''; filter = 'All'; await cancel();
    } catch {
      error = 'This book wasn’t saved. Your text is still here. Check that browser storage has space, then try Save book again.';
    }
  }
  function toggle(book: Book, checkbox: HTMLInputElement) {
    try {
      books = store.setRead(book.id, !book.read);
      error = ''; announcement = `${book.title} marked ${book.read ? 'unread' : 'read'}.`;
    } catch {
      checkbox.checked = book.read;
      error = 'The reading status wasn’t saved. Your previous status is unchanged. Try again when browser storage is available.';
    }
  }
  function refresh(event: StorageEvent) { if (event.key === STORAGE_KEY || event.key === null) load(); }
  onMount(() => { load(); window.addEventListener('storage', refresh); return () => window.removeEventListener('storage', refresh); });
</script>

<svelte:head>
  <title>Next Chapter — Reading list</title>
  <meta name="description" content="A little space for books you want to read, and the ones you have." />
</svelte:head>

<a class="skip-link" href="#books">Skip to your books</a>
<div class="shell">
  <header class="app-header">
    <a class="wordmark" href="/">next chapter</a>
    <button class="primary add-book" bind:this={addButton} onclick={showForm} disabled={!ready}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3v14M3 10h14" /></svg>
      Add book
    </button>
  </header>
  <main id="books">
    <div class="list-heading"><h1>Reading list</h1><p>{books.length} {books.length === 1 ? 'book' : 'books'} <span aria-hidden="true">·</span> {readCount} read</p></div>
    <div class="filters" role="group" aria-label="Filter books">
      {#each filters as option}<button aria-pressed={filter === option} onclick={() => { filter = option; }}>{option}</button>{/each}
    </div>
    <p class="sr-only" role="status">{announcement}</p>
    {#if error}<div class="error" role="alert"><p>{error}</p>{#if !ready}<button onclick={load}>Try opening the list again</button>{/if}</div>{/if}
    {#if !ready && !error}<p class="empty">Opening your books…</p>
    {:else if ready && !books.length}<div class="empty"><h2>Your next chapter starts here.</h2><p>Add a book you’ve been meaning to read.</p>{#if !adding}<button class="text-button" onclick={showForm}>Add your first book</button>{/if}</div>
    {:else if ready && !visibleBooks.length}<div class="empty"><h2>{filter === 'Read' ? 'Good stories await.' : 'All caught up.'}</h2><p>{filter === 'Read' ? 'Books you mark as read will appear here.' : 'There are no unread books in your list.'}</p><button class="text-button" onclick={() => { filter = 'All'; }}>Show all books</button></div>
    {:else}
      <ul class="book-list" aria-label={`${filter} books`}>
        {#each visibleBooks as book (book.id)}
          <li class:finished={book.read}>
            <svg class="book-cover" data-cover={cover(book.id)} aria-hidden="true" viewBox="0 0 72 100" fill="none">
              <rect x=".5" y=".5" width="71" height="99" rx="1" fill="var(--cover-paper)" stroke="var(--cover-edge)" />
              {#if cover(book.id) === 0}<circle cx="71" cy="54" r="42" fill="var(--cover-ink)" />
              {:else if cover(book.id) === 1}<path d="M7 100V18a62 62 0 0 1 0 82Z" fill="var(--cover-ink)" />
              {:else if cover(book.id) === 2}<path d="M7 0h65v100H7z" fill="var(--cover-ink)" /><circle cx="39" cy="44" r="17" fill="var(--cover-paper)" />
              {:else}<path d="M9 0h12v100H9zM29 0h8v100h-8zM44 20l22 80H44z" fill="var(--cover-ink)" />{/if}
              <path d="M5 0v100" stroke="var(--cover-edge)" />
            </svg>
            <div class="book-copy"><h2>{book.title}</h2>{#if book.author}<p>{book.author}</p>{/if}</div>
            <label class="read-control"><input type="checkbox" disabled={!ready} checked={book.read} onchange={event => toggle(book, event.currentTarget)} aria-label={`${book.read ? 'Mark as unread' : 'Mark as read'}: ${book.title}`} /><span>{book.read ? 'Read' : 'Mark as read'}</span></label>
          </li>
        {/each}
      </ul>
    {/if}
    {#if adding}
      <form class="add-form" onsubmit={save} novalidate aria-labelledby="add-heading">
        <h2 id="add-heading">Add a book</h2>
        <div class="form-fields">
          <div><label for="book-title">Title</label><input id="book-title" bind:this={titleField} bind:value={title} oninput={() => { titleError = false; }} aria-invalid={titleError} aria-describedby={titleError ? 'title-error' : undefined} required maxlength="240" autocomplete="off" />{#if titleError}<p class="field-error" id="title-error">Add a book title first.</p>{/if}</div>
          <div><label for="book-author">Author <span>(optional)</span></label><input id="book-author" bind:value={author} maxlength="240" autocomplete="off" /></div>
        </div>
        <div class="form-actions"><button class="primary" type="submit" disabled={!ready}>Save book</button><button class="quiet" type="button" onclick={cancel}>Cancel</button></div>
      </form>
    {/if}
  </main>
  <footer><svg aria-hidden="true" width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 8V6a5 5 0 0 1 10 0v2M4 8h12v10H4z" /></svg>{ready && books.length ? 'Saved in this browser' : 'Books stay in this browser'}</footer>
</div>
