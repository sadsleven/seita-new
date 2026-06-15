import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { Button, Card, Chip, DataTable, Dialog, IconButton, StatusBadge, Switch, TextField } from '@/components/ui';
import { usePackages } from '../../hooks/useEventCommerce';
import { PACKAGE_VALIDATION } from '../../constants';
import type { EventPackage } from '../../../domain/models/EventResources';

const blankForm = { name: '', products: 1, discountRate: 10, status: true };

export function PackagesTab() {
  const eventId = Number(useParams().id);
  const { query, add, remove } = usePackages(eventId);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankForm);

  const packages = query.data ?? [];

  const save = () => {
    if (!form.name) return;
    add.mutate(
      { name: form.name, products: Number(form.products), discountRate: Number(form.discountRate), status: form.status },
      { onSuccess: () => { setForm(blankForm); setOpen(false); } },
    );
  };

  return (
    <>
      <Card
        title="Paquetes"
        icon="mdi-package-variant"
        subtitle={`${packages.length} ${packages.length === 1 ? 'paquete' : 'paquetes'}`}
        action={<Button icon="mdi-plus" onClick={() => setOpen(true)}>Crear Paquete</Button>}
      >
        <DataTable<EventPackage>
          rows={packages}
          rowKey="id"
          emptyText="Ingresa un paquete."
          columns={[
            { key: 'name', header: 'Nombre', align: 'left', render: (r) => <strong>{r.name}</strong> },
            {
              key: 'products',
              header: 'Productos',
              render: (r) => (
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <strong>{r.products}</strong>
                  <StatusBadge tone={PACKAGE_VALIDATION[r.validation].tone} label={PACKAGE_VALIDATION[r.validation].label} dot={false} />
                </Stack>
              ),
            },
            { key: 'discountRate', header: 'Descuento', render: (r) => <Chip tone="primary" label={`${r.discountRate}%`} /> },
            { key: 'status', header: 'Estado', render: (r) => <StatusBadge tone={r.status ? 'success' : 'neutral'} label={r.status ? 'ACTIVO' : 'INACTIVO'} /> },
            { key: 'actions', header: 'Acciones', render: (r) => <IconButton label="Eliminar paquete" icon="mdi-delete" color="danger" size="small" onClick={() => remove.mutate(r.id)} /> },
          ]}
        />
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Crear Paquete"
        icon="mdi-package-variant"
        actions={
          <>
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button icon="mdi-check" disabled={!form.name} loading={add.isPending} onClick={save}>Crear</Button>
          </>
        }
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField label="Nombre del paquete" placeholder="p. ej. Paquete Expositor" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </Box>
          <TextField label="N.º de productos" type="number" value={form.products} onChange={(e) => setForm((f) => ({ ...f, products: Number(e.target.value) }))} />
          <TextField label="Descuento (%)" type="number" value={form.discountRate} onChange={(e) => setForm((f) => ({ ...f, discountRate: Number(e.target.value) }))} />
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Switch label="Paquete activo" checked={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked }))} />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
