import type { RouteObject } from 'react-router-dom';
import { ProductTypesPage } from './pages/ProductTypesPage';

/** Protected routes (rendered inside the app shell). */
export const productTypesRoutes: RouteObject[] = [{ path: '/tipos-producto', element: <ProductTypesPage /> }];
