import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogsGateway } from '../../infrastructure';
import type { CatalogItem, CatalogName } from '../../domain/models/CatalogItem';

export function useCatalog(name: CatalogName) {
  const qc = useQueryClient();
  const key = ['catalogs', name] as const;

  const query = useQuery({
    queryKey: key,
    queryFn: () => catalogsGateway.list(name),
  });

  const create = useMutation({
    mutationFn: (data: Omit<CatalogItem, 'id'>) => catalogsGateway.create(name, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => catalogsGateway.delete(name, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { query, create, remove };
}
