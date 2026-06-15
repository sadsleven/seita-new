import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardGateway } from '../../infrastructure';
import type { NoteScope } from '../../domain/models/Note';

const DASHBOARD_KEY = ['dashboard'];

export function useDashboard() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: () => dashboardGateway.getDashboard(),
  });

  const addNote = useMutation({
    mutationFn: ({ scope, text }: { scope: NoteScope; text: string }) =>
      dashboardGateway.addNote(scope, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: DASHBOARD_KEY }),
  });

  const deleteNote = useMutation({
    mutationFn: ({ scope, id }: { scope: NoteScope; id: string }) =>
      dashboardGateway.deleteNote(scope, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DASHBOARD_KEY }),
  });

  return { query, addNote, deleteNote };
}
