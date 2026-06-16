import type { ProductType, CreateProductTypeInput } from './models/ProductType';

export interface ProductTypesGateway {
  list(): Promise<ProductType[]>;
  /** Plant-type names, used to populate the "available for" selector. */
  listPlantTypes(): Promise<string[]>;
  create(input: CreateProductTypeInput): Promise<ProductType>;
  delete(id: number): Promise<void>;
}
