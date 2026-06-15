import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { Button, Card, Chip, DataTable, Dialog, IconButton, TextField } from '@/components/ui';
import { useHotels } from '../../hooks/useEventLogistics';
import type { Hotel } from '../../../domain/models/Logistics';

function NightCell({ label, value }: { label: string; value: number }) {
  return (
    <Box sx={{ textAlign: 'center', p: '10px 6px' }}>
      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ fontSize: 26, fontWeight: 900 }}>{value}</Typography>
    </Box>
  );
}

export function HotelsTab() {
  const eventId = Number(useParams().id);
  const { query, nights, add, remove } = useHotels(eventId);
  const hotels = query.data ?? [];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', priority: 1, single: 0, double: 0 });

  const save = () => {
    if (!form.name) return;
    add.mutate(
      { name: form.name, priority: Number(form.priority), single: Number(form.single), double: Number(form.double) },
      { onSuccess: () => { setForm({ name: '', priority: hotels.length + 1, single: 0, double: 0 }); setOpen(false); } },
    );
  };

  const n = nights.data ?? { booked: 0, assigned: 0, available: 0, additional: 0 };

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr minmax(260px, 320px)' }, gap: 2.25, alignItems: 'start' }}>
        <Card
          title="Hoteles"
          icon="mdi-office-building"
          subtitle={`${hotels.length} ${hotels.length === 1 ? 'hotel asignado' : 'hoteles asignados'}`}
          action={<Button size="sm" icon="mdi-plus" onClick={() => { setForm({ name: '', priority: hotels.length + 1, single: 0, double: 0 }); setOpen(true); }}>Agregar Hotel</Button>}
        >
          <DataTable<Hotel>
            rows={hotels}
            rowKey="id"
            emptyText="No hay hoteles asignados."
            columns={[
              {
                key: 'name',
                header: 'Hotel',
                align: 'left',
                render: (r) => (
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', bgcolor: 'brand.soft', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="mdi mdi-bed" aria-hidden style={{ color: 'var(--primary-600)', fontSize: '1.3rem' }} />
                    </Box>
                    <strong>{r.name}</strong>
                  </Stack>
                ),
              },
              { key: 'priority', header: 'Prioridad', render: (r) => <Chip tone="primary" label={String(r.priority)} /> },
              { key: 'single', header: 'Sencillas' },
              { key: 'double', header: 'Dobles' },
              { key: 'rooms', header: 'Habitaciones', render: (r) => <strong>{r.rooms}</strong> },
              { key: 'nights', header: 'Noches' },
              { key: 'actions', header: 'Acción', render: (r) => <IconButton label="Eliminar hotel" icon="mdi-delete" color="danger" size="small" onClick={() => remove.mutate(r.id)} /> },
            ]}
          />
        </Card>

        <Card title="Noches" icon="mdi-weather-night">
          <Box sx={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border-subtle)' }}>
              <NightCell label="Reservadas" value={n.booked} />
              <NightCell label="Asignadas" value={n.assigned} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <NightCell label="Disponibles" value={n.available} />
              <NightCell label="Adicionales" value={n.additional} />
            </Box>
          </Box>
        </Card>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Agregar Hotel"
        icon="mdi-office-building"
        actions={
          <>
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button icon="mdi-check" disabled={!form.name} loading={add.isPending} onClick={save}>Agregar</Button>
          </>
        }
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField label="Nombre del hotel" placeholder="p. ej. Marriott Centro" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </Box>
          <TextField label="Prioridad" type="number" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))} />
          <Box />
          <TextField label="Habitaciones sencillas" type="number" value={form.single} onChange={(e) => setForm((f) => ({ ...f, single: Number(e.target.value) }))} />
          <TextField label="Habitaciones dobles" type="number" value={form.double} onChange={(e) => setForm((f) => ({ ...f, double: Number(e.target.value) }))} />
        </Box>
      </Dialog>
    </>
  );
}
