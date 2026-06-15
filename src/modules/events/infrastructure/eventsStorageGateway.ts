import { db, delay } from '@/lib';
import type { EventsGateway } from '../domain/eventsGateway';
import type { CreateEventInput, EventDetail, EventStats, EventSummary } from '../domain/models/Event';
import type {
  Campaign,
  CreateCampaignInput,
  CreateEventProductInput,
  CreatePackageInput,
  CreateRegistrationInput,
  EventPackage,
  EventProduct,
  Invoice,
  InvoiceTemplate,
  Registration,
  RegistrablePlant,
} from '../domain/models/EventResources';
import type {
  CreateHotelInput,
  CreateVendorInput,
  Hotel,
  Nights,
  RoomStatusField,
  RoomingEntry,
  Vendor,
  VendorEvaluation,
} from '../domain/models/Logistics';
import {
  campaignFromRow,
  eventFromRow,
  hotelFromRow,
  invoiceFromRow,
  invoiceTemplateFromRow,
  packageFromRow,
  productFromRow,
  registrationFromRow,
  roomingFromRow,
  vendorFromRow,
} from './dto/mappers';

const daysBetween = (start: string, end: string): number =>
  Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000));

export class EventsStorageGateway implements EventsGateway {
  // ── Events ──────────────────────────────────────────────────────────────
  async list(): Promise<EventSummary[]> {
    await delay();
    return db.read().events.map(eventFromRow);
  }

  async getById(id: number): Promise<EventDetail | null> {
    await delay();
    const row = db.read().events.find((e) => e.id === id);
    return row ? eventFromRow(row) : null;
  }

  async create(input: CreateEventInput): Promise<number> {
    await delay();
    return db.write((d) => {
      const id = d.nextId.event++;
      d.events.unshift({
        id,
        name: input.name,
        shortName: input.name,
        country: input.country,
        address: input.address,
        industries: input.industries,
        start_date: input.startDate,
        end_date: input.endDate,
        status: 'ACTIVE',
        gross_income: 0,
      });
      return id;
    });
  }

  async delete(id: number): Promise<void> {
    await delay();
    db.write((d) => {
      d.events = d.events.filter((e) => e.id !== id);
      d.orders = d.orders.filter((o) => o.event_id !== id);
    });
  }

  async getStats(eventId: number): Promise<EventStats> {
    await delay();
    const d = db.read();
    const orders = d.orders.filter((o) => o.event_id === eventId);
    const count = (t: string) => orders.filter((o) => o.type === t).length;
    const cat = (c: string) => orders.filter((o) => o.category === c).length;
    const ev = d.events.find((e) => e.id === eventId);
    const paper = cat('Paper');
    const can = cat('Can');
    const corr = cat('Corr');
    return {
      attendees: count('Attendee'),
      spouses: orders.filter((o) => o.spouse).length,
      presentations: count('Technical Presentation'),
      tableTops: count('Table Top'),
      others: count('Other'),
      totalOrders: orders.length,
      plantsRegistered: new Set(orders.map((o) => o.plant)).size,
      grossIncome: ev ? ev.gross_income : 0,
      assignedProducts: orders.length * 2,
      paper,
      can,
      corr,
      totalCat: paper + can + corr,
    };
  }

  // ── Registration ────────────────────────────────────────────────────────
  async getRegistrablePlants(): Promise<RegistrablePlant[]> {
    await delay();
    return db.read().plants.map((p) => ({
      companyName: p.company_name,
      contact: p.contact,
      industry: p.industry,
    }));
  }

  async getRegistrations(eventId: number): Promise<Registration[]> {
    await delay();
    return db.read().orders.filter((o) => o.event_id === eventId).map(registrationFromRow);
  }

  async addRegistration(eventId: number, input: CreateRegistrationInput): Promise<void> {
    await delay();
    db.write((d) => {
      const id = d.nextId.order++;
      d.orders.push({
        id,
        event_id: eventId,
        plant: input.plant,
        contact: input.contact,
        type: input.type,
        spouse: input.spouse,
        nights: input.nights,
        amount: input.amount,
        category: input.category,
      });
      const ev = d.events.find((e) => e.id === eventId);
      if (ev) ev.gross_income += input.amount || 0;
    });
  }

  async deleteRegistration(id: number): Promise<void> {
    await delay();
    db.write((d) => {
      const order = d.orders.find((o) => o.id === id);
      if (order) {
        const ev = d.events.find((e) => e.id === order.event_id);
        if (ev) ev.gross_income -= order.amount || 0;
      }
      d.orders = d.orders.filter((o) => o.id !== id);
    });
  }

  // ── Products ──────────────────────────────────────────────────────────────
  async getProducts(eventId: number): Promise<EventProduct[]> {
    await delay();
    return db.read().eventProducts.filter((p) => p.event_id === eventId).map(productFromRow);
  }

  async addProduct(eventId: number, input: CreateEventProductInput): Promise<void> {
    await delay();
    db.write((d) => {
      const id = d.nextId.eproduct++;
      d.eventProducts.unshift({ id, event_id: eventId, ...input });
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await delay();
    db.write((d) => {
      d.eventProducts = d.eventProducts.filter((p) => p.id !== id);
    });
  }

  // ── Packages ──────────────────────────────────────────────────────────────
  async getPackages(eventId: number): Promise<EventPackage[]> {
    await delay();
    return db.read().packages.filter((p) => p.event_id === eventId).map(packageFromRow);
  }

  async addPackage(eventId: number, input: CreatePackageInput): Promise<void> {
    await delay();
    db.write((d) => {
      const id = d.nextId.pkg++;
      d.packages.unshift({
        id,
        event_id: eventId,
        name: input.name,
        products: input.products,
        discountRate: input.discountRate,
        status: input.status,
        validation: 'green',
      });
    });
  }

  async deletePackage(id: number): Promise<void> {
    await delay();
    db.write((d) => {
      d.packages = d.packages.filter((p) => p.id !== id);
    });
  }

  // ── Campaigns ─────────────────────────────────────────────────────────────
  async getCampaigns(eventId: number): Promise<Campaign[]> {
    await delay();
    return db.read().campaigns.filter((c) => c.event_id === eventId).map(campaignFromRow);
  }

  async addCampaign(eventId: number, input: CreateCampaignInput): Promise<void> {
    await delay();
    db.write((d) => {
      const id = d.nextId.campaign++;
      d.campaigns.push({
        id,
        event_id: eventId,
        name: input.name,
        start_date: input.startDate,
        end_date: input.endDate,
        days: daysBetween(input.startDate, input.endDate),
      });
    });
  }

  async deleteCampaign(id: number): Promise<void> {
    await delay();
    db.write((d) => {
      d.campaigns = d.campaigns.filter((c) => c.id !== id);
    });
  }

  // ── Rooming ───────────────────────────────────────────────────────────────
  async getRooming(eventId: number): Promise<RoomingEntry[]> {
    await delay();
    return db.read().rooming.filter((r) => r.event_id === eventId).map(roomingFromRow);
  }

  async setRoomStatus(id: number, field: RoomStatusField): Promise<void> {
    db.write((d) => {
      const r = d.rooming.find((x) => x.id === id);
      if (!r) return;
      if (field === 'confirmed') {
        r.confirmed = !r.confirmed;
        if (r.confirmed) r.cancelled = false;
      } else {
        r.cancelled = !r.cancelled;
        if (r.cancelled) r.confirmed = false;
      }
    });
  }

  // ── Hotels ────────────────────────────────────────────────────────────────
  async getHotels(eventId: number): Promise<Hotel[]> {
    await delay();
    return db.read().hotels.filter((h) => h.event_id === eventId).map(hotelFromRow);
  }

  async addHotel(eventId: number, input: CreateHotelInput): Promise<void> {
    await delay();
    db.write((d) => {
      const id = d.nextId.hotel++;
      const rooms = (input.single || 0) + (input.double || 0);
      d.hotels.push({
        id,
        event_id: eventId,
        name: input.name,
        priority: input.priority,
        single: input.single || 0,
        double: input.double || 0,
        rooms,
        available: rooms,
        assigned: 0,
        nights: rooms * 3,
      });
    });
  }

  async deleteHotel(id: number): Promise<void> {
    await delay();
    db.write((d) => {
      d.hotels = d.hotels.filter((h) => h.id !== id);
    });
  }

  async getNights(): Promise<Nights> {
    await delay();
    return { ...db.read().nights };
  }

  // ── Vendors ───────────────────────────────────────────────────────────────
  async getVendors(eventId: number): Promise<Vendor[]> {
    await delay();
    return db.read().vendors.filter((v) => v.event_id === eventId).map(vendorFromRow);
  }

  async addVendor(eventId: number, input: CreateVendorInput): Promise<void> {
    await delay();
    db.write((d) => {
      const id = d.nextId.vendor++;
      d.vendors.unshift({ id, event_id: eventId, evaluation: 'No Evaluation', observation: '', ...input });
    });
  }

  async deleteVendor(id: number): Promise<void> {
    await delay();
    db.write((d) => {
      d.vendors = d.vendors.filter((v) => v.id !== id);
    });
  }

  async setVendorEvaluation(id: number, evaluation: VendorEvaluation, observation: string): Promise<void> {
    await delay();
    db.write((d) => {
      const v = d.vendors.find((x) => x.id === id);
      if (v) {
        v.evaluation = evaluation;
        v.observation = observation;
      }
    });
  }

  // ── Invoices ──────────────────────────────────────────────────────────────
  async getInvoices(eventId: number): Promise<Invoice[]> {
    await delay();
    return db.read().invoices.filter((i) => i.event_id === eventId).map(invoiceFromRow);
  }

  async getInvoiceTemplates(): Promise<InvoiceTemplate[]> {
    await delay();
    return db.read().invoiceTemplates.map(invoiceTemplateFromRow);
  }
}
