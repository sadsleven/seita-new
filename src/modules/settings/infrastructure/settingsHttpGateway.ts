import { http } from '@/lib';
import type { SettingsGateway } from '../domain/settingsGateway';
import type { AppSettings, Density } from '../domain/models/Settings';

export class SettingsHttpGateway implements SettingsGateway {
  async getSettings(): Promise<AppSettings> {
    return (await http.get<AppSettings>('/settings')).data;
  }
  async setNotesVisible(visible: boolean): Promise<AppSettings> {
    return (await http.patch<AppSettings>('/settings', { notesVisible: visible })).data;
  }
  async setDensity(density: Density): Promise<AppSettings> {
    return (await http.patch<AppSettings>('/settings', { density })).data;
  }
  async resetData(): Promise<void> {
    await http.post('/settings/reset');
  }
}
