import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Chip,
  DataTable,
  type DataTableColumn,
  Dialog,
  IconButton,
  StatusBadge,
  Tabs,
  TextField,
} from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib';
import type { Contact, CreateContactInput } from '../../domain/models/Contact';
import type { EventHistoryEntry } from '../../domain/models/EventHistoryEntry';
import { usePlant } from '../hooks/usePlant';

/* ── Contact form schema ───────────────────────────────────────────────── */
const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio.'),
  position: z.string().optional(),
  email: z.string().email('Correo no válido.').or(z.literal('')).optional(),
  phone: z.string().optional(),
});
type ContactFormValues = z.infer<typeof contactSchema>;

/* ── Small helper for labeled detail fields ────────────────────────────── */
function Field({ label, value, link }: { label: string; value?: string; link?: boolean }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'text.secondary',
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      {link && value ? (
        <Typography
          component="a"
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noreferrer"
          sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'primary.main' }}
        >
          {value}
        </Typography>
      ) : (
        <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>{value || '—'}</Typography>
      )}
    </Box>
  );
}

function statusTone(status: string): 'success' | 'warning' | 'neutral' {
  if (status === 'Activa') return 'success';
  if (status === 'Prospecto') return 'warning';
  return 'neutral';
}

const PARTICIPATION_LABELS: Record<string, string> = {
  Attendee: 'Asistente',
  'Technical Presentation': 'Pres. Técnica',
  'Table Top': 'Mesa de trabajo',
  Other: 'Otro',
};

/* ── Page ──────────────────────────────────────────────────────────────── */
export function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const plantId = Number(id);
  const navigate = useNavigate();

  const { plantQuery, contactsQuery, historyQuery, addContact, deleteContact, duplicate, remove } =
    usePlant(plantId);

  const [tab, setTab] = useState('contacts');
  const [seeMore, setSeeMore] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const [deleteContactTarget, setDeleteContactTarget] = useState<Contact | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', position: '', email: '', phone: '' },
  });

  /* ── Loading / error states ── */
  if (plantQuery.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (plantQuery.isError || !plantQuery.data) {
    return (
      <Alert severity="error" title="No se pudo cargar la planta">
        Verifica que la URL sea correcta o vuelve al directorio.
      </Alert>
    );
  }

  const plant = plantQuery.data;
  const contacts = contactsQuery.data ?? [];
  const history = historyQuery.data ?? [];

  /* ── Handlers ── */
  const handleAddContact = async (values: ContactFormValues) => {
    const input: CreateContactInput = {
      name: values.name,
      position: values.position,
      email: values.email,
      phone: values.phone,
    };
    await addContact.mutateAsync(input);
    reset();
    setContactOpen(false);
  };

  const handleDelete = async () => {
    await remove.mutateAsync();
    navigate('/plantas');
  };

  const handleDuplicate = async () => {
    const copy = await duplicate.mutateAsync();
    setConfirmDuplicate(false);
    navigate(`/plantas/${copy.id}`);
  };

  const handleDeleteContact = async () => {
    if (!deleteContactTarget) return;
    await deleteContact.mutateAsync(deleteContactTarget.id);
    setDeleteContactTarget(null);
  };

  /* ── Contact table columns ── */
  const contactColumns: DataTableColumn<Contact>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25 }}>
          <Avatar name={row.name} size={34} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>{row.name}</Typography>
          {row.main && <Chip label="Principal" tone="primary" variant="soft" />}
        </Box>
      ),
    },
    { key: 'position', header: 'Cargo' },
    { key: 'email', header: 'Correo' },
    { key: 'phone', header: 'Teléfono' },
    {
      key: 'actions',
      header: '',
      align: 'center',
      render: (row) => (
        <IconButton
          icon="mdi-delete-outline"
          label="Quitar contacto"
          color="danger"
          size="small"
          tooltip
          onClick={() => setDeleteContactTarget(row)}
        />
      ),
    },
  ];

  /* ── History table columns ── */
  const historyColumns: DataTableColumn<EventHistoryEntry>[] = [
    {
      key: 'event',
      header: 'Evento',
      render: (row) => (
        <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>{row.event}</Typography>
      ),
    },
    {
      key: 'date',
      header: 'Fecha',
      align: 'center',
      render: (row) => formatDate(row.date),
    },
    {
      key: 'type',
      header: 'Participación',
      align: 'center',
      render: (row) => (
        <StatusBadge
          label={PARTICIPATION_LABELS[row.type] ?? row.type}
          tone="info"
        />
      ),
    },
    {
      key: 'amount',
      header: 'Monto',
      align: 'right',
      render: (row) => formatCurrency(row.amount),
    },
  ];

  /* ── Render ── */
  return (
    <Stack spacing={3}>
      {/* Back link */}
      <Box>
        <Button
          variant="text"
          icon="mdi-arrow-left"
          onClick={() => navigate('/plantas')}
          sx={{ pl: 0 }}
        >
          Volver a Plantas
        </Button>
      </Box>

      {/* Header card */}
      <Card padding={3}>
        <Stack spacing={2.5}>
          {/* Top row: avatar + name + actions */}
          <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <Avatar name={plant.companyName} size={64} />
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h2" component="h1">
                  {plant.companyName}
                </Typography>
                <StatusBadge
                  label={plant.status.toUpperCase()}
                  tone={statusTone(plant.status)}
                />
              </Box>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {plant.nickName}
                {plant.nickName && plant.type ? ' · ' : ''}
                {plant.type}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.25 }}>
                {plant.industry && <Chip label={plant.industry} tone="primary" variant="soft" />}
                {plant.subIndustry && (
                  <Chip label={plant.subIndustry} tone="info" variant="outlined" />
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
              <Button
                variant="outlined"
                icon="mdi-content-copy"
                size="sm"
                onClick={() => setConfirmDuplicate(true)}
              >
                Duplicar
              </Button>
              <Button
                variant="outlined"
                color="danger"
                icon="mdi-delete-outline"
                size="sm"
                onClick={() => setConfirmDelete(true)}
              >
                Eliminar
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* Basic info grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 2.5,
            }}
          >
            <Field
              label="País / Ciudad"
              value={`${plant.country}${plant.city ? ', ' + plant.city : ''}`}
            />
            <Field label="Contacto principal" value={plant.contact} />
            <Field label="Correo" value={plant.email} />
            <Field label="Teléfono" value={plant.phone} />
            {seeMore && <Field label="TAX ID" value={plant.taxId} />}
            {seeMore && <Field label="Nombre de factura" value={plant.invoiceName} />}
            {seeMore && <Field label="Fuente" value={plant.source} />}
            {seeMore && <Field label="Asociación" value={plant.association} />}
            {seeMore && <Field label="Sitio web" value={plant.web} link />}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="text"
              trailingIcon={seeMore ? 'mdi-chevron-up' : 'mdi-chevron-down'}
              onClick={() => setSeeMore((v) => !v)}
              size="sm"
            >
              {seeMore ? 'Ver menos' : 'Ver más'}
            </Button>
          </Box>
        </Stack>
      </Card>

      {/* Tabs */}
      <Box>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            {
              value: 'contacts',
              label: `Contactos (${contacts.length})`,
              icon: 'mdi-account-multiple',
            },
            {
              value: 'history',
              label: `Historial de eventos (${history.length})`,
              icon: 'mdi-history',
            },
          ]}
        />
      </Box>

      {/* Tab content */}
      {tab === 'contacts' && (
        <Card
          title="Contactos"
          icon="mdi-account-multiple"
          action={
            <Button icon="mdi-account-plus" size="sm" onClick={() => setContactOpen(true)}>
              Agregar contacto
            </Button>
          }
        >
          {contactsQuery.isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <DataTable<Contact>
              columns={contactColumns}
              rows={contacts}
              rowKey="id"
              emptyText="Esta planta no tiene contactos registrados."
            />
          )}
        </Card>
      )}

      {tab === 'history' && (
        <Card title="Historial de eventos" icon="mdi-history">
          {historyQuery.isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <DataTable<EventHistoryEntry>
              columns={historyColumns}
              rows={history}
              rowKey="id"
              emptyText="Esta planta aún no participa en eventos."
            />
          )}
        </Card>
      )}

      {/* Add contact dialog */}
      <Dialog
        open={contactOpen}
        onClose={() => {
          reset();
          setContactOpen(false);
        }}
        title="Agregar contacto"
        icon="mdi-account-plus"
        maxWidth="sm"
        actions={
          <>
            <Button
              variant="outlined"
              onClick={() => {
                reset();
                setContactOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              icon="mdi-check"
              loading={isSubmitting || addContact.isPending}
              onClick={() => void handleSubmit(handleAddContact)()}
            >
              Guardar
            </Button>
          </>
        }
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(handleAddContact)}
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, pt: 1 }}
        >
          <TextField
            label="Nombre"
            required
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField
            label="Cargo / Puesto"
            error={!!errors.position}
            helperText={errors.position?.message}
            {...register('position')}
          />
          <TextField
            label="Correo electrónico"
            type="email"
            icon="mdi-email-outline"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <TextField
            label="Teléfono"
            icon="mdi-phone"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register('phone')}
          />
          <Box sx={{ display: 'none' }}>
            <button type="submit" aria-hidden tabIndex={-1} />
          </Box>
        </Box>
      </Dialog>

      {/* Delete contact confirm */}
      <Dialog
        open={!!deleteContactTarget}
        onClose={() => setDeleteContactTarget(null)}
        title="¿Quitar este contacto?"
        icon="mdi-account-remove"
        actions={
          <>
            <Button variant="outlined" onClick={() => setDeleteContactTarget(null)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              icon="mdi-delete-outline"
              loading={deleteContact.isPending}
              onClick={() => void handleDeleteContact()}
            >
              Quitar
            </Button>
          </>
        }
      >
        <Typography>
          ¿Quitar a <strong>{deleteContactTarget?.name}</strong> de los contactos de{' '}
          <strong>{plant.companyName}</strong>?
        </Typography>
      </Dialog>

      {/* Delete plant confirm */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="¿Eliminar esta planta?"
        icon="mdi-alert-outline"
        actions={
          <>
            <Button variant="outlined" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              icon="mdi-delete-outline"
              loading={remove.isPending}
              onClick={() => void handleDelete()}
            >
              Eliminar
            </Button>
          </>
        }
      >
        <Typography>
          ¿Eliminar <strong>{plant.companyName}</strong> del directorio? Esta acción no se puede
          deshacer.
        </Typography>
      </Dialog>

      {/* Duplicate confirm */}
      <Dialog
        open={confirmDuplicate}
        onClose={() => setConfirmDuplicate(false)}
        title="¿Duplicar esta planta?"
        icon="mdi-content-copy"
        actions={
          <>
            <Button variant="outlined" onClick={() => setConfirmDuplicate(false)}>
              Cancelar
            </Button>
            <Button
              icon="mdi-check"
              loading={duplicate.isPending}
              onClick={() => void handleDuplicate()}
            >
              Duplicar
            </Button>
          </>
        }
      >
        <Typography>
          Se creará una copia de <strong>{plant.companyName}</strong> como prospecto, que podrás
          editar por separado.
        </Typography>
      </Dialog>
    </Stack>
  );
}
