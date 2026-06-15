import { useParams } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { Card, DataTable, IconButton, Select, StatusBadge, TextField } from '@/components/ui';
import type { StatusTone } from '@/components/ui';
import { formatDate } from '@/lib';
import { useRooming } from '../../hooks/useEventLogistics';
import { useEventsStore } from '../../../domain/eventsStore';
import type { RoomingEntry } from '../../../domain/models/Logistics';

function stateOf(r: RoomingEntry): { tone: StatusTone; label: string } {
  if (r.cancelled) return { tone: 'error', label: 'Cancelado' };
  if (r.confirmed) return { tone: 'success', label: 'Confirmado' };
  return { tone: 'warning', label: 'En proceso' };
}

export function RoomingTab() {
  const eventId = Number(useParams().id);
  const { query, setStatus } = useRooming(eventId);
  const filters = useEventsStore((s) => s.roomingFilters);
  const setFilter = useEventsStore((s) => s.setRoomingFilter);

  const all = query.data ?? [];
  const plantOptions = [...new Set(all.map((r) => r.plant))];
  const hotelOptions = [...new Set(all.map((r) => r.hotel))];

  const rows = all.filter(
    (r) =>
      (!filters.search || r.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.plant || r.plant === filters.plant) &&
      (!filters.hotel || r.hotel === filters.hotel),
  );

  const Legend = ({ code, text }: { code: string; text: string }) => (
    <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary' }}>
      <strong style={{ color: 'var(--text-strong)' }}>{code}</strong> · {text}
    </Typography>
  );

  return (
    <Stack spacing={2.25}>
      <Card title="Lista de habitaciones" icon="mdi-bed">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr 1fr' }, gap: 1.75 }}>
          <TextField label="Buscar" icon="mdi-magnify" placeholder="Nombre del huésped…" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
          <Select label="Planta" placeholder="Todas" value={filters.plant} onChange={(v) => setFilter('plant', v)} options={[{ value: '', label: 'Todas' }, ...plantOptions.map((p) => ({ value: p, label: p }))]} />
          <Select label="Hotel" placeholder="Todos" value={filters.hotel} onChange={(v) => setFilter('hotel', v)} options={[{ value: '', label: 'Todos' }, ...hotelOptions.map((h) => ({ value: h, label: h }))]} />
        </Box>
      </Card>

      <Card title="Huéspedes" icon="mdi-account-multiple" subtitle={`${rows.length} de ${all.length}`}>
        <DataTable<RoomingEntry>
          rows={rows}
          rowKey="id"
          emptyText="No hay habitaciones que coincidan."
          columns={[
            { key: 'name', header: 'Nombre', align: 'left', render: (r) => <strong>{r.name}</strong> },
            { key: 'plant', header: 'Planta', align: 'left' },
            { key: 'arrival', header: 'Llegada', render: (r) => formatDate(r.arrival) },
            { key: 'departure', header: 'Salida', render: (r) => formatDate(r.departure) },
            { key: 'na', header: 'NA' },
            { key: 'addtl', header: 'ADDTL' },
            { key: 'totn', header: 'TOTN', render: (r) => <strong>{r.na + r.addtl}</strong> },
            { key: 'hotel', header: 'Hotel', align: 'left' },
            { key: 'companion', header: 'Acompañante', align: 'left' },
            { key: 'state', header: 'Estado', render: (r) => { const s = stateOf(r); return <StatusBadge tone={s.tone} label={s.label} />; } },
            {
              key: 'actions',
              header: 'Asistencia',
              render: (r) => (
                <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
                  <IconButton label="Confirmar asistencia" icon="mdi-check-circle" color={r.confirmed ? 'success' : 'default'} size="small" onClick={() => setStatus.mutate({ id: r.id, field: 'confirmed' })} />
                  <IconButton label="Cancelar asistencia" icon="mdi-close-circle" color={r.cancelled ? 'danger' : 'default'} size="small" onClick={() => setStatus.mutate({ id: r.id, field: 'cancelled' })} />
                </Box>
              ),
            },
          ]}
        />
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap sx={{ mt: 2, pt: 1.75, borderTop: '1px solid var(--border-subtle)' }}>
          <Legend code="NA" text="Noches asignadas" />
          <Legend code="ADDTL" text="Noches adicionales" />
          <Legend code="TOTN" text="Total de noches" />
        </Stack>
      </Card>
    </Stack>
  );
}
