export const STORAGE_KEY = 'next-chapter.books.v1';

export const demoBooks = [
  { id: 'creative-act', title: 'The Creative Act', author: 'Rick Rubin', read: false },
  { id: 'earthsea', title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', read: false },
  { id: 'little-prince', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', read: true },
  { id: 'noticing', title: 'The Art of Noticing', author: 'Rob Walker', read: false },
];

function validate(books) {
  if (!Array.isArray(books)) throw new Error('The saved list could not be read. It has been left untouched.');
  const ids = new Set();
  for (const book of books) {
    if (!book || typeof book.id !== 'string' || !book.id || ids.has(book.id) ||
        typeof book.title !== 'string' || !book.title.trim() ||
        typeof book.author !== 'string' || typeof book.read !== 'boolean') {
      throw new Error('The saved list could not be read. It has been left untouched.');
    }
    ids.add(book.id);
  }
  return books.map(book => ({ id: book.id, title: book.title, author: book.author, read: book.read }));
}

export function createBookStore(getStorage) {
  function load() {
    const raw = getStorage().getItem(STORAGE_KEY);
    if (raw === null) return [];
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error('The saved list could not be read. It has been left untouched.'); }
    if (data?.version !== 1) throw new Error('This saved list uses an unfamiliar format. It has been left untouched.');
    return validate(data.books);
  }
  function write(books) {
    const clean = validate(books);
    getStorage().setItem(STORAGE_KEY, JSON.stringify({ version: 1, books: clean }));
    return clean;
  }
  return {
    load,
    seedDemo() {
      return getStorage().getItem(STORAGE_KEY) === null ? write(demoBooks) : load();
    },
    add({ id, title, author = '' }) {
      if (!title.trim()) throw new Error('Add a book title first.');
      const books = load();
      return write([{ id, title: title.trim(), author: author.trim(), read: false }, ...books]);
    },
    setRead(id, read) {
      const books = load();
      if (!books.some(book => book.id === id)) throw new Error('This book is no longer in the saved list. Try opening the list again.');
      return write(books.map(book => book.id === id ? { ...book, read } : book));
    },
  };
}
