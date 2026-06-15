import { http } from '@/lib';
import type { UsersGateway } from '../domain/usersGateway';
import type { AdminUser, CreateUserInput, UserStatus } from '../domain/models/AdminUser';
import { adminUserFromDto, type AdminUserDto } from './dto/AdminUserDto';

/** Production users management over HTTP. */
export class UsersHttpGateway implements UsersGateway {
  async list(): Promise<AdminUser[]> {
    const { data } = await http.get<AdminUserDto[]>('/users');
    return data.map(adminUserFromDto);
  }

  async create(input: CreateUserInput): Promise<AdminUser> {
    const { data } = await http.post<AdminUserDto>('/users', {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      role: input.role,
    });
    return adminUserFromDto(data);
  }

  async delete(id: number): Promise<void> {
    await http.delete(`/users/${id}`);
  }

  async setStatus(id: number, status: UserStatus): Promise<AdminUser> {
    const { data } = await http.patch<AdminUserDto>(`/users/${id}/status`, { status });
    return adminUserFromDto(data);
  }
}
