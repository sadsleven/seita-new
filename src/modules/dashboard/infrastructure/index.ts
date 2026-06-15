import { isStorageMode } from '@/lib';
import type { DashboardGateway } from '../domain/dashboardGateway';
import { DashboardStorageGateway } from './dashboardStorageGateway';
import { DashboardHttpGateway } from './dashboardHttpGateway';

export const dashboardGateway: DashboardGateway = isStorageMode
  ? new DashboardStorageGateway()
  : new DashboardHttpGateway();
