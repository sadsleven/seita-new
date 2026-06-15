import { isStorageMode } from '@/lib';
import type { CatalogsGateway } from '../domain/catalogsGateway';
import { CatalogsStorageGateway } from './catalogsStorageGateway';
import { CatalogsHttpGateway } from './catalogsHttpGateway';

export const catalogsGateway: CatalogsGateway = isStorageMode
  ? new CatalogsStorageGateway()
  : new CatalogsHttpGateway();
