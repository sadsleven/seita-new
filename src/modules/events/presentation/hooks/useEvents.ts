import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsGateway } from '../../infrastructure';
import type { CreateEventInput } from '../../domain/models/Event';

export const EVENTS_KEY = ['events'] as const;

export function useEvents() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: EVENTS_KEY, queryFn: () => eventsGateway.list() });
  const create = useMutation({
    mutationFn: (input: CreateEventInput) => eventsGateway.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
  const remove = useMutation({
    mutationFn: (id: number) => eventsGateway.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
  return { query, create, remove };
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsGateway.getById(id),
    enabled: Number.isFinite(id),
  });
}

export function useEventStats(id: number) {
  return useQuery({
    queryKey: ['events', id, 'stats'],
    queryFn: () => eventsGateway.getStats(id),
    enabled: Number.isFinite(id),
  });
}
