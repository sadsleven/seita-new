import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { Avatar, Button, Card, DataTable, Dialog, IconButton, Select, StatusBadge, TextField } from '@/components/ui';
import { useVendors } from '../../hooks/useEventLogistics';
import { VendorEvaluationDialog } from '../../components/VendorEvaluationDialog';
import { COUNTRIES, EVAL_LABEL, EVAL_TONE } from '../../constants';
import type { Vendor } from '../../../domain/models/Logistics';

const blankForm = { company: '', nick: '', country: '', industry: '', subtypes: '' };

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-1)', p: '14px 18px' }}>
      <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ fontSize: 28, fontWeight: 900 }}>{value}</Typography>
    </Box>
  );
}

export function VendorsTab() {
  const eventId = Number(useParams().id);
  const { query, add, remove, evaluate } = useVendors(eventId);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [evalVendor, setEvalVendor] = useState<Vendor | null>(null);

  const vendors = query.data ?? [];
  const evaluated = vendors.filter((v) => v.evaluation !== 'No Evaluation').length;

  const save = () => {
    if (!form.company) return;
    add.mutate(form, { onSuccess: () => { setForm(blankForm); setAddOpen(false); } });
  };

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.75, mb: 2.25 }}>
        <MiniStat label="Total proveedores" value={vendors.length} />
        <MiniStat label="Evaluados" value={evaluated} />
        <MiniStat label="Pendientes" value={vendors.length - evaluated} />
      </Box>

      <Card
        title="Proveedores"
        icon="mdi-truck"
        subtitle={`${vendors.length} ${vendors.length === 1 ? 'proveedor asignado' : 'proveedores asignados'}`}
        action={<Button size="sm" icon="mdi-plus" onClick={() => { setForm(blankForm); setAddOpen(true); }}>Asignar Proveedor</Button>}
      >
        <DataTable<Vendor>
          rows={vendors}
          rowKey="id"
          emptyText="No hay proveedores asignados."
          columns={[
            {
              key: 'company',
              header: 'Empresa',
              align: 'left',
              render: (r) => (
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar name={r.company} size={34} />
                  <strong>{r.company}</strong>
                </Stack>
              ),
            },
            { key: 'nick', header: 'Apodo', align: 'left' },
            { key: 'country', header: 'País' },
            { key: 'industry', header: 'Industria', align: 'left' },
            { key: 'subtypes', header: 'Sub-tipos', align: 'left' },
            { key: 'evaluation', header: 'Evaluación', render: (r) => <StatusBadge tone={EVAL_TONE[r.evaluation]} label={EVAL_LABEL[r.evaluation]} /> },
            {
              key: 'actions',
              header: 'Acciones',
              render: (r) => (
                <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
                  <IconButton
                    label={r.evaluation === 'No Evaluation' ? 'Agregar evaluación' : 'Ver o editar evaluación'}
                    icon="mdi-file-document-edit-outline"
                    color="primary"
                    size="small"
                    onClick={() => setEvalVendor(r)}
                  />
                  <IconButton label="Eliminar proveedor" icon="mdi-delete" color="danger" size="small" onClick={() => remove.mutate(r.id)} />
                </Box>
              ),
            },
          ]}
        />
      </Card>

      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Asignar Proveedor"
        icon="mdi-truck"
        maxWidth="md"
        actions={
          <>
            <Button variant="outlined" onClick={() => setAddOpen(false)}>Cancelar</Button>
            <Button icon="mdi-check" disabled={!form.company} loading={add.isPending} onClick={save}>Asignar</Button>
          </>
        }
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField label="Empresa" placeholder="Nombre del proveedor" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} required />
          </Box>
          <TextField label="Apodo" value={form.nick} onChange={(e) => setForm((f) => ({ ...f, nick: e.target.value }))} />
          <Select label="País" placeholder="Elige un país" value={form.country} onChange={(v) => setForm((f) => ({ ...f, country: v }))} options={COUNTRIES.map((c) => ({ value: c, label: c }))} />
          <TextField label="Industria" placeholder="p. ej. Audiovisual" value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} />
          <TextField label="Sub-tipos" placeholder="Separados por coma" value={form.subtypes} onChange={(e) => setForm((f) => ({ ...f, subtypes: e.target.value }))} />
        </Box>
      </Dialog>

      <VendorEvaluationDialog
        vendor={evalVendor}
        onClose={() => setEvalVendor(null)}
        saving={evaluate.isPending}
        onSave={(id, evaluation, observation) =>
          evaluate.mutate({ id, evaluation, observation }, { onSuccess: () => setEvalVendor(null) })
        }
      />
    </>
  );
}
