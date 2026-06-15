import type { RouteObject } from 'react-router-dom';
import { PlantsListPage } from './pages/PlantsListPage';
import { PlantDetailPage } from './pages/PlantDetailPage';

/** Protected routes (rendered inside the app shell). */
export const plantsRoutes: RouteObject[] = [
  { path: '/plantas', element: <PlantsListPage /> },
  { path: '/plantas/:id', element: <PlantDetailPage /> },
];
