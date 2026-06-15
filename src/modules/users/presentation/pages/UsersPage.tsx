import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Chip,
  DataTable,
  Dialog,
  IconButton,
  Select,
  StatusBadge,
  Switch,
  TextField,
  type DataTableColumn,
} from '@/components/ui';
import { useUsers } from '../hooks/useUsers';
import type { AdminUser, Role } from '../../domain/models/AdminUser';
import { fullName } from '../../domain/models/AdminUser';

/* ── Zod schema ──────────────────────────────────────────────────────────── */
const schema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio.'),
  lastName: z.string().min(1, 'El apellido es obligatorio.'),
  email: z.string().email('Ingresa un correo electrónico válido.').min(1, 'El correo es obligatorio.'),
  role: z.enum(['Administrador General', 'Gestor de Evento', 'Auditor'], {
    required_error: 'Selecciona un rol.',
  }),
});
type FormValues = z.infer<typeof schema>;

const ROLE_OPTIONS = [
  { value: 'Administrador General', label: 'Administrador General' },
  { value: 'Gestor de Evento', label: 'Gestor de Evento' },
  { value: 'Auditor', label: 'Auditor' },
] satisfies { value: Role; label: string }[];

/* ── Page ────────────────────────────────────────────────────────────────── */
export function UsersPage() {
  const { query, create, remove, setStatus } = useUsers();

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function openCreate() {
    reset();
    setCreateOpen(true);
  }

  function closeCreate() {
    setCreateOpen(false);
  }

  function onSubmit(values: FormValues) {
    create.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
      },
      { onSuccess: closeCreate },
    );
  }

  function handleToggleStatus(user: AdminUser) {
    setStatus.mutate({
      id: user.id,
      status: user.status === 'Activo' ? 'Inactivo' : 'Activo',
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    remove.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: 'usuario',
      header: 'Usuario',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar name={fullName(row)} />
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {fullName(row)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      align: 'center',
      render: (row) => <Chip label={row.role} tone="primary" />,
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      render: (row) => (
        <StatusBadge
          label={row.status.toUpperCase()}
          tone={row.status === 'Activo' ? 'success' : 'neutral'}
        />
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <Switch
            checked={row.status === 'Activo'}
            onChange={() => handleToggleStatus(row)}
            aria-label={row.status === 'Activo' ? 'Desactivar usuario' : 'Activar usuario'}
            disabled={setStatus.isPending}
          />
          <IconButton
            icon="mdi-delete-outline"
            label="Eliminar usuario"
            color="danger"
            tooltip
            onClick={() => setDeleteTarget(row)}
          />
        </Box>
      ),
    },
  ];

  if (query.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Alert severity="error" title="No se pudo cargar la lista de usuarios">
        Intenta recargar la página.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h1" component="h1">
            Usuarios
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Administra las cuentas y roles de los usuarios del sistema.
          </Typography>
        </Box>
        <Button icon="mdi-account-plus-outline" onClick={openCreate}>
          Crear usuario
        </Button>
      </Box>

      {/* Table */}
      <Card>
        <DataTable<AdminUser>
          columns={columns}
          rows={query.data}
          rowKey="id"
          emptyText="No hay usuarios registrados."
        />
      </Card>

      {/* Create dialog */}
      <Dialog
        open={createOpen}
        onClose={closeCreate}
        title="Crear usuario"
        icon="mdi-account-plus-outline"
        maxWidth="sm"
        actions={
          <>
            <Button variant="outlined" color="secondary" onClick={closeCreate} disabled={create.isPending}>
              Cancelar
            </Button>
            <Button
              form="create-user-form"
              type="submit"
              loading={create.isPending}
              icon="mdi-check"
            >
              Crear usuario
            </Button>
          </>
        }
      >
        <Box
          id="create-user-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label="Nombre"
              required
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName')}
            />
            <TextField
              label="Apellido"
              required
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register('lastName')}
            />
            <TextField
              label="Correo electrónico"
              type="email"
              required
              icon="mdi-email-outline"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />
            <Controller
              name="role"
              control={control}
              defaultValue={'' as Role}
              render={({ field }) => (
                <Select
                  label="Rol"
                  required
                  value={field.value}
                  onChange={(v) => field.onChange(v as Role)}
                  options={ROLE_OPTIONS}
                  placeholder="Selecciona un rol"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                />
              )}
            />
          </Stack>
        </Box>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar usuario"
        icon="mdi-delete-outline"
        maxWidth="xs"
        actions={
          <>
            <Button variant="outlined" color="secondary" onClick={() => setDeleteTarget(null)} disabled={remove.isPending}>
              Cancelar
            </Button>
            <Button color="danger" loading={remove.isPending} icon="mdi-delete" onClick={handleDelete}>
              Eliminar
            </Button>
          </>
        }
      >
        <Typography>
          ¿Estás seguro de que deseas eliminar a{' '}
          <strong>{deleteTarget ? fullName(deleteTarget) : ''}</strong>?
          Esta acción no se puede deshacer.
        </Typography>
      </Dialog>
    </Stack>
  );
}
