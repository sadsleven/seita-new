import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsGateway } from '../../infrastructure';
import type { AppSettings } from '../../domain/models/Settings';

export function useSettings() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: ['settings'], queryFn: () => settingsGateway.getSettings() });

  const setNotesVisible = useMutation({
    mutationFn: (visible: boolean) => settingsGateway.setNotesVisible(visible),
    onSuccess: (data: AppSettings) => {
      qc.setQueryData(['settings'], data);
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const reset = useMutation({
    mutationFn: () => settingsGateway.resetData(),
    onSuccess: () => qc.invalidateQueries(),
  });

  return { query, setNotesVisible, reset };
}
