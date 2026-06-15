import { isStorageMode } from '@/lib';
import type { ProductTypesGateway } from '../domain/productTypesGateway';
import { ProductTypesStorageGateway } from './productTypesStorageGateway';
import { ProductTypesHttpGateway } from './productTypesHttpGateway';

/** Gateway binding: localStorage for the demo, HTTP for production. */
export const productTypesGateway: ProductTypesGateway = isStorageMode
  ? new ProductTypesStorageGateway()
  : new ProductTypesHttpGateway();
