import type { RouteObject } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';

/** Public auth routes (rendered outside the app shell). */
export const authRoutes: RouteObject[] = [{ path: '/login', element: <LoginPage /> }];
