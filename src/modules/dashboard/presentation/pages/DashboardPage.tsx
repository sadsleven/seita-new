import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useAuth } from '@/modules/auth';
import { Alert, StatCard } from '@/components/ui';
import { useDashboard } from '../hooks/useDashboard';
import { UpcomingEventCard } from '../components/UpcomingEventCard';
import { NotesPanel } from '../components/NotesPanel';

export function DashboardPage() {
  const { user } = useAuth();
  const { query, addNote, deleteNote } = useDashboard();

  if (query.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (query.isError || !query.data) {
    return <Alert severity="error" title="No se pudo cargar el panel">Intenta recargar la página.</Alert>;
  }

  const data = query.data;
  const totalNotes = data.notes.general.length + data.notes.mine.length;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1" component="h1">
          Hola, {user?.firstName ?? 'bienvenido'}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Este es el resumen de tu actividad y tus próximos eventos.
        </Typography>
      </Box>

      <UpcomingEventCard event={data.upcomingEvent} />

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <StatCard
          label="Eventos próximos"
          value={data.upcomingCount}
          icon="mdi-calendar-star"
          tone="primary"
          hint="Activos y por iniciar"
        />
        <StatCard
          label="Notas activas"
          value={totalNotes}
          icon="mdi-note-multiple-outline"
          tone="teal"
          hint="Generales y personales"
        />
      </Box>

      {data.notesVisible && (
        <NotesPanel
          notes={data.notes}
          onAdd={(scope, text) => addNote.mutate({ scope, text })}
          onDelete={(scope, id) => deleteNote.mutate({ scope, id })}
          busy={addNote.isPending || deleteNote.isPending}
        />
      )}
    </Stack>
  );
}
