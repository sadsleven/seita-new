import { Box, Stack, Typography } from '@mui/material';
import { StatusBadge } from '@/components/ui';
import { formatDateRange } from '@/lib';
import type { EventSummary } from '../../domain/models/Event';

/** Navy gradient hero for the event Inicio tab. */
export function EventBanner({ event }: { event: EventSummary }) {
  const finished = event.status === 'FINISHED';
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-2)',
        color: '#fff',
        background:
          'linear-gradient(110deg, var(--brand-navy) 0%, var(--brand-navy-deep) 55%, #00224f 100%)',
        p: { xs: 3, md: '30px 34px' },
      }}
    >
      <Box sx={{ position: 'absolute', right: -30, top: -30, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(41,171,226,0.18)' }} />
      <Box sx={{ position: 'relative' }}>
        <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
          <StatusBadge tone={finished ? 'neutral' : 'success'} label={finished ? 'FINALIZADO' : 'ACTIVO'} />
          <StatusBadge tone="info" label={finished ? 'Completado' : `${event.daysToStart} días para iniciar`} />
        </Stack>
        <Typography component="h1" sx={{ fontSize: 'var(--text-h1)', fontWeight: 900, mb: 1, maxWidth: 720 }}>
          {event.name}
        </Typography>
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ gap: 2.75, color: 'var(--brand-cyan-light)', fontSize: '1.0625rem', fontWeight: 700 }}
        >
          <Box component="span">
            <span className="mdi mdi-map-marker" aria-hidden /> {event.address || event.country}
          </Box>
          <Box component="span">
            <span className="mdi mdi-calendar" aria-hidden /> {formatDateRange(event.startDate, event.endDate)}
          </Box>
          <Box component="span">
            <span className="mdi mdi-factory" aria-hidden /> {event.industries.join(', ') || '—'}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
