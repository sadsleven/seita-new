import type { ProductType, CreateProductTypeInput } from './models/ProductType';

export interface ProductTypesGateway {
  list(): Promise<ProductType[]>;
  create(input: CreateProductTypeInput): Promise<ProductType>;
  delete(id: number): Promise<void>;
}
