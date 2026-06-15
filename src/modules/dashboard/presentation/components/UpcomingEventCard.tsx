import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import { formatDateRange } from '@/lib';
import type { UpcomingEvent } from '../../domain/models/UpcomingEvent';

function countdownLabel(days: number): string {
  if (days <= 0) return 'Comienza hoy';
  if (days === 1) return 'Falta 1 día';
  return `Faltan ${days} días`;
}

export interface UpcomingEventCardProps {
  event: UpcomingEvent | null;
}

/** Navy gradient banner with a countdown and a CTA into the next event. */
export function UpcomingEventCard({ event }: UpcomingEventCardProps) {
  const navigate = useNavigate();

  if (!event) {
    return (
      <Card title="Próximo evento">
        <Typography color="text.secondary">
          No hay eventos próximos programados. Crea uno desde la sección Eventos.
        </Typography>
      </Card>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-3)',
        color: '#fff',
        background: 'linear-gradient(120deg, #003596 0%, #00224f 100%)',
        p: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: -60,
          top: -60,
          width: 220,
          height: 220,
          borderRadius: '50%',
          bgcolor: 'rgba(41,171,226,0.22)',
        }}
      />
      <Box sx={{ position: 'relative' }}>
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.75)' }}>
          Próximo evento
        </Typography>
        <Typography component="h2" sx={{ fontSize: 'var(--text-h2)', fontWeight: 900, lineHeight: 1.15, mt: 0.5 }}>
          {event.name}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 1.5, color: 'rgba(255,255,255,0.9)' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <span className="mdi mdi-calendar-range" aria-hidden style={{ fontSize: '1.3rem' }} />
            {formatDateRange(event.startDate, event.endDate)}
          </Box>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <span className="mdi mdi-map-marker-outline" aria-hidden style={{ fontSize: '1.3rem' }} />
            {event.address}, {event.country}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 1,
              bgcolor: 'rgba(255,255,255,0.12)',
              px: 2,
              py: 1,
              borderRadius: 'var(--radius-pill)',
            }}
          >
            <span className="mdi mdi-timer-sand" aria-hidden style={{ fontSize: '1.4rem' }} />
            <Typography sx={{ fontWeight: 900, fontSize: '1.25rem' }}>
              {countdownLabel(event.daysToStart)}
            </Typography>
          </Box>
          <Button
            color="primary"
            size="lg"
            icon="mdi-login-variant"
            onClick={() => navigate(`/eventos/${event.id}`)}
            sx={{ bgcolor: '#fff', color: 'var(--secondary-700)', '&:hover': { bgcolor: 'rgba(255,255,255,0.88)' } }}
          >
            Entrar al evento
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
