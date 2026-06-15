import { http } from '@/lib';
import type { PlantsGateway, PlantCatalogs } from '../domain/plantsGateway';
import type { Plant, CreatePlantInput } from '../domain/models/Plant';
import type { Contact, CreateContactInput } from '../domain/models/Contact';
import type { EventHistoryEntry } from '../domain/models/EventHistoryEntry';

/** Production plants gateway over HTTP (Axios). */
export class PlantsHttpGateway implements PlantsGateway {
  async list(): Promise<Plant[]> {
    const { data } = await http.get<Plant[]>('/plants');
    return data;
  }

  async getById(id: number): Promise<Plant> {
    const { data } = await http.get<Plant>(`/plants/${id}`);
    return data;
  }

  async create(input: CreatePlantInput): Promise<Plant> {
    const { data } = await http.post<Plant>('/plants', input);
    return data;
  }

  async delete(id: number): Promise<void> {
    await http.delete(`/plants/${id}`);
  }

  async duplicate(id: number): Promise<Plant> {
    const { data } = await http.post<Plant>(`/plants/${id}/duplicate`);
    return data;
  }

  async getContacts(plantId: number): Promise<Contact[]> {
    const { data } = await http.get<Contact[]>(`/plants/${plantId}/contacts`);
    return data;
  }

  async addContact(plantId: number, input: CreateContactInput): Promise<Contact> {
    const { data } = await http.post<Contact>(`/plants/${plantId}/contacts`, input);
    return data;
  }

  async deleteContact(id: number): Promise<void> {
    await http.delete(`/plants/contacts/${id}`);
  }

  async getEventHistory(plantId: number): Promise<EventHistoryEntry[]> {
    const { data } = await http.get<EventHistoryEntry[]>(`/plants/${plantId}/history`);
    return data;
  }

  async getCatalogs(): Promise<PlantCatalogs> {
    const { data } = await http.get<PlantCatalogs>('/plants/catalogs');
    return data;
  }
}
