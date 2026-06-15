import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import {
  Alert,
  Button,
  Card,
  DataTable,
  Dialog,
  IconButton,
  Tabs,
  TextField,
} from '@/components/ui';
import { useCatalogsStore } from '../../domain/catalogsStore';
import type { CatalogName, CatalogItem } from '../../domain/models/CatalogItem';
import { useCatalog } from '../hooks/useCatalog';

/* ── Tab config ────────────────────────────────────────────────────────────── */
const TAB_ITEMS = [
  { value: 'countries' as CatalogName, label: 'Países', icon: 'mdi-earth' },
  { value: 'industries' as CatalogName, label: 'Industrias', icon: 'mdi-factory' },
  { value: 'plantTypes' as CatalogName, label: 'Tipos de planta', icon: 'mdi-domain' },
  { value: 'sources' as CatalogName, label: 'Fuentes', icon: 'mdi-source-branch' },
  { value: 'associations' as CatalogName, label: 'Asociaciones', icon: 'mdi-account-group-outline' },
];

/* ── Per-catalog schema & column config ────────────────────────────────────── */
const schemas = {
  countries: z.object({
    name: z.string().min(1, 'El nombre es requerido.'),
    code: z.string().optional(),
  }),
  industries: z.object({
    name: z.string().min(1, 'El nombre es requerido.'),
    subs: z.string().optional(),
  }),
  plantTypes: z.object({
    name: z.string().min(1, 'El nombre es requerido.'),
  }),
  sources: z.object({
    name: z.string().min(1, 'El nombre es requerido.'),
  }),
  associations: z.object({
    name: z.string().min(1, 'El nombre es requerido.'),
    country: z.string().optional(),
  }),
} satisfies Record<CatalogName, z.ZodTypeAny>;

type FormValues = {
  name: string;
  code?: string;
  subs?: string;
  country?: string;
};

/* ── Inner catalog section (memoised per active catalog) ───────────────────── */
function CatalogSection({ catalogName }: { catalogName: CatalogName }) {
  const { query, create, remove } = useCatalog(catalogName);
  const [addOpen, setAddOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schemas[catalogName]),
    defaultValues: { name: '', code: '', subs: '', country: '' },
  });

  const openAdd = () => {
    reset({ name: '', code: '', subs: '', country: '' });
    setAddOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    const payload: FormValues = { name: values.name.trim() };
    if (catalogName === 'countries' && values.code) payload.code = values.code.trim();
    if (catalogName === 'industries' && values.subs) payload.subs = values.subs.trim();
    if (catalogName === 'associations' && values.country) payload.country = values.country.trim();
    await create.mutateAsync(payload);
    setAddOpen(false);
  };

  const confirmDelete = async () => {
    if (confirmId === null) return;
    await remove.mutateAsync(confirmId);
    setConfirmId(null);
  };

  /* -- Columns by catalog -------------------------------------------------- */
  type Row = CatalogItem;

  const deleteCol = {
    key: 'actions',
    header: '',
    align: 'center' as const,
    render: (row: Row) => (
      <IconButton
        icon="mdi-delete-outline"
        label="Eliminar registro"
        color="danger"
        size="small"
        tooltip
        onClick={() => setConfirmId(row['id'] as number)}
      />
    ),
  };

  const columnsByName: Record<CatalogName, { key: string; header: string; align?: 'left' | 'center' | 'right' }[]> = {
    countries: [
      { key: 'name', header: 'Nombre', align: 'left' },
      { key: 'code', header: 'Código', align: 'center' },
    ],
    industries: [
      { key: 'name', header: 'Nombre', align: 'left' },
      { key: 'subs', header: 'Subtipos', align: 'left' },
    ],
    plantTypes: [{ key: 'name', header: 'Nombre', align: 'left' }],
    sources: [{ key: 'name', header: 'Nombre', align: 'left' }],
    associations: [
      { key: 'name', header: 'Nombre', align: 'left' },
      { key: 'country', header: 'País', align: 'left' },
    ],
  };

  const columns = [...columnsByName[catalogName], deleteCol];

  const tabLabel = TAB_ITEMS.find((t) => t.value === catalogName)?.label ?? catalogName;

  /* -- Loading / error states ---------------------------------------------- */
  if (query.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (query.isError) {
    return (
      <Alert severity="error" title="Error al cargar el catálogo">
        No se pudieron obtener los registros. Intenta recargar la página.
      </Alert>
    );
  }

  const rows = (query.data ?? []) as Row[];

  return (
    <>
      <Card
        title={tabLabel}
        icon={TAB_ITEMS.find((t) => t.value === catalogName)?.icon}
        action={
          <Button icon="mdi-plus" size="sm" onClick={openAdd} loading={create.isPending}>
            Agregar
          </Button>
        }
      >
        <DataTable<Row>
          columns={columns}
          rows={rows}
          rowKey="id"
          emptyText={`No hay ${tabLabel.toLowerCase()} registradas.`}
        />
      </Card>

      {/* ── Add dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={`Agregar ${tabLabel.toLowerCase()}`}
        icon={TAB_ITEMS.find((t) => t.value === catalogName)?.icon}
        maxWidth="xs"
        actions={
          <>
            <Button variant="outlined" color="secondary" onClick={() => setAddOpen(false)}>
              Cancelar
            </Button>
            <Button
              icon="mdi-check"
              loading={isSubmitting || create.isPending}
              onClick={() => void handleSubmit(onSubmit)()}
            >
              Agregar
            </Button>
          </>
        }
      >
        <Box component="form" onSubmit={(e) => { e.preventDefault(); void handleSubmit(onSubmit)(); }} noValidate>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <TextField
              label="Nombre"
              required
              error={!!errors.name}
              helperText={errors.name?.message}
              placeholder="Ingresa el nombre"
              {...register('name')}
            />

            {catalogName === 'countries' && (
              <TextField
                label="Código (ISO)"
                placeholder="Ej. MX, US, BR"
                error={!!errors.code}
                helperText={errors.code?.message}
                {...register('code')}
              />
            )}

            {catalogName === 'industries' && (
              <TextField
                label="Subtipos (separados por coma)"
                placeholder="Ej. Imprenta, Kraft"
                error={!!errors.subs}
                helperText={errors.subs?.message}
                {...register('subs')}
              />
            )}

            {catalogName === 'associations' && (
              <TextField
                label="País"
                placeholder="Ej. México"
                error={!!errors.country}
                helperText={errors.country?.message}
                {...register('country')}
              />
            )}
          </Stack>
        </Box>
      </Dialog>

      {/* ── Delete confirm dialog ───────────────────────────────────────── */}
      <Dialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Confirmar eliminación"
        icon="mdi-alert-outline"
        maxWidth="xs"
        actions={
          <>
            <Button variant="outlined" color="secondary" onClick={() => setConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              icon="mdi-delete"
              loading={remove.isPending}
              onClick={() => void confirmDelete()}
            >
              Eliminar
            </Button>
          </>
        }
      >
        <Typography>Esta acción no se puede deshacer.</Typography>
      </Dialog>
    </>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export function CatalogsPage() {
  const { activeCatalog, setActiveCatalog } = useCatalogsStore();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1" component="h1">
          Catálogos
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Administra los valores reutilizables del sistema: países, industrias, tipos, fuentes y
          asociaciones.
        </Typography>
      </Box>

      <Tabs
        value={activeCatalog}
        onChange={(v) => setActiveCatalog(v as CatalogName)}
        items={TAB_ITEMS}
      />

      <CatalogSection key={activeCatalog} catalogName={activeCatalog} />
    </Stack>
  );
}
