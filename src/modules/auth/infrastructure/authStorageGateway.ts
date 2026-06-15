import { db, delay, TOKEN_KEY } from '@/lib';
import type { AuthGateway } from '../domain/authGateway';
import type {
  ChangePasswordInput,
  Credentials,
  Session,
  UpdateProfileInput,
  User,
} from '../domain/models/User';
import { userFromRow } from './dto/UserDto';

const SESSION_KEY = 'seita_session';

/**
 * localStorage-backed auth for the demo. Any credentials work (per the design):
 * the typed email is matched against seeded users, falling back to the admin.
 */
export class AuthStorageGateway implements AuthGateway {
  async login({ email }: Credentials): Promise<Session> {
    await delay();
    const users = db.read().users;
    const row =
      users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ?? users[0];
    const user = userFromRow(row);
    const token = `demo-${row.id}-${Date.now()}`;
    const session: Session = { token, user };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  async logout(): Promise<void> {
    await delay(60);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  async getSession(): Promise<Session | null> {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }

  async updateProfile(input: UpdateProfileInput): Promise<User> {
    await delay();
    const session = await this.getSession();
    if (!session) throw new Error('No hay una sesión activa.');

    const updated = db.write((database) => {
      const row = database.users.find((u) => u.id === session.user.id);
      if (row) {
        row.first_name = input.firstName;
        row.last_name = input.lastName;
        row.email = input.email;
      }
      // Keep the display account in sync with the logged-in identity.
      if (database.account) {
        database.account.first_name = input.firstName;
        database.account.last_name = input.lastName;
        database.account.initials =
          `${input.firstName[0] ?? ''}${input.lastName[0] ?? ''}`.toUpperCase();
      }
      return row;
    });

    const user: User = updated
      ? userFromRow(updated)
      : { ...session.user, ...input };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, user }));
    return user;
  }

  async changePassword(_input: ChangePasswordInput): Promise<void> {
    // No password store in the demo — accept and persist nothing.
    await delay();
  }
}
