export type NoteScope = 'general' | 'mine';

export interface Note {
  id: string;
  author: string;
  date: string; // ISO yyyy-mm-dd
  text: string;
}
