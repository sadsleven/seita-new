import { isStorageMode } from '@/lib';
import type { SettingsGateway } from '../domain/settingsGateway';
import { SettingsStorageGateway } from './settingsStorageGateway';
import { SettingsHttpGateway } from './settingsHttpGateway';

export const settingsGateway: SettingsGateway = isStorageMode
  ? new SettingsStorageGateway()
  : new SettingsHttpGateway();
