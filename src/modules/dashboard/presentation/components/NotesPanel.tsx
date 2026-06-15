import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Card, Tabs, TextField, Button, IconButton } from '@/components/ui';
import { formatDate } from '@/lib';
import { useDashboardStore } from '../../domain/dashboardStore';
import type { Note, NoteScope } from '../../domain/models/Note';

export interface NotesPanelProps {
  notes: Record<NoteScope, Note[]>;
  onAdd: (scope: NoteScope, text: string) => void;
  onDelete: (scope: NoteScope, id: string) => void;
  busy?: boolean;
}

export function NotesPanel({ notes, onAdd, onDelete, busy = false }: NotesPanelProps) {
  const scope = useDashboardStore((s) => s.noteScope);
  const setScope = useDashboardStore((s) => s.setNoteScope);
  const [text, setText] = useState('');

  const list = notes[scope] ?? [];

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    onAdd(scope, value);
    setText('');
  };

  return (
    <Card title="Notas" icon="mdi-note-text-outline">
      <Tabs
        value={scope}
        onChange={(v) => setScope(v as NoteScope)}
        items={[
          { value: 'general', label: 'Generales', icon: 'mdi-bulletin-board' },
          { value: 'mine', label: 'Mías', icon: 'mdi-account-outline' },
        ]}
        sx={{ mb: 2, borderBottom: '1px solid var(--border-subtle)' }}
      />

      <Stack spacing={1.5} sx={{ mb: 2.5 }}>
        {list.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            No hay notas en esta sección todavía.
          </Typography>
        ) : (
          list.map((note) => (
            <Box
              key={note.id}
              sx={{
                display: 'flex',
                gap: 1.5,
                p: 2,
                borderRadius: 'var(--radius-md)',
                bgcolor: 'var(--surface-sunken)',
              }}
            >
              <span
                className="mdi mdi-circle-medium"
                aria-hidden
                style={{ color: 'var(--primary-500)', fontSize: '1.4rem', marginTop: 2 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ color: 'text.primary' }}>{note.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {note.author} · {formatDate(note.date)}
                </Typography>
              </Box>
              <IconButton
                label="Eliminar nota"
                icon="mdi-trash-can-outline"
                color="danger"
                size="small"
                disabled={busy}
                onClick={() => onDelete(scope, note.id)}
              />
            </Box>
          ))
        )}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-end">
        <TextField
          label={scope === 'mine' ? 'Agregar una nota personal' : 'Agregar una nota general'}
          placeholder="Escribe una nota…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
        />
        <Button icon="mdi-plus" onClick={submit} loading={busy} sx={{ flexShrink: 0 }}>
          Agregar
        </Button>
      </Stack>
    </Card>
  );
}
