import { useCallback } from 'react';
import { useAuthStore } from '../../domain/authStore';
import { authGateway } from '../../infrastructure';
import type {
  ChangePasswordInput,
  Credentials,
  UpdateProfileInput,
} from '../../domain/models/User';

/** Presentation entry point to auth: reads the store, drives the gateway. */
export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const status = useAuthStore((s) => s.status);
  const setSession = useAuthStore((s) => s.setSession);
  const patchUser = useAuthStore((s) => s.patchUser);
  const clear = useAuthStore((s) => s.clear);

  const login = useCallback(
    async (credentials: Credentials) => {
      const next = await authGateway.login(credentials);
      setSession(next);
      return next;
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    await authGateway.logout();
    clear();
  }, [clear]);

  /** Restore a persisted session on app boot. */
  const bootstrap = useCallback(async () => {
    const restored = await authGateway.getSession();
    setSession(restored);
    return restored;
  }, [setSession]);

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      const user = await authGateway.updateProfile(input);
      patchUser(user);
      return user;
    },
    [patchUser],
  );

  const changePassword = useCallback(
    (input: ChangePasswordInput) => authGateway.changePassword(input),
    [],
  );

  return {
    user: session?.user ?? null,
    session,
    status,
    isAuthenticated: status === 'authenticated',
    login,
    logout,
    bootstrap,
    updateProfile,
    changePassword,
  };
}
