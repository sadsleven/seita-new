import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, StatusBadge, Tabs } from '@/components/ui';
import { formatDateRange } from '@/lib';
import { useEvent } from '../hooks/useEvents';

const TABS = [
  { value: 'inicio', label: 'Inicio', icon: 'mdi-view-dashboard-outline' },
  { value: 'registro', label: 'Registro', icon: 'mdi-account-multiple-plus' },
  { value: 'productos', label: 'Productos', icon: 'mdi-package-variant-closed' },
  { value: 'paquetes', label: 'Paquetes', icon: 'mdi-package-variant' },
  { value: 'campanas', label: 'Campañas', icon: 'mdi-bullhorn-outline' },
  { value: 'habitaciones', label: 'Habitaciones', icon: 'mdi-bed' },
  { value: 'hoteles', label: 'Hoteles', icon: 'mdi-office-building' },
  { value: 'proveedores', label: 'Proveedores', icon: 'mdi-truck-outline' },
  { value: 'facturas', label: 'Facturas', icon: 'mdi-receipt-text-outline' },
];

export function EventDetailLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const eventId = Number(useParams().id);
  const { data: event, isLoading, isError } = useEvent(eventId);

  const tab = pathname.split('/')[3] || 'inicio';
  const goTab = (value: string) =>
    navigate(value === 'inicio' ? `/eventos/${eventId}` : `/eventos/${eventId}/${value}`);

  return (
    <Box>
      <Button variant="text" icon="mdi-arrow-left" onClick={() => navigate('/eventos')} sx={{ mb: 1.5 }}>
        Eventos
      </Button>

      {isError ? (
        <Alert severity="error" title="No se pudo cargar el evento">
          Verifica el enlace o vuelve a la lista de eventos.
        </Alert>
      ) : (
        <>
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" sx={{ mb: 1 }}>
            <Typography variant="h1" component="h1" sx={{ minWidth: 0 }}>
              {event ? event.name : 'Cargando…'}
            </Typography>
            {event && (
              <StatusBadge
                tone={event.status === 'FINISHED' ? 'neutral' : 'success'}
                label={event.status === 'FINISHED' ? 'FINALIZADO' : 'ACTIVO'}
              />
            )}
          </Stack>
          {event && (
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {event.address}, {event.country} · {formatDateRange(event.startDate, event.endDate)}
            </Typography>
          )}

          <Box sx={{ borderBottom: '1px solid var(--border-subtle)', mb: 3 }}>
            <Tabs value={tab} onChange={goTab} items={TABS} />
          </Box>

          {isLoading && !event ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Outlet />
          )}
        </>
      )}
    </Box>
  );
}
