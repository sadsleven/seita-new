import { http } from '@/lib';
import type { CatalogsGateway } from '../domain/catalogsGateway';
import type { CatalogItem, CatalogName } from '../domain/models/CatalogItem';

/** Production catalogs over HTTP. Mirrors the storage gateway's interface. */
export class CatalogsHttpGateway implements CatalogsGateway {
  async list(name: CatalogName): Promise<CatalogItem[]> {
    const { data } = await http.get<CatalogItem[]>(`/catalogs/${name}`);
    return data;
  }

  async create(name: CatalogName, payload: Omit<CatalogItem, 'id'>): Promise<CatalogItem> {
    const { data } = await http.post<CatalogItem>(`/catalogs/${name}`, payload);
    return data;
  }

  async delete(name: CatalogName, id: number): Promise<void> {
    await http.delete(`/catalogs/${name}/${id}`);
  }
}
