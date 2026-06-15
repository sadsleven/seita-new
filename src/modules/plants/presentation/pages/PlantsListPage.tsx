import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import {
  Alert,
  Avatar,
  Button,
  Card,
  DataTable,
  type DataTableColumn,
  Dialog,
  IconButton,
  StatusBadge,
  TextField,
} from '@/components/ui';
import type { Plant } from '../../domain/models/Plant';
import { usePlants } from '../hooks/usePlants';
import { PlantFormDialog } from '../components/PlantFormDialog';
import type { CreatePlantInput } from '../../domain/models/Plant';

function statusTone(status: string): 'success' | 'warning' | 'neutral' {
  if (status === 'Activa') return 'success';
  if (status === 'Prospecto') return 'warning';
  return 'neutral';
}

export function PlantsListPage() {
  const navigate = useNavigate();
  const { query, catalogsQuery, create, remove } = usePlants();

  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Plant | null>(null);

  const plants = query.data ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return plants;
    return plants.filter(
      (p) =>
        p.companyName.toLowerCase().includes(q) ||
        p.nickName.toLowerCase().includes(q) ||
        p.contact.toLowerCase().includes(q),
    );
  }, [plants, search]);

  const handleCreate = async (input: CreatePlantInput) => {
    await create.mutateAsync(input);
    setCreateOpen(false);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    await remove.mutateAsync(toDelete.id);
    setToDelete(null);
  };

  const columns: DataTableColumn<Plant>[] = [
    {
      key: 'companyName',
      header: 'Empresa',
      render: (row) => (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar name={row.companyName} size={38} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.3 }}>
              {row.companyName}
            </Typography>
            {row.nickName && (
              <Typography variant="caption" color="text.secondary">
                {row.nickName}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
    },
    {
      key: 'location',
      header: 'Ubicación',
      render: (row) => (
        <Typography sx={{ fontSize: '0.9375rem' }}>
          {row.city}
          {row.city && row.country ? ', ' : ''}
          {row.country}
        </Typography>
      ),
    },
    {
      key: 'industry',
      header: 'Industria',
    },
    {
      key: 'contact',
      header: 'Contacto',
      render: (row) => (
        <Box>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600 }}>{row.contact}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      render: (row) => (
        <StatusBadge label={row.status.toUpperCase()} tone={statusTone(row.status)} />
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'center',
      render: (row) => (
        <IconButton
          icon="mdi-delete-outline"
          label="Eliminar planta"
          color="danger"
          size="small"
          tooltip
          onClick={(e) => {
            e.stopPropagation();
            setToDelete(row);
          }}
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

  if (query.isError) {
    return (
      <Alert severity="error" title="No se pudo cargar el directorio">
        Intenta recargar la página.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1" component="h1">
          Plantas
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Directorio de empresas papeleras registradas en SEITA.
        </Typography>
      </Box>

      <Card
        title="Directorio de plantas"
        icon="mdi-factory"
        subtitle={`${plants.length} empresa${plants.length !== 1 ? 's' : ''} registrada${plants.length !== 1 ? 's' : ''}`}
        action={
          <Button icon="mdi-plus" onClick={() => setCreateOpen(true)}>
            Crear planta
          </Button>
        }
      >
        <Stack spacing={2}>
          <TextField
            icon="mdi-magnify"
            placeholder="Buscar por empresa, apodo o contacto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <DataTable<Plant>
            columns={columns}
            rows={filtered}
            rowKey="id"
            emptyText={
              search
                ? 'No hay plantas que coincidan con la búsqueda.'
                : 'No hay plantas registradas.'
            }
            onRowClick={(row) => navigate(`/plantas/${row.id}`)}
          />
        </Stack>
      </Card>

      <PlantFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        catalogs={catalogsQuery.data}
        busy={create.isPending}
      />

      <Dialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="¿Eliminar esta planta?"
        icon="mdi-alert-outline"
        actions={
          <>
            <Button variant="outlined" onClick={() => setToDelete(null)}>
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
          ¿Quitar <strong>{toDelete?.companyName}</strong> del directorio? Esta acción no se puede
          deshacer.
        </Typography>
      </Dialog>
    </Stack>
  );
}
