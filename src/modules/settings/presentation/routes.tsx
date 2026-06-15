import type { RouteObject } from 'react-router-dom';
import { SettingsPage } from './pages/SettingsPage';

export const settingsRoutes: RouteObject[] = [{ path: '/configuracion', element: <SettingsPage /> }];
