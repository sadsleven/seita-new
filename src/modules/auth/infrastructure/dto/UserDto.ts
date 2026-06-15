import type { UserRow } from '@/lib';
import type { Role, User, UserStatus } from '../../domain/models/User';

/** Wire/persistence shape for a user (matches the HTTP API and the demo db). */
export interface UserDto {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
}

export const userFromRow = (row: UserRow): User => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  role: row.role as Role,
  status: row.status as UserStatus,
});

export const userFromDto = (dto: UserDto): User => ({
  id: dto.id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  email: dto.email,
  role: dto.role as Role,
  status: dto.status as UserStatus,
});
