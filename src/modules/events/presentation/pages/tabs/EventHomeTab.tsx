import { Box, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Card, StatCard } from '@/components/ui';
import { formatCurrency } from '@/lib';
import { useEvent, useEventStats } from '../../hooks/useEvents';
import { useHotels } from '../../hooks/useEventLogistics';
import { EventBanner } from '../../components/EventBanner';
import { RegistrationRing } from '../../components/RegistrationRing';

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <Box sx={{ flex: 1, textAlign: 'center', px: 1, py: 0.5 }}>
      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: 32, fontWeight: 900, color: 'text.primary' }}>{value}</Typography>
    </Box>
  );
}

export function EventHomeTab() {
  const eventId = Number(useParams().id);
  const { data: event } = useEvent(eventId);
  const { data: stats } = useEventStats(eventId);
  const { query: hotelsQuery } = useHotels(eventId);

  if (!event) return null;
  const hotels = hotelsQuery.data ?? [];

  return (
    <Stack spacing={3}>
      <EventBanner event={event} />

      <Box sx={{ display: 'grid', gap: 2.25, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
        <StatCard label="Productos asignados" value={stats?.assignedProducts ?? 0} icon="mdi-package-variant-closed" tone="gold" />
        <StatCard label="Ingresos brutos" value={formatCurrency(stats?.grossIncome ?? 0)} icon="mdi-currency-usd" tone="green" />
        <StatCard label="Plantas registradas" value={stats?.plantsRegistered ?? 0} icon="mdi-factory" tone="navy" />
      </Box>

      <Card title="Panel de Registro" icon="mdi-file-chart">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.25, justifyContent: 'space-around' }}>
          <RegistrationRing value={stats?.attendees ?? 0} total={stats?.totalOrders ?? 0} color="var(--success-500)" label="Asistentes" />
          <RegistrationRing value={stats?.spouses ?? 0} total={stats?.totalOrders ?? 0} color="var(--info-500)" label="Acompañantes" />
          <RegistrationRing value={stats?.presentations ?? 0} total={stats?.totalOrders ?? 0} color="var(--brand-navy)" label="Pres. Técnicas" />
          <RegistrationRing value={stats?.tableTops ?? 0} total={stats?.totalOrders ?? 0} color="var(--warning-500)" label="Mesas" />
          <RegistrationRing value={stats?.others ?? 0} total={stats?.totalOrders ?? 0} color="var(--error-500)" label="Otros" />
        </Box>
      </Card>

      <Box sx={{ display: 'grid', gap: 2.25, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Card title="Empresas por línea de producto" icon="mdi-domain">
          <Box sx={{ display: 'flex' }}>
            <Figure label="Papel" value={stats?.paper ?? 0} />
            <Figure label="Lata" value={stats?.can ?? 0} />
            <Figure label="Corr" value={stats?.corr ?? 0} />
            <Figure label="Total" value={stats?.totalCat ?? 0} />
          </Box>
        </Card>

        <Card title="Hoteles y habitaciones" icon="mdi-office-building">
          {hotels.length === 0 ? (
            <Typography color="text.secondary">No hay hoteles asignados aún.</Typography>
          ) : (
            <Stack spacing={1.5}>
              {hotels.map((h) => (
                <Box key={h.id} sx={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', p: '12px 14px' }}>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>{h.name}</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <Figure label="Habitaciones" value={h.rooms} />
                    <Figure label="Disponibles" value={h.available} />
                    <Figure label="Asignadas" value={h.assigned} />
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Card>
      </Box>
    </Stack>
  );
}
