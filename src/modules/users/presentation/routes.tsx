import type { RouteObject } from 'react-router-dom';
import { UsersPage } from './pages/UsersPage';

/** Protected routes (rendered inside the app shell). */
export const usersRoutes: RouteObject[] = [{ path: '/usuarios', element: <UsersPage /> }];
