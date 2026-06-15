import type { AppSettings, Density } from './models/Settings';

export interface SettingsGateway {
  getSettings(): Promise<AppSettings>;
  setNotesVisible(visible: boolean): Promise<AppSettings>;
  setDensity(density: Density): Promise<AppSettings>;
  /** Wipe persisted demo data and re-seed. */
  resetData(): Promise<void>;
}
