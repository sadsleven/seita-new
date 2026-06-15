import { db, delay } from '@/lib';
import type { ProductTypesGateway } from '../domain/productTypesGateway';
import type { ProductType } from '../domain/models/ProductType';

export class ProductTypesStorageGateway implements ProductTypesGateway {
  async list(): Promise<ProductType[]> {
    await delay();
    return db.read().products.map((p) => ({ id: p.id, name: p.name }));
  }

  async create(name: string): Promise<ProductType> {
    await delay();
    return db.write((database) => {
      const id = Math.max(0, ...database.products.map((p) => p.id)) + 1;
      const item = { id, name: name.trim() };
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
