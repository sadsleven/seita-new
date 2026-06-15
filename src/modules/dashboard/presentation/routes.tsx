import type { RouteObject } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';

/** Protected routes (rendered inside the app shell). */
export const dashboardRoutes: RouteObject[] = [{ path: '/panel', element: <DashboardPage /> }];
