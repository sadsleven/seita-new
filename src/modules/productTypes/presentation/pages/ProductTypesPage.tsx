import { useState } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Chip,
  DataTable,
  Dialog,
  IconButton,
  TextField,
  type DataTableColumn,
} from '@/components/ui';
import { PLANT_TYPES } from '@/lib';
import { useProductTypes } from '../hooks/useProductTypes';
import type { ProductType } from '../../domain/models/ProductType';

const EMPTY_FORM = { name: '', description: '', availableFor: [] as string[] };

export function ProductTypesPage() {
  const { query, create, remove } = useProductTypes();

  // Add dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [nameError, setNameError] = useState('');

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<ProductType | null>(null);

  function openAdd() {
    setForm(EMPTY_FORM);
    setNameError('');
    setAddOpen(true);
  }

  function toggleAvailable(name: string) {
    setForm((f) => ({
      ...f,
      availableFor: f.availableFor.includes(name)
        ? f.availableFor.filter((n) => n !== name)
        : [...f.availableFor, name],
    }));
  }

  function handleAdd() {
    const trimmed = form.name.trim();
    if (!trimmed) {
      setNameError('El nombre es obligatorio.');
      return;
    }
    setNameError('');
    create.mutate(
      { name: trimmed, description: form.description, availableFor: form.availableFor },
      { onSuccess: () => setAddOpen(false) },
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    remove.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  const columns: DataTableColumn<ProductType>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.name}
        </Typography>
      ),
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.description || '—'}
        </Typography>
      ),
    },
    {
      key: 'availableFor',
      header: 'Disponible para',
      render: (row) =>
        row.availableFor.length ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {row.availableFor.map((t) => (
              <Chip key={t} label={t} tone="info" size="small" />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      align: 'center',
      render: (row) => (
        <IconButton
          icon="mdi-delete-outline"
          label="Eliminar tipo de producto"
          color="danger"
          tooltip
          onClick={() => setDeleteTarget(row)}
        />
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
      <Alert severity="error" title="No se pudo cargar el catálogo">
        Intenta recargar la página.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h1" component="h1">
          Tipos de Producto
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Catálogo global de tipos de producto disponibles en los eventos.
        </Typography>
      </Box>

      {/* Table */}
      <Card
        title="Catálogo"
        icon="mdi-tag-multiple-outline"
        action={
          <Button icon="mdi-plus" size="sm" onClick={openAdd} loading={create.isPending}>
            Agregar
          </Button>
        }
      >
        <DataTable<ProductType>
          columns={columns}
          rows={query.data}
          rowKey="id"
          emptyText="No hay tipos de producto registrados."
        />
      </Card>

      {/* Add dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Agregar tipo de producto"
        icon="mdi-tag-multiple-outline"
        maxWidth="sm"
        actions={
          <>
            <Button variant="outlined" color="secondary" onClick={() => setAddOpen(false)}>
              Cancelar
            </Button>
            <Button icon="mdi-check" loading={create.isPending} onClick={handleAdd}>
              Agregar
            </Button>
          </>
        }
      >
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <TextField
            label="Nombre"
            placeholder="Ej. ATTENDEES"
            value={form.name}
            onChange={(e) => {
              setForm((f) => ({ ...f, name: e.target.value }));
              if (nameError) setNameError('');
            }}
            error={!!nameError}
            helperText={nameError || undefined}
            icon="mdi-tag-outline"
            required
          />

          <TextField
            label="Descripción"
            placeholder="Ej. Standard description Attendees"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />

          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Disponible para</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5 }}>
              {PLANT_TYPES.map((t) => (
                <Checkbox
                  key={t}
                  label={t}
                  checked={form.availableFor.includes(t)}
                  onChange={() => toggleAvailable(t)}
                />
              ))}
            </Box>
          </Box>
        </Stack>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar tipo de producto"
        icon="mdi-delete-outline"
        maxWidth="xs"
        actions={
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={remove.isPending}
            >
              Cancelar
            </Button>
            <Button
              color="danger"
              loading={remove.isPending}
              icon="mdi-delete"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </>
        }
      >
        <Typography>
          ¿Estás seguro de que deseas eliminar{' '}
          <strong>"{deleteTarget?.name}"</strong>?
          Esta acción no se puede deshacer.
        </Typography>
      </Dialog>
    </Stack>
  );
}
