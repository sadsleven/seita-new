import type { RouteObject } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

/** Public auth routes (rendered outside the app shell). */
export const authRoutes: RouteObject[] = [{ path: '/login', element: <LoginPage /> }];

/** Protected profile route (rendered inside the app shell). */
export const profileRoutes: RouteObject[] = [{ path: '/perfil', element: <ProfilePage /> }];
