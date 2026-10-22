export type Book = { id: string; title: string; author: string; read: boolean };
export const STORAGE_KEY: string;
export const demoBooks: Book[];
export function createBookStore(getStorage: () => Pick<Storage, 'getItem' | 'setItem'>): {
  load(): Book[];
  seedDemo(): Book[];
  add(book: { id: string; title: string; author?: string }): Book[];
  setRead(id: string, read: boolean): Book[];
};
