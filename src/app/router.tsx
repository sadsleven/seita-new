import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { authRoutes, profileRoutes } from '@/modules/auth';
import { dashboardRoutes } from '@/modules/dashboard';
import { eventsRoutes } from '@/modules/events';
import { plantsRoutes } from '@/modules/plants';
import { catalogsRoutes } from '@/modules/catalogs';
import { usersRoutes } from '@/modules/users';
import { productTypesRoutes } from '@/modules/productTypes';
import { settingsRoutes } from '@/modules/settings';
import { RequireAuth } from './RequireAuth';
import { ProtectedLayout } from './ProtectedLayout';
import { ScreenBoundary } from './ScreenBoundary';
import { NotFoundPage } from './NotFoundPage';

/** Wrap a leaf route's element in a per-screen error boundary (keyed by pathname). */
const withBoundary = (route: RouteObject): RouteObject =>
  route.element ? { ...route, element: <ScreenBoundary>{route.element}</ScreenBoundary> } : route;

/**
 * Wrap a route and, if it has children, give the layout a STABLE boundary key
 * (its path pattern) so navigating between its nested tabs doesn't remount it,
 * while each child still gets its own pathname-keyed boundary.
 */
const withBoundaryDeep = (route: RouteObject): RouteObject => {
  if (route.children) {
    return {
      ...route,
      element: route.element ? (
        <ScreenBoundary resetKey={route.path ?? 'layout'}>{route.element}</ScreenBoundary>
      ) : (
        route.element
      ),
      children: route.children.map(withBoundary),
    };
  }
  return withBoundary(route);
};

const protectedChildren: RouteObject[] = [
  { index: true, element: <Navigate to="/panel" replace /> },
  ...dashboardRoutes,
  ...eventsRoutes,
  ...plantsRoutes,
  ...catalogsRoutes,
  ...usersRoutes,
  ...productTypesRoutes,
  ...settingsRoutes,
  ...profileRoutes,
].map(withBoundaryDeep);

export const router = createBrowserRouter([
  ...authRoutes.map(withBoundary),
  {
    element: <RequireAuth />,
    children: [{ element: <ProtectedLayout />, children: protectedChildren }],
  },
  { path: '*', element: <ScreenBoundary><NotFoundPage /></ScreenBoundary> },
]);
