import type { AdminUser, CreateUserInput, UserStatus } from './models/AdminUser';

export interface UsersGateway {
  list(): Promise<AdminUser[]>;
  create(input: CreateUserInput): Promise<AdminUser>;
  delete(id: number): Promise<void>;
  setStatus(id: number, status: UserStatus): Promise<AdminUser>;
}
