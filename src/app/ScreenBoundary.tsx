import { Box, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Alert, Button } from '@/components/ui';
import { ErrorBoundary } from './ErrorBoundary';

function ScreenError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', py: 6 }}>
      <Alert severity="error" title="Algo salió mal en esta pantalla">
        <Stack spacing={2} alignItems="flex-start">
          <Typography>
            Ocurrió un problema al mostrar esta sección. Puedes intentarlo de nuevo o recargar la
            página.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
            {error.message}
          </Typography>
          <Button icon="mdi-refresh" onClick={onRetry}>
            Reintentar
          </Button>
        </Stack>
      </Alert>
    </Box>
  );
}

/**
 * Per-screen error boundary. Keyed by route, so navigating to another page
 * clears a previous error automatically — a render failure never blanks the app.
 * Pass `resetKey` to override the key (e.g. a layout that should persist across
 * its own nested tab routes instead of remounting on every sub-path change).
 */
export function ScreenBoundary({ children, resetKey }: { children: React.ReactNode; resetKey?: string }) {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary key={resetKey ?? pathname} fallback={(error, reset) => <ScreenError error={error} onRetry={reset} />}>
      {children}
    </ErrorBoundary>
  );
}
