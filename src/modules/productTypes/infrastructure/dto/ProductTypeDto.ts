import type { ProductType } from '../../domain/models/ProductType';

export interface ProductTypeDto {
  id: number;
  name: string;
}

export const productTypeFromDto = (dto: ProductTypeDto): ProductType => ({
  id: dto.id,
  name: dto.name,
});
