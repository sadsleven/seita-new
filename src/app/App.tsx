import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AppProviders } from './providers';
import { router } from './router';
import { useAuth } from '@/modules/auth';

function Splash() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box component="img" src="/intertech-logo.svg" alt="SEITA" sx={{ height: 56, mb: 3 }} />
        <CircularProgress />
      </Box>
    </Box>
  );
}

/** Restores any persisted session before rendering the router. */
function Root() {
  const { bootstrap, status } = useAuth();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  if (status === 'idle') return <Splash />;
  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <AppProviders>
      <Root />
    </AppProviders>
  );
}
