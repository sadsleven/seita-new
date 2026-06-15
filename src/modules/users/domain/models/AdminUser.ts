/** Domain models for the users admin module — pure TypeScript, no React/MUI/HTTP. */

export type Role = 'Administrador General' | 'Gestor de Evento' | 'Auditor';

export type UserStatus = 'Activo' | 'Inactivo';

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: UserStatus;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export const fullName = (user: AdminUser): string => `${user.firstName} ${user.lastName}`;
