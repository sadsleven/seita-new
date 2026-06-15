import { useState } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import {
  Alert,
  Button,
  Card,
  DataTable,
  Dialog,
  IconButton,
  TextField,
  type DataTableColumn,
} from '@/components/ui';
import { useProductTypes } from '../hooks/useProductTypes';
import type { ProductType } from '../../domain/models/ProductType';

export function ProductTypesPage() {
  const { query, create, remove } = useProductTypes();

  // Inline add row state
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<ProductType | null>(null);

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) {
      setNameError('El nombre es obligatorio.');
      return;
    }
    setNameError('');
    create.mutate(trimmed, {
      onSuccess: () => setNewName(''),
    });
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

      {/* Inline add row + table */}
      <Card
        title="Catálogo"
        icon="mdi-tag-multiple-outline"
      >
        {/* Add row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Nombre del tipo de producto"
              placeholder="Ej. Patrocinio Platino"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (nameError) setNameError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              error={!!nameError}
              helperText={nameError || undefined}
              icon="mdi-tag-outline"
            />
          </Box>
          <Box sx={{ pt: nameError ? 0 : 3.75 }}>
            <Button
              icon="mdi-plus"
              onClick={handleAdd}
              loading={create.isPending}
            >
              Agregar tipo de producto
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <DataTable<ProductType>
          columns={columns}
          rows={query.data}
          rowKey="id"
          emptyText="No hay tipos de producto registrados."
        />
      </Card>

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
