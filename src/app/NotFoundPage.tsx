import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
      <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center', maxWidth: 420 }}>
        <span className="mdi mdi-compass-off-outline" aria-hidden style={{ fontSize: '3rem', color: 'var(--neutral-400)' }} />
        <Typography variant="h1" component="h1">
          Página no encontrada
        </Typography>
        <Typography color="text.secondary">
          La página que buscas no existe o fue movida.
        </Typography>
        <Button icon="mdi-home-outline" onClick={() => navigate('/panel')}>
          Volver al panel
        </Button>
      </Stack>
    </Box>
  );
}
