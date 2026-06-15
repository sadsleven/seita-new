/** auth module — public API. Import only from here. */
export { authRoutes, profileRoutes } from './presentation/routes';
export { useAuth } from './presentation/hooks/useAuth';
export { useAuthStore } from './domain/authStore';
export { fullName, initials } from './domain/models/User';
export type { User, Role, UserStatus, Credentials, Session } from './domain/models/User';
