import type { Plant, CreatePlantInput } from './models/Plant';
import type { Contact, CreateContactInput } from './models/Contact';
import type { EventHistoryEntry } from './models/EventHistoryEntry';

export interface PlantCatalogs {
  plantTypes: string[];
  countries: string[];
  industries: string[];
  sources: string[];
  associations: string[];
}

/**
 * Contract the presentation layer depends on. Implemented by
 * infrastructure/plantsStorageGateway (demo) or plantsHttpGateway (production) —
 * same interface, swapped via config without touching presentation/.
 */
export interface PlantsGateway {
  list(): Promise<Plant[]>;
  getById(id: number): Promise<Plant>;
  create(input: CreatePlantInput): Promise<Plant>;
  delete(id: number): Promise<void>;
  duplicate(id: number): Promise<Plant>;

  getContacts(plantId: number): Promise<Contact[]>;
  addContact(plantId: number, input: CreateContactInput): Promise<Contact>;
  deleteContact(id: number): Promise<void>;

  getEventHistory(plantId: number): Promise<EventHistoryEntry[]>;

  getCatalogs(): Promise<PlantCatalogs>;
}
