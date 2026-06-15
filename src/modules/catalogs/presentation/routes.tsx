import type { RouteObject } from 'react-router-dom';
import { CatalogsPage } from './pages/CatalogsPage';

/** Protected routes (rendered inside the app shell). */
export const catalogsRoutes: RouteObject[] = [{ path: '/catalogos', element: <CatalogsPage /> }];
