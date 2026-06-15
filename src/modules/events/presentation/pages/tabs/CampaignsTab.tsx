import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Button, Card, Chip, DataTable, Dialog, IconButton, StatusBadge, TextField } from '@/components/ui';
import { addDays, formatDate } from '@/lib';
import { useCampaigns } from '../../hooks/useEventCommerce';
import type { Campaign } from '../../../domain/models/EventResources';
import type { StatusTone } from '@/components/ui';

function phaseOf(c: Campaign, today: string): { tone: StatusTone; label: string } {
  if (c.endDate < today) return { tone: 'neutral', label: 'Finalizada' };
  if (c.startDate > today) return { tone: 'info', label: 'Próxima' };
  return { tone: 'success', label: 'En curso' };
}

export function CampaignsTab() {
  const eventId = Number(useParams().id);
  const { query, add, remove } = useCampaigns(eventId);
  const today = addDays(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', startDate: addDays(0), endDate: addDays(7) });

  const campaigns = query.data ?? [];

  const save = () => {
    if (!form.name) return;
    add.mutate(
      { name: form.name, startDate: form.startDate, endDate: form.endDate },
      { onSuccess: () => { setForm({ name: '', startDate: addDays(0), endDate: addDays(7) }); setOpen(false); } },
    );
  };

  return (
    <>
      <Card
        title="Campañas"
        icon="mdi-bullhorn"
        subtitle={`${campaigns.length} ${campaigns.length === 1 ? 'campaña de precios' : 'campañas de precios'}`}
        action={<Button icon="mdi-plus" onClick={() => setOpen(true)}>Crear Campaña</Button>}
      >
        <DataTable<Campaign>
          rows={campaigns}
          rowKey="id"
          emptyText="No hay campañas para mostrar."
          columns={[
            { key: 'name', header: 'Nombre', align: 'left', render: (r) => <strong>{r.name}</strong> },
            { key: 'start', header: 'Desde', render: (r) => formatDate(r.startDate) },
            { key: 'end', header: 'Hasta', render: (r) => formatDate(r.endDate) },
            { key: 'days', header: 'Días', render: (r) => <Chip tone="primary" label={String(r.days)} /> },
            { key: 'phase', header: 'Fase', render: (r) => { const p = phaseOf(r, today); return <StatusBadge tone={p.tone} label={p.label} />; } },
            { key: 'actions', header: 'Acciones', render: (r) => <IconButton label="Eliminar campaña" icon="mdi-delete" color="danger" size="small" onClick={() => remove.mutate(r.id)} /> },
          ]}
        />
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Crear Campaña"
        icon="mdi-bullhorn"
        actions={
          <>
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button icon="mdi-check" disabled={!form.name} loading={add.isPending} onClick={save}>Crear</Button>
          </>
        }
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField label="Nombre de la campaña" placeholder="p. ej. Preventa Temprana" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </Box>
          <TextField label="Fecha de inicio" type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
          <TextField label="Fecha de fin" type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
        </Box>
      </Dialog>
    </>
  );
}
