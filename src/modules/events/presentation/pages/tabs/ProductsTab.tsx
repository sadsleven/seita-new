import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { Button, Card, Checkbox, Chip, IconButton, TextField } from '@/components/ui';
import { formatCurrency } from '@/lib';
import { useEventProducts } from '../../hooks/useEventCommerce';

const AVAILABLE_FOR = ['Plantas', 'Patrocinadores', 'Acompañantes', 'Prensa'];

const blankForm = { name: '', price: 0, types: ['Plantas'], description: '' };

export function ProductsTab() {
  const eventId = Number(useParams().id);
  const { query, add, remove } = useEventProducts(eventId);
  const [form, setForm] = useState(blankForm);

  const products = query.data ?? [];

  const toggleType = (t: string) =>
    setForm((f) => ({ ...f, types: f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t] }));

  const save = () => {
    if (!form.name) return;
    add.mutate(
      { name: form.name, price: Number(form.price) || 0, types: form.types, description: form.description },
      { onSuccess: () => setForm(blankForm) },
    );
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(300px, 360px) 1fr' }, gap: 3, alignItems: 'start' }}>
      <Card title="Nuevo producto" icon="mdi-plus-box">
        <Stack spacing={2}>
          <TextField label="Nombre del producto" placeholder="p. ej. Stand 3x3" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <TextField label="Precio (USD)" type="number" icon="mdi-currency-usd" placeholder="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 0.75 }}>Disponible para</Typography>
            <Stack>
              {AVAILABLE_FOR.map((t) => (
                <Checkbox key={t} label={t} checked={form.types.includes(t)} onChange={() => toggleType(t)} />
              ))}
            </Stack>
          </Box>
          <TextField label="Descripción" placeholder="Breve descripción" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} multiline minRows={2} />
          <Button icon="mdi-check" fullWidth onClick={save} disabled={!form.name} loading={add.isPending}>
            Agregar Producto
          </Button>
        </Stack>
      </Card>

      <Box>
        <Box sx={{ mb: 1.75 }}>
          <Typography variant="h3" component="h2">
            Productos
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', fontWeight: 700 }}>
            {products.length} {products.length === 1 ? 'producto creado' : 'productos creados'}
          </Typography>
        </Box>

        {products.length === 0 ? (
          <Card>
            <Typography color="text.secondary">No hay productos para mostrar.</Typography>
          </Card>
        ) : (
          <Stack spacing={1.75}>
            {products.map((p) => (
              <Card key={p.id}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ width: 50, height: 50, flexShrink: 0, borderRadius: 'var(--radius-md)', bgcolor: 'brand.soft', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="mdi mdi-package-variant-closed" aria-hidden style={{ fontSize: '1.7rem', color: 'var(--primary-600)' }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1.5}>
                      <Typography variant="h4" component="h3">
                        {p.name}
                      </Typography>
                      <Typography sx={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--accent-teal)' }}>
                        {formatCurrency(p.price)}
                      </Typography>
                    </Stack>
                    {p.description && (
                      <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', my: 0.75 }}>{p.description}</Typography>
                    )}
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap alignItems="center">
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mr: 0.5 }}>
                        Disponible para:
                      </Typography>
                      {p.types.map((t) => (
                        <Chip key={t} tone="primary" variant="outlined" label={t} size="small" />
                      ))}
                    </Stack>
                  </Box>
                  <IconButton label="Eliminar producto" icon="mdi-delete" color="danger" size="small" onClick={() => remove.mutate(p.id)} />
                </Box>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
