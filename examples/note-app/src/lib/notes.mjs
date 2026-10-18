export const STORAGE_KEY = 'marginal.notes.v1';

export class NotesError extends Error {
  constructor(code, message, cause) {
    super(message, { cause });
    this.name = 'NotesError';
    this.code = code;
  }
}

function parse(raw) {
  if (raw === null) return [];
  let data;
  try { data = JSON.parse(raw); } catch (cause) {
    throw new NotesError('corrupt', 'Saved notes could not be read. The stored data has been left untouched.', cause);
  }
  const ids = new Set();
  if (data?.version !== 1 || !Array.isArray(data.notes) || data.notes.some(note => {
    if (!note || typeof note.id !== 'string' || !note.id || ids.has(note.id) ||
      typeof note.title !== 'string' || typeof note.body !== 'string' ||
      typeof note.updatedAt !== 'string' || !Number.isFinite(Date.parse(note.updatedAt))) return true;
    ids.add(note.id);
    return false;
  })) throw new NotesError('corrupt', 'Saved notes have an unfamiliar format. The stored data has been left untouched.');
  return data.notes;
}

export function createNotesStore(getStorage, now = () => new Date().toISOString()) {
  let failNextSave = false;
  function read() {
    try { return parse(getStorage().getItem(STORAGE_KEY)); }
    catch (cause) {
      if (cause instanceof NotesError) throw cause;
      throw new NotesError('storage', 'This browser could not open your saved notes. Check storage permissions and try again.', cause);
    }
  }
  return {
    load() { return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); },
    armFailure() { failNextSave = true; },
    cancelFailure() { failNextSave = false; },
    save(draft, original = null) {
      if (typeof draft?.id !== 'string' || !draft.id || typeof draft.title !== 'string' ||
        typeof draft.body !== 'string' || !(draft.title.trim() || draft.body.trim())) {
        throw new NotesError('empty', 'Write a title or a little text before saving.');
      }
      if (failNextSave) {
        failNextSave = false;
        throw new NotesError('simulated', 'The demo interrupted this save. Your text is still here. Try saving again.');
      }
      const notes = read();
      const existing = notes.find(note => note.id === draft.id) ?? null;
      if (JSON.stringify(existing) !== JSON.stringify(original)) {
        throw new NotesError('conflict', 'This note changed in another tab. Download your draft before reloading to see the latest version.');
      }
      const saved = { id: draft.id, title: draft.title, body: draft.body, updatedAt: now() };
      const next = [saved, ...notes.filter(note => note.id !== saved.id)];
      try { getStorage().setItem(STORAGE_KEY, JSON.stringify({ version: 1, notes: next })); }
      catch (cause) {
        throw new NotesError('storage', 'Your note could not be saved in this browser. Your text is still here. Try again or download a copy.', cause);
      }
      return saved;
    },
  };
}
