import { db, delay } from '@/lib';
import type { SettingsGateway } from '../domain/settingsGateway';
import type { AppSettings, Density } from '../domain/models/Settings';

export class SettingsStorageGateway implements SettingsGateway {
  async getSettings(): Promise<AppSettings> {
    await delay(80);
    return { ...db.read().settings };
  }

  async setNotesVisible(visible: boolean): Promise<AppSettings> {
    return db.write((d) => {
      d.settings.notesVisible = visible;
      return { ...d.settings };
    });
  }

  async setDensity(density: Density): Promise<AppSettings> {
    return db.write((d) => {
      d.settings.density = density;
      return { ...d.settings };
    });
  }

  async resetData(): Promise<void> {
    await delay();
    db.reset();
  }
}
