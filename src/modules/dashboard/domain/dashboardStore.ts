import { create } from 'zustand';
import type { NoteScope } from './models/Note';

interface DashboardState {
  /** Which notes tab is active (Generales / Mías). */
  noteScope: NoteScope;
  setNoteScope: (scope: NoteScope) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  noteScope: 'general',
  setNoteScope: (noteScope) => set({ noteScope }),
}));
