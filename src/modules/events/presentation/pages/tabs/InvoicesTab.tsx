import { useParams } from 'react-router-dom';
import { Box, Link, Stack, Typography } from '@mui/material';
import { Button, Card, DataTable, IconButton, StatusBadge, Tabs } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib';
import { useInvoices } from '../../hooks/useEventCommerce';
import { useEventsStore } from '../../../domain/eventsStore';
import type { Invoice } from '../../../domain/models/EventResources';

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-1)', p: '14px 18px' }}>
      <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ fontSize: 28, fontWeight: 900, color }}>{value}</Typography>
    </Box>
  );
}

export function InvoicesTab() {
  const eventId = Number(useParams().id);
  const { invoices, templates } = useInvoices(eventId);
  const tab = useEventsStore((s) => s.invoiceTab);
  const setTab = useEventsStore((s) => s.setInvoiceTab);

  const list = invoices.data ?? [];
  const totalPaid = list.filter((i) => i.status === 'Pagada').reduce((s, i) => s + i.amount, 0);
  const totalPending = list.filter((i) => i.status === 'Pendiente').reduce((s, i) => s + i.amount, 0);

  return (
    <Stack spacing={2.25}>
      <Box sx={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <Tabs
          value={tab}
          onChange={(v) => setTab(v as 'list' | 'templates')}
          items={[
            { value: 'list', label: 'Facturas', icon: 'mdi-file-document-outline' },
            { value: 'templates', label: 'Plantillas', icon: 'mdi-file-cog-outline' },
          ]}
        />
      </Box>

      {tab === 'list' ? (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.75 }}>
            <SummaryCard label="Total facturado" value={formatCurrency(totalPaid + totalPending)} color="var(--text-strong)" />
            <SummaryCard label="Cobrado" value={formatCurrency(totalPaid)} color="var(--success-500)" />
            <SummaryCard label="Pendiente" value={formatCurrency(totalPending)} color="var(--warning-500)" />
          </Box>
          <Card
            title="Facturas"
            icon="mdi-receipt-text"
            subtitle={`${list.length} ${list.length === 1 ? 'factura' : 'facturas'}`}
            action={<Button icon="mdi-plus">Nueva Factura</Button>}
          >
            <DataTable<Invoice>
              rows={list}
              rowKey="id"
              emptyText="No hay facturas."
              columns={[
                { key: 'number', header: 'Folio', align: 'left', render: (r) => <Link component="button" sx={{ fontWeight: 700 }}>{r.number}</Link> },
                { key: 'plant', header: 'Empresa', align: 'left' },
                { key: 'date', header: 'Fecha', render: (r) => formatDate(r.date) },
                { key: 'amount', header: 'Monto', render: (r) => formatCurrency(r.amount) },
                { key: 'status', header: 'Estado', render: (r) => <StatusBadge tone={r.status === 'Pagada' ? 'success' : 'warning'} label={r.status.toUpperCase()} /> },
                {
                  key: 'actions',
                  header: 'Acciones',
                  render: () => (
                    <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
                      <IconButton label="Ver detalle" icon="mdi-eye" size="small" />
                      <IconButton label="Descargar PDF" icon="mdi-download" color="primary" size="small" />
                    </Box>
                  ),
                },
              ]}
            />
          </Card>
        </>
      ) : (
        <Box>
          <Box sx={{ mb: 1.75 }}>
            <Typography variant="h3" component="h2">
              Plantillas de factura
            </Typography>
            <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', fontWeight: 700 }}>
              Datos fiscales y de pago para las facturas del evento.
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.25 }}>
            {(templates.data ?? []).map((t, i) => (
              <Card key={t.id}>
                <Stack spacing={1.5}>
                  {[
                    ['Nombre de la plantilla', t.name],
                    ['Dirección', t.address],
                    ['Teléfono', t.phone],
                    ['Instrucciones de pago', t.paymentInstructions],
                  ].map(([label, value]) => (
                    <Box key={label}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>{value}</Typography>
                    </Box>
                  ))}
                  <Stack direction="row" spacing={1.25} sx={{ mt: 0.5 }}>
                    <Button size="sm" fullWidth icon={i === 0 ? 'mdi-check' : undefined}>
                      {i === 0 ? 'Seleccionada' : 'Seleccionar'}
                    </Button>
                    <Button size="sm" variant="outlined" fullWidth>
                      Ver Detalles
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Stack>
  );
}
