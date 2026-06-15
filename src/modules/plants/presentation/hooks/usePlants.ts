import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { plantsGateway } from '../../infrastructure';
import type { CreatePlantInput } from '../../domain/models/Plant';

const PLANTS_KEY = ['plants'];

/** List query + create/delete/duplicate mutations for the plants directory. */
export function usePlants() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: PLANTS_KEY,
    queryFn: () => plantsGateway.list(),
  });

  const catalogsQuery = useQuery({
    queryKey: ['plants', 'catalogs'],
    queryFn: () => plantsGateway.getCatalogs(),
  });

  const create = useMutation({
    mutationFn: (input: CreatePlantInput) => plantsGateway.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: PLANTS_KEY }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => plantsGateway.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PLANTS_KEY }),
  });

  const duplicate = useMutation({
    mutationFn: (id: number) => plantsGateway.duplicate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PLANTS_KEY }),
  });

  return { query, catalogsQuery, create, remove, duplicate };
}
