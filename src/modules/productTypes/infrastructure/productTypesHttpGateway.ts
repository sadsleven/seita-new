import { http } from '@/lib';
import type { ProductTypesGateway } from '../domain/productTypesGateway';
import type { ProductType, CreateProductTypeInput } from '../domain/models/ProductType';
import { productTypeFromDto, type ProductTypeDto } from './dto/ProductTypeDto';

/** Production product types catalog over HTTP. */
export class ProductTypesHttpGateway implements ProductTypesGateway {
  async list(): Promise<ProductType[]> {
    const { data } = await http.get<ProductTypeDto[]>('/product-types');
    return data.map(productTypeFromDto);
  }

  async create(input: CreateProductTypeInput): Promise<ProductType> {
    const { data } = await http.post<ProductTypeDto>('/product-types', input);
    return productTypeFromDto(data);
  }

  async delete(id: number): Promise<void> {
    await http.delete(`/product-types/${id}`);
  }
}
