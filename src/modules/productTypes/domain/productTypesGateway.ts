import type { ProductType } from './models/ProductType';

export interface ProductTypesGateway {
  list(): Promise<ProductType[]>;
  create(name: string): Promise<ProductType>;
  delete(id: number): Promise<void>;
}
