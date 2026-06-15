import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Alert, Button, Card, Dialog, Switch } from '@/components/ui';
import { useSettings } from '../hooks/useSettings';

export function SettingsPage() {
  const { query, setNotesVisible, reset } = useSettings();
  const [confirmReset, setConfirmReset] = useState(false);

  const settings = query.data;

  return (
    <Stack spacing={3} sx={{ maxWidth: 720 }}>
      <Typography variant="h1" component="h1">
        Configuración
      </Typography>

      <Card title="Preferencias del panel" icon="mdi-cog">
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Módulo de notas</Typography>
            <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary' }}>
              Muestra u oculta las notas en el Panel principal.
            </Typography>
          </Box>
          <Switch
            checked={settings?.notesVisible ?? false}
            disabled={!settings || setNotesVisible.isPending}
            onChange={(e) => setNotesVisible.mutate(e.target.checked)}
          />
        </Stack>
      </Card>

      <Card title="Datos de demostración" icon="mdi-database">
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} flexWrap="wrap" useFlexGap>
          <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', maxWidth: 420 }}>
            Restablece todos los eventos, plantas y registros a los datos de ejemplo originales. Esta
            acción no se puede deshacer.
          </Typography>
          <Button color="danger" variant="outlined" icon="mdi-restore" onClick={() => setConfirmReset(true)}>
            Restablecer Datos
          </Button>
        </Stack>
      </Card>

      {reset.isSuccess && (
        <Alert severity="success">Los datos de demostración se restablecieron correctamente.</Alert>
      )}

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="¿Restablecer los datos?"
        icon="mdi-alert"
        actions={
          <>
            <Button variant="outlined" onClick={() => setConfirmReset(false)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              icon="mdi-restore"
              loading={reset.isPending}
              onClick={() => reset.mutate(undefined, { onSuccess: () => setConfirmReset(false) })}
            >
              Restablecer
            </Button>
          </>
        }
      >
        <Typography>
          Se eliminarán todos tus cambios y se cargarán de nuevo los datos de ejemplo. Esta acción no
          se puede deshacer.
        </Typography>
      </Dialog>
    </Stack>
  );
}
