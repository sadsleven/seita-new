import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { authRoutes } from '@/modules/auth';
import { dashboardRoutes } from '@/modules/dashboard';
import { RequireAuth } from './RequireAuth';
import { ProtectedLayout } from './ProtectedLayout';
import { ScreenBoundary } from './ScreenBoundary';
import { PlaceholderPage } from './PlaceholderPage';
import { NotFoundPage } from './NotFoundPage';

/** Wrap each routed element in a per-screen error boundary. */
const withBoundary = (route: RouteObject): RouteObject =>
  route.element ? { ...route, element: <ScreenBoundary>{route.element}</ScreenBoundary> } : route;

/** Sections from section 5 not yet built — friendly stand-ins keep nav alive. */
const placeholderRoutes: RouteObject[] = [
  { path: '/eventos', element: <PlaceholderPage title="Eventos" icon="mdi-calendar-multiple" description="Aquí podrás crear y administrar tus congresos y ferias técnicas." /> },
  { path: '/eventos/:id', element: <PlaceholderPage title="Detalle del evento" icon="mdi-calendar-text" description="Inicio, registro, productos, paquetes, hoteles, proveedores y facturas." /> },
  { path: '/plantas', element: <PlaceholderPage title="Plantas" icon="mdi-factory" description="Directorio de empresas papeleras participantes y sus contactos." /> },
  { path: '/catalogos', element: <PlaceholderPage title="Catálogos" icon="mdi-format-list-bulleted" description="Países, industrias, tipos de planta, fuentes y asociaciones." /> },
  { path: '/usuarios', element: <PlaceholderPage title="Usuarios" icon="mdi-account-group-outline" description="Administra los usuarios del sistema y sus roles." /> },
  { path: '/tipos-producto', element: <PlaceholderPage title="Tipos de producto" icon="mdi-tag-outline" /> },
  { path: '/perfil', element: <PlaceholderPage title="Mi perfil" icon="mdi-account-circle" description="Edita tus datos y cambia tu contraseña." /> },
  { path: '/configuracion', element: <PlaceholderPage title="Configuración" icon="mdi-tune-variant" description="Muestra u oculta notas y restablece los datos de demostración." /> },
];

const protectedChildren: RouteObject[] = [
  { index: true, element: <Navigate to="/panel" replace /> },
  ...dashboardRoutes,
  ...placeholderRoutes,
].map(withBoundary);

export const router = createBrowserRouter([
  ...authRoutes.map(withBoundary),
  {
    element: <RequireAuth />,
    children: [{ element: <ProtectedLayout />, children: protectedChildren }],
  },
  { path: '*', element: <ScreenBoundary><NotFoundPage /></ScreenBoundary> },
]);
