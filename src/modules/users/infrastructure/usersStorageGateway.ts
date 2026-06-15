import { db, delay } from '@/lib';
import type { UsersGateway } from '../domain/usersGateway';
import type { AdminUser, CreateUserInput, UserStatus } from '../domain/models/AdminUser';
import { adminUserFromRow } from './dto/AdminUserDto';

export class UsersStorageGateway implements UsersGateway {
  async list(): Promise<AdminUser[]> {
    await delay();
    return db.read().users.map(adminUserFromRow);
  }

  async create(input: CreateUserInput): Promise<AdminUser> {
    await delay();
    return db.write((database) => {
      if (database.nextId['user'] === undefined) database.nextId['user'] = 1;
      const id = database.nextId['user']++;
      const row = {
        id,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        role: input.role,
        status: 'Activo' as UserStatus,
      };
      database.users.push(row);
      return adminUserFromRow(row);
    });
  }

  async delete(id: number): Promise<void> {
    await delay(80);
    db.write((database) => {
      database.users = database.users.filter((u) => u.id !== id);
    });
  }

  async setStatus(id: number, status: UserStatus): Promise<AdminUser> {
    await delay(80);
    return db.write((database) => {
      const row = database.users.find((u) => u.id === id);
      if (!row) throw new Error(`Usuario ${id} no encontrado.`);
      row.status = status;
      return adminUserFromRow(row);
    });
  }
}
