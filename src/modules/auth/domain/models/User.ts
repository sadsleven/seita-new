/** Domain models for authentication — pure TypeScript, no React/MUI/HTTP. */

export type Role = 'Administrador General' | 'Gestor de Evento' | 'Auditor';

export type UserStatus = 'Activo' | 'Inactivo';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: UserStatus;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const fullName = (user: User): string => `${user.firstName} ${user.lastName}`;

export const initials = (user: User): string =>
  `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
