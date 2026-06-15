import type {
  Credentials,
  Session,
  User,
  UpdateProfileInput,
  ChangePasswordInput,
} from './models/User';

/**
 * Contract the presentation layer depends on. Implemented by
 * infrastructure/authStorageGateway (demo) or authHttpGateway (production) —
 * same interface, swapped via config without touching presentation/.
 */
export interface AuthGateway {
  login(credentials: Credentials): Promise<Session>;
  logout(): Promise<void>;
  /** Restore a persisted session (e.g. on app boot). */
  getSession(): Promise<Session | null>;
  updateProfile(input: UpdateProfileInput): Promise<User>;
  changePassword(input: ChangePasswordInput): Promise<void>;
}
