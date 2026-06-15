import type { NoteRow } from '@/lib';
import type { Note } from '../../domain/models/Note';

export const noteFromRow = (row: NoteRow): Note => ({
  id: row.id,
  author: row.author,
  date: row.date,
  text: row.text,
});
