import type { Note, NoteScope } from './models/Note';
import type { UpcomingEvent } from './models/UpcomingEvent';

export interface DashboardData {
  upcomingEvent: UpcomingEvent | null;
  upcomingCount: number;
  notes: Record<NoteScope, Note[]>;
  notesVisible: boolean;
}

export interface DashboardGateway {
  getDashboard(): Promise<DashboardData>;
  addNote(scope: NoteScope, text: string): Promise<Note>;
  deleteNote(scope: NoteScope, id: string): Promise<void>;
}
