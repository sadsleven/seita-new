import type { RouteObject } from 'react-router-dom';
import { EventsListPage } from './pages/EventsListPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { EventDetailLayout } from './pages/EventDetailLayout';
import { EventHomeTab } from './pages/tabs/EventHomeTab';
import { RegistrationTab } from './pages/tabs/RegistrationTab';
import { ProductsTab } from './pages/tabs/ProductsTab';
import { PackagesTab } from './pages/tabs/PackagesTab';
import { CampaignsTab } from './pages/tabs/CampaignsTab';
import { RoomingTab } from './pages/tabs/RoomingTab';
import { HotelsTab } from './pages/tabs/HotelsTab';
import { VendorsTab } from './pages/tabs/VendorsTab';
import { InvoicesTab } from './pages/tabs/InvoicesTab';

export const eventsRoutes: RouteObject[] = [
  { path: '/eventos', element: <EventsListPage /> },
  { path: '/eventos/crear', element: <CreateEventPage /> },
  {
    path: '/eventos/:id',
    element: <EventDetailLayout />,
    children: [
      { index: true, element: <EventHomeTab /> },
      { path: 'registro', element: <RegistrationTab /> },
      { path: 'productos', element: <ProductsTab /> },
      { path: 'paquetes', element: <PackagesTab /> },
      { path: 'campanas', element: <CampaignsTab /> },
      { path: 'habitaciones', element: <RoomingTab /> },
      { path: 'hoteles', element: <HotelsTab /> },
      { path: 'proveedores', element: <VendorsTab /> },
      { path: 'facturas', element: <InvoicesTab /> },
    ],
  },
];
