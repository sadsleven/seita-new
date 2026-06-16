import { db, delay } from '@/lib';
import type { ProductTypesGateway } from '../domain/productTypesGateway';
import type { ProductType, CreateProductTypeInput } from '../domain/models/ProductType';

export class ProductTypesStorageGateway implements ProductTypesGateway {
  async list(): Promise<ProductType[]> {
    await delay();
    return db.read().products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      availableFor: p.availableFor ?? [],
    }));
  }

  async create(input: CreateProductTypeInput): Promise<ProductType> {
    await delay();
    return db.write((database) => {
      const id = Math.max(0, ...database.products.map((p) => p.id)) + 1;
      const item = {
        id,
        name: input.name.trim(),
        description: input.description.trim(),
        availableFor: input.availableFor,
      };
      database.products.push(item);
      return item;
    });
  }

  async delete(id: number): Promise<void> {
    await delay(80);
    db.write((database) => {
      database.products = database.products.filter((p) => p.id !== id);
    });
  }
}
