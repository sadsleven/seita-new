import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Button, Card, Checkbox, DataTable, Dialog, IconButton, Select, StatusBadge, TextField, Chip } from '@/components/ui';
import { formatCurrency } from '@/lib';
import { useRegistrations } from '../../hooks/useEventCommerce';
import { useEventStats } from '../../hooks/useEvents';
import { CATEGORIES, REG_TYPES, REG_TYPE_TONE } from '../../constants';
import type { Registration, RegistrationType } from '../../../domain/models/EventResources';

const TYPE_LABEL = Object.fromEntries(REG_TYPES.map((t) => [t.value, t.label]));
const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

const blankForm = {
  plant: '',
  contact: '',
  type: 'Attendee' as RegistrationType,
  spouse: false,
  nights: 3,
  category: 'Paper',
  amount: 1200,
};

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-1)', p: '14px 16px' }}>
      <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ fontSize: 28, fontWeight: 900 }}>{value}</Typography>
    </Box>
  );
}

export function RegistrationTab() {
  const eventId = Number(useParams().id);
  const { query, plants, add, remove } = useRegistrations(eventId);
  const { data: stats } = useEventStats(eventId);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankForm);

  const orders = query.data ?? [];
  const plantList = plants.data ?? [];

  const pickPlant = (name: string) => {
    const p = plantList.find((x) => x.companyName === name);
    setForm((f) => ({
      ...f,
      plant: name,
      contact: p ? p.contact : f.contact,
      category: p ? (p.industry === 'Empaque' ? 'Corr' : 'Paper') : f.category,
    }));
  };

  const save = () => {
    if (!form.plant) return;
    add.mutate(
      {
        plant: form.plant,
        contact: form.contact,
        type: form.type,
        typeLabel: TYPE_LABEL[form.type],
        spouse: form.spouse,
        nights: Number(form.nights),
        amount: Number(form.amount),
        category: form.category,
        categoryLabel: CAT_LABEL[form.category],
      },
      {
        onSuccess: () => {
          setForm(blankForm);
          setOpen(false);
        },
      },
    );
  };

  return (
    <>
      <Box sx={{ display: 'grid', gap: 1.75, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' }, mb: 2.5 }}>
        <MiniStat label="Total inscripciones" value={stats?.totalOrders ?? 0} />
        <MiniStat label="Asistentes" value={stats?.attendees ?? 0} />
        <MiniStat label="Acompañantes" value={stats?.spouses ?? 0} />
        <MiniStat label="Pres. Técnicas" value={stats?.presentations ?? 0} />
        <MiniStat label="Mesas" value={stats?.tableTops ?? 0} />
      </Box>

      <Card
        title="Inscripciones"
        icon="mdi-account-multiple"
        subtitle={`${orders.length} ${orders.length === 1 ? 'inscripción' : 'inscripciones'}`}
        action={
          <Button icon="mdi-account-plus" onClick={() => setOpen(true)}>
            Agregar Inscripción
          </Button>
        }
      >
        <DataTable<Registration>
          rows={orders}
          rowKey="id"
          emptyText="Aún no hay inscripciones — agrega el primer asistente."
          columns={[
            { key: 'plant', header: 'Empresa', align: 'left', render: (r) => <strong>{r.plant}</strong> },
            { key: 'contact', header: 'Contacto', align: 'left' },
            {
              key: 'type',
              header: 'Tipo',
              render: (r) => <StatusBadge tone={REG_TYPE_TONE[r.type]} label={r.typeLabel} />,
            },
            {
              key: 'spouse',
              header: 'Acomp.',
              render: (r) =>
                r.spouse ? (
                  <span className="mdi mdi-check-circle" style={{ color: 'var(--success-500)', fontSize: '1.3rem' }} />
                ) : (
                  <Box component="span" sx={{ color: 'var(--neutral-300)' }}>—</Box>
                ),
            },
            { key: 'nights', header: 'Noches' },
            { key: 'category', header: 'Línea', render: (r) => <Chip tone="success" variant="outlined" label={r.categoryLabel} /> },
            { key: 'amount', header: 'Monto', render: (r) => formatCurrency(r.amount) },
            {
              key: 'actions',
              header: '',
              render: (r) => <IconButton label="Quitar inscripción" icon="mdi-delete" color="danger" size="small" onClick={() => remove.mutate(r.id)} />,
            },
          ]}
        />
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Agregar Inscripción"
        icon="mdi-account-plus"
        maxWidth="md"
        actions={
          <>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button icon="mdi-check" disabled={!form.plant} loading={add.isPending} onClick={save}>
              Guardar Inscripción
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Select
            label="Empresa (planta)"
            placeholder="Elige una empresa"
            value={form.plant}
            onChange={pickPlant}
            options={plantList.map((p) => ({ value: p.companyName, label: p.companyName }))}
          />
          <TextField label="Nombre del contacto" placeholder="Nombre completo del asistente" value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} />
          <Select label="Tipo de inscripción" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v as RegistrationType }))} options={REG_TYPES} />
          <Select label="Línea de producto" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} options={CATEGORIES} />
          <TextField label="Noches de hotel" type="number" value={form.nights} onChange={(e) => setForm((f) => ({ ...f, nights: Number(e.target.value) }))} />
          <TextField label="Monto (USD)" type="number" icon="mdi-currency-usd" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))} />
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Checkbox label="Asiste con acompañante" color="success" checked={form.spouse} onChange={(e) => setForm((f) => ({ ...f, spouse: e.target.checked }))} />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
