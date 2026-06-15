import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Button, Dialog, Select, TextField } from '@/components/ui';
import { EVALUATIONS, EVAL_LABEL } from '../constants';
import type { Vendor, VendorEvaluation } from '../../domain/models/Logistics';

export interface VendorEvaluationDialogProps {
  vendor: Vendor | null;
  onClose: () => void;
  onSave: (id: number, evaluation: VendorEvaluation, observation: string) => void;
  saving?: boolean;
}

export function VendorEvaluationDialog({ vendor, onClose, onSave, saving = false }: VendorEvaluationDialogProps) {
  const [evaluation, setEvaluation] = useState<string>('');
  const [observation, setObservation] = useState('');

  useEffect(() => {
    if (vendor) {
      setEvaluation(vendor.evaluation === 'No Evaluation' ? '' : vendor.evaluation);
      setObservation(vendor.observation || '');
    }
  }, [vendor]);

  return (
    <Dialog
      open={!!vendor}
      onClose={onClose}
      title="Evaluación del proveedor"
      icon="mdi-clipboard-check-outline"
      maxWidth="sm"
      actions={
        <>
          <Button variant="outlined" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            icon="mdi-check"
            disabled={!evaluation}
            loading={saving}
            onClick={() => vendor && onSave(vendor.id, evaluation as VendorEvaluation, observation)}
          >
            Guardar
          </Button>
        </>
      }
    >
      {vendor && (
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Empresa
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>{vendor.company}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Sub-tipos
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>{vendor.subtypes || '—'}</Typography>
            </Box>
          </Box>
          <Select
            label="Evaluación"
            placeholder="Selecciona una calificación"
            value={evaluation}
            onChange={setEvaluation}
            options={EVALUATIONS.map((v) => ({ value: v, label: EVAL_LABEL[v] }))}
          />
          <TextField
            label="Observación"
            placeholder="Comentarios sobre el desempeño del proveedor…"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            multiline
            minRows={4}
          />
        </Stack>
      )}
    </Dialog>
  );
}
