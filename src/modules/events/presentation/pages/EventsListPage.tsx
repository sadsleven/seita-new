import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Link, Typography } from '@mui/material';
import { Alert, Button, Card, Chip, DataTable, Dialog, IconButton, StatusBadge } from '@/components/ui';
import type { ChipTone } from '@/components/ui';
import { formatDate } from '@/lib';
import { useEvents } from '../hooks/useEvents';
import type { EventSummary } from '../../domain/models/Event';

function daysTone(days: number, finished: boolean): ChipTone {
  if (finished) return 'default';
  if (days <= 15) return 'error';
  if (days <= 30) return 'warning';
  return 'primary';
}

export function EventsListPage() {
  const navigate = useNavigate();
  const { query, remove } = useEvents();
  const [toDelete, setToDelete] = useState<EventSummary | null>(null);

  if (query.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (query.isError || !query.data) {
    return <Alert severity="error" title="No se pudieron cargar los eventos">Intenta recargar la página.</Alert>;
  }

  const events = query.data;

  return (
    <>
      <Card
        title="Lista de Eventos"
        icon="mdi-calendar-range"
        subtitle={`${events.length} ${events.length === 1 ? 'evento' : 'eventos'}`}
        action={
          <Button icon="mdi-plus" onClick={() => navigate('/eventos/crear')}>
            Crear Evento
          </Button>
        }
      >
        <DataTable<EventSummary>
          rows={events}
          rowKey="id"
          emptyText="Aún no hay eventos — crea el primero."
          onRowClick={(r) => navigate(`/eventos/${r.id}`)}
          columns={[
            {
              key: 'name',
              header: 'Nombre',
              align: 'left',
              render: (r) => (
                <Link
                  component="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/eventos/${r.id}`);
                  }}
                  sx={{ fontWeight: 700, textAlign: 'left' }}
                >
                  {r.name}
                </Link>
              ),
            },
            { key: 'start', header: 'Desde', render: (r) => formatDate(r.startDate) },
            { key: 'end', header: 'Hasta', render: (r) => formatDate(r.endDate) },
            { key: 'country', header: 'País', render: (r) => r.country },
            { key: 'industries', header: 'Industria', render: (r) => r.industries.join(', ') || '—' },
            {
              key: 'days',
              header: 'Días para iniciar',
              render: (r) => (
                <Chip
                  tone={daysTone(r.daysToStart, r.status === 'FINISHED')}
                  label={r.status === 'FINISHED' ? '—' : String(r.daysToStart)}
                />
              ),
            },
            {
              key: 'status',
              header: 'Estado',
              render: (r) => (
                <StatusBadge
                  tone={r.status === 'FINISHED' ? 'neutral' : 'success'}
                  label={r.status === 'FINISHED' ? 'FINALIZADO' : 'ACTIVO'}
                />
              ),
            },
            {
              key: 'actions',
              header: 'Acciones',
              render: (r) => (
                <Box sx={{ display: 'inline-flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                  <IconButton label="Abrir evento" icon="mdi-eye" size="small" onClick={() => navigate(`/eventos/${r.id}`)} />
                  <IconButton
                    label="Ir a registro"
                    icon="mdi-account-plus"
                    color="primary"
                    size="small"
                    onClick={() => navigate(`/eventos/${r.id}/registro`)}
                  />
                  <IconButton label="Eliminar evento" icon="mdi-delete" color="danger" size="small" onClick={() => setToDelete(r)} />
                </Box>
              ),
            },
          ]}
        />
      </Card>

      <Dialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="¿Eliminar este evento?"
        icon="mdi-alert"
        actions={
          <>
            <Button variant="outlined" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              icon="mdi-delete"
              loading={remove.isPending}
              onClick={() => {
                if (toDelete) remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) });
              }}
            >
              Eliminar
            </Button>
          </>
        }
      >
        <Typography>
          Se eliminará de forma permanente <strong>{toDelete?.name}</strong> y todos sus registros. Esta
          acción no se puede deshacer.
        </Typography>
      </Dialog>
    </>
  );
}
