import type { ProductType } from '../../domain/models/ProductType';

export interface ProductTypeDto {
  id: number;
  name: string;
  description?: string;
  availableFor?: string[];
}

export const productTypeFromDto = (dto: ProductTypeDto): ProductType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description ?? '',
  availableFor: dto.availableFor ?? [],
});
