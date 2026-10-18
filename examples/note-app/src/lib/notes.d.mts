export type Note = { id: string; title: string; body: string; updatedAt: string };
export type Draft = Pick<Note, 'id' | 'title' | 'body'>;
export const STORAGE_KEY: string;
export class NotesError extends Error { code: string; }
export function createNotesStore(getStorage: () => Pick<Storage, 'getItem' | 'setItem'>, now?: () => string): {
  load(): Note[];
  armFailure(): void;
  cancelFailure(): void;
  save(draft: Draft, original?: Note | null): Note;
};
