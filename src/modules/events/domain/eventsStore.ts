import { create } from 'zustand';

interface RoomingFilters {
  search: string;
  plant: string;
  hotel: string;
}

interface EventsState {
  /** Rooming-list filters (shared UI state for the Habitaciones tab). */
  roomingFilters: RoomingFilters;
  setRoomingFilter: (key: keyof RoomingFilters, value: string) => void;
  resetRoomingFilters: () => void;
  /** Active sub-tab of the Facturas tab. */
  invoiceTab: 'list' | 'templates';
  setInvoiceTab: (tab: 'list' | 'templates') => void;
}

const emptyFilters: RoomingFilters = { search: '', plant: '', hotel: '' };

export const useEventsStore = create<EventsState>((set) => ({
  roomingFilters: emptyFilters,
  setRoomingFilter: (key, value) =>
    set((s) => ({ roomingFilters: { ...s.roomingFilters, [key]: value } })),
  resetRoomingFilters: () => set({ roomingFilters: emptyFilters }),
  invoiceTab: 'list',
  setInvoiceTab: (invoiceTab) => set({ invoiceTab }),
}));
