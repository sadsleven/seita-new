import { create } from 'zustand';
import type { Session, User } from './models/User';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

interface AuthState {
  session: Session | null;
  /** 'idle' until the persisted session has been checked on boot. */
  status: AuthStatus;
  setSession: (session: Session | null) => void;
  patchUser: (user: User) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  status: 'idle',
  setSession: (session) =>
    set({ session, status: session ? 'authenticated' : 'unauthenticated' }),
  patchUser: (user) =>
    set((state) => (state.session ? { session: { ...state.session, user } } : state)),
  clear: () => set({ session: null, status: 'unauthenticated' }),
}));
