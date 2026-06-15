import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth';

/** Route guard: redirects to /login (remembering the target) when signed out. */
export function RequireAuth() {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === 'idle') return null; // App shows a splash while bootstrapping.
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
