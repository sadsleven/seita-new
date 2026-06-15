import type { UserRow } from '@/lib';
import type { AdminUser, Role, UserStatus } from '../../domain/models/AdminUser';

export interface AdminUserDto {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
}

export const adminUserFromRow = (row: UserRow): AdminUser => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  role: row.role as Role,
  status: row.status as UserStatus,
});

export const adminUserFromDto = (dto: AdminUserDto): AdminUser => ({
  id: dto.id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  email: dto.email,
  role: dto.role as Role,
  status: dto.status as UserStatus,
});
