import { db, delay, clone } from '@/lib';
import type { PlantsGateway, PlantCatalogs } from '../domain/plantsGateway';
import type { Plant, CreatePlantInput } from '../domain/models/Plant';
import type { Contact, CreateContactInput } from '../domain/models/Contact';
import type { EventHistoryEntry } from '../domain/models/EventHistoryEntry';
import {
  plantFromRow,
  plantInputToRow,
  contactFromRow,
  contactInputToRow,
} from './dto/PlantDto';

export class PlantsStorageGateway implements PlantsGateway {
  async list(): Promise<Plant[]> {
    await delay();
    return db.read().plants.map(plantFromRow);
  }

  async getById(id: number): Promise<Plant> {
    await delay();
    const row = db.read().plants.find((p) => p.id === id);
    if (!row) throw new Error(`Planta ${id} no encontrada.`);
    return plantFromRow(row);
  }

  async create(input: CreatePlantInput): Promise<Plant> {
    await delay();
    const id = db.nextId('plant');
    const row = plantInputToRow(input, id);
    db.write((d) => {
      d.plants.push(clone(row));
    });
    return plantFromRow(row);
  }

  async delete(id: number): Promise<void> {
    await delay(60);
    db.write((d) => {
      d.plants = d.plants.filter((p) => p.id !== id);
      d.contacts = d.contacts.filter((c) => c.plant_id !== id);
    });
  }

  async duplicate(id: number): Promise<Plant> {
    await delay();
    const source = db.read().plants.find((p) => p.id === id);
    if (!source) throw new Error(`Planta ${id} no encontrada.`);
    const newId = db.nextId('plant');
    const copy = clone(source);
    copy.id = newId;
    copy.company_name = `${source.company_name} (copia)`;
    copy.status = 'Prospecto';
    db.write((d) => {
      d.plants.push(copy);
    });
    return plantFromRow(copy);
  }

  async getContacts(plantId: number): Promise<Contact[]> {
    await delay();
    return db
      .read()
      .contacts.filter((c) => c.plant_id === plantId)
      .map(contactFromRow);
  }

  async addContact(plantId: number, input: CreateContactInput): Promise<Contact> {
    await delay();
    const id = db.nextId('contact');
    const row = contactInputToRow(input, id, plantId);
    db.write((d) => {
      d.contacts.push(clone(row));
    });
    return contactFromRow(row);
  }

  async deleteContact(id: number): Promise<void> {
    await delay(60);
    db.write((d) => {
      d.contacts = d.contacts.filter((c) => c.id !== id);
    });
  }

  async getEventHistory(plantId: number): Promise<EventHistoryEntry[]> {
    await delay();
    const data = db.read();
    const plant = data.plants.find((p) => p.id === plantId);
    if (!plant) return [];

    return data.orders
      .filter((o) => o.plant === plant.company_name)
      .map((o) => {
        const event = data.events.find((e) => e.id === o.event_id);
        return {
          id: o.id,
          event: event?.name ?? `Evento #${o.event_id}`,
          date: event?.start_date ?? '',
          type: o.type,
          amount: o.amount,
        };
      });
  }

  async getCatalogs(): Promise<PlantCatalogs> {
    await delay(60);
    const { catalogs } = db.read();
    return {
      plantTypes: (catalogs['plantTypes'] ?? []).map((c) => c.name),
      countries: (catalogs['countries'] ?? []).map((c) => c.name),
      industries: (catalogs['industries'] ?? []).map((c) => c.name),
      sources: (catalogs['sources'] ?? []).map((c) => c.name),
      associations: (catalogs['associations'] ?? []).map((c) => c.name),
    };
  }
}
