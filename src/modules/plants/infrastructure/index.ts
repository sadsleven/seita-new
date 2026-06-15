import { isStorageMode } from '@/lib';
import type { PlantsGateway } from '../domain/plantsGateway';
import { PlantsStorageGateway } from './plantsStorageGateway';
import { PlantsHttpGateway } from './plantsHttpGateway';

/** Gateway binding: localStorage for the demo, HTTP for production. */
export const plantsGateway: PlantsGateway = isStorageMode
  ? new PlantsStorageGateway()
  : new PlantsHttpGateway();
