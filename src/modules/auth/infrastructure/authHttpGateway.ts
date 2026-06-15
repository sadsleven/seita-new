import { http, TOKEN_KEY } from '@/lib';
import type { AuthGateway } from '../domain/authGateway';
import type {
  ChangePasswordInput,
  Credentials,
  Session,
  UpdateProfileInput,
  User,
} from '../domain/models/User';
import { userFromDto, type UserDto } from './dto/UserDto';

/**
 * Production auth over HTTP (Axios). Same interface as the storage gateway, so
 * presentation/ and domain/ never change when switching VITE_GATEWAY=http.
 */
export class AuthHttpGateway implements AuthGateway {
  async login(credentials: Credentials): Promise<Session> {
    const { data } = await http.post<{ token: string; user: UserDto }>('/auth/login', credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    return { token: data.token, user: userFromDto(data.user) };
  }

  async logout(): Promise<void> {
    try {
      await http.post('/auth/logout');
    } finally {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  async getSession(): Promise<Session | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const { data } = await http.get<UserDto>('/auth/me');
    return { token, user: userFromDto(data) };
  }

  async updateProfile(input: UpdateProfileInput): Promise<User> {
    const { data } = await http.put<UserDto>('/auth/profile', input);
    return userFromDto(data);
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await http.put('/auth/password', input);
  }
}
