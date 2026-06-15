import { db, delay, daysTo } from '@/lib';
import type { DashboardData, DashboardGateway } from '../domain/dashboardGateway';
import type { Note, NoteScope } from '../domain/models/Note';
import type { UpcomingEvent } from '../domain/models/UpcomingEvent';
import { noteFromRow } from './dto/NoteDto';

export class DashboardStorageGateway implements DashboardGateway {
  async getDashboard(): Promise<DashboardData> {
    await delay();
    const data = db.read();

    const active = data.events
      .filter((e) => e.status !== 'FINISHED')
      .map((e) => ({ event: e, daysToStart: daysTo(e.start_date) }))
      .filter((e) => e.daysToStart >= 0)
      .sort((a, b) => a.daysToStart - b.daysToStart);

    const next = active[0];
    const upcomingEvent: UpcomingEvent | null = next
      ? {
          id: next.event.id,
          name: next.event.name,
          shortName: next.event.shortName,
          country: next.event.country,
          address: next.event.address,
          startDate: next.event.start_date,
          endDate: next.event.end_date,
          daysToStart: next.daysToStart,
          status: next.event.status,
        }
      : null;

    return {
      upcomingEvent,
      upcomingCount: active.length,
      notes: {
        general: data.notes.general.map(noteFromRow),
        mine: data.notes.mine.map(noteFromRow),
      },
      notesVisible: data.settings.notesVisible,
    };
  }

  async addNote(scope: NoteScope, text: string): Promise<Note> {
    return db.write((database) => {
      const note: Note = {
        id: `${scope[0]}${Date.now()}`,
        author: scope === 'mine' ? 'Yo' : 'Admin',
        date: new Date().toISOString().slice(0, 10),
        text: text.trim(),
      };
      database.notes[scope].unshift(note);
      return note;
    });
  }

  async deleteNote(scope: NoteScope, id: string): Promise<void> {
    await delay(60);
    db.write((database) => {
      database.notes[scope] = database.notes[scope].filter((n) => n.id !== id);
    });
  }
}
