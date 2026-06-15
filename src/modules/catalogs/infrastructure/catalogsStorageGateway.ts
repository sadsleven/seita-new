import { db, delay, clone } from '@/lib';
import type { CatalogsGateway } from '../domain/catalogsGateway';
import type { CatalogItem, CatalogName } from '../domain/models/CatalogItem';
import { catalogItemFromRow } from './dto/CatalogItemDto';

export class CatalogsStorageGateway implements CatalogsGateway {
  async list(name: CatalogName): Promise<CatalogItem[]> {
    await delay();
    const rows = db.read().catalogs[name] ?? [];
    return clone(rows).map(catalogItemFromRow);
  }

  async create(name: CatalogName, data: Omit<CatalogItem, 'id'>): Promise<CatalogItem> {
    await delay(80);
    const id = db.nextId('cat');
    return db.write((database) => {
      if (!database.catalogs[name]) database.catalogs[name] = [];
      const row = { id, ...data };
      database.catalogs[name].push(row);
      return catalogItemFromRow(row);
    });
  }

  async delete(name: CatalogName, id: number): Promise<void> {
    await delay(80);
    db.write((database) => {
      if (database.catalogs[name]) {
        database.catalogs[name] = database.catalogs[name].filter((r) => r.id !== id);
      }
    });
  }
}
