import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productTypesGateway } from '../../infrastructure';

const PRODUCT_TYPES_KEY = ['productTypes'];

export function useProductTypes() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: PRODUCT_TYPES_KEY,
    queryFn: () => productTypesGateway.list(),
  });

  const create = useMutation({
    mutationFn: (name: string) => productTypesGateway.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_TYPES_KEY }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => productTypesGateway.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_TYPES_KEY }),
  });

  return { query, create, remove };
}
