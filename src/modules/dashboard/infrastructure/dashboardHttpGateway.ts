import { http } from '@/lib';
import type { DashboardData, DashboardGateway } from '../domain/dashboardGateway';
import type { Note, NoteScope } from '../domain/models/Note';

/** Production dashboard over HTTP. Mirrors the storage gateway's interface. */
export class DashboardHttpGateway implements DashboardGateway {
  async getDashboard(): Promise<DashboardData> {
    const { data } = await http.get<DashboardData>('/dashboard');
    return data;
  }

  async addNote(scope: NoteScope, text: string): Promise<Note> {
    const { data } = await http.post<Note>('/notes', { scope, text });
    return data;
  }

  async deleteNote(scope: NoteScope, id: string): Promise<void> {
    await http.delete(`/notes/${id}`, { params: { scope } });
  }
}
