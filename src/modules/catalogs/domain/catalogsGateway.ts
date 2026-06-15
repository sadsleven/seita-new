import type { CatalogItem, CatalogName } from './models/CatalogItem';

export interface CatalogsGateway {
  list(name: CatalogName): Promise<CatalogItem[]>;
  create(name: CatalogName, data: Omit<CatalogItem, 'id'>): Promise<CatalogItem>;
  delete(name: CatalogName, id: number): Promise<void>;
}
