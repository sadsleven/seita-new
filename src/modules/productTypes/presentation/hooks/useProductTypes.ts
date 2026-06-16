import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productTypesGateway } from '../../infrastructure';
import type { CreateProductTypeInput } from '../../domain/models/ProductType';

const PRODUCT_TYPES_KEY = ['productTypes'];
const PLANT_TYPES_KEY = ['productTypes', 'plantTypes'];

export function useProductTypes() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: PRODUCT_TYPES_KEY,
    queryFn: () => productTypesGateway.list(),
  });

  const plantTypes = useQuery({
    queryKey: PLANT_TYPES_KEY,
    queryFn: () => productTypesGateway.listPlantTypes(),
  });

  const create = useMutation({
    mutationFn: (input: CreateProductTypeInput) => productTypesGateway.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_TYPES_KEY }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => productTypesGateway.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_TYPES_KEY }),
  });

  return { query, plantTypes, create, remove };
}
