import { http } from '@/lib';
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

/** Production events gateway over HTTP. Same interface as the storage gateway. */
export class EventsHttpGateway implements EventsGateway {
  async list() {
    return (await http.get<EventSummary[]>('/events')).data;
  }
  async getById(id: number) {
    return (await http.get<EventDetail | null>(`/events/${id}`)).data;
  }
  async create(input: CreateEventInput) {
    return (await http.post<{ id: number }>('/events', input)).data.id;
  }
  async delete(id: number) {
    await http.delete(`/events/${id}`);
  }
  async getStats(eventId: number) {
    return (await http.get<EventStats>(`/events/${eventId}/stats`)).data;
  }

  async getRegistrablePlants() {
    return (await http.get<RegistrablePlant[]>('/registrable-plants')).data;
  }
  async getRegistrations(eventId: number) {
    return (await http.get<Registration[]>(`/events/${eventId}/registrations`)).data;
  }
  async addRegistration(eventId: number, input: CreateRegistrationInput) {
    await http.post(`/events/${eventId}/registrations`, input);
  }
  async deleteRegistration(id: number) {
    await http.delete(`/registrations/${id}`);
  }

  async getProducts(eventId: number) {
    return (await http.get<EventProduct[]>(`/events/${eventId}/products`)).data;
  }
  async addProduct(eventId: number, input: CreateEventProductInput) {
    await http.post(`/events/${eventId}/products`, input);
  }
  async deleteProduct(id: number) {
    await http.delete(`/products/${id}`);
  }

  async getPackages(eventId: number) {
    return (await http.get<EventPackage[]>(`/events/${eventId}/packages`)).data;
  }
  async addPackage(eventId: number, input: CreatePackageInput) {
    await http.post(`/events/${eventId}/packages`, input);
  }
  async deletePackage(id: number) {
    await http.delete(`/packages/${id}`);
  }

  async getCampaigns(eventId: number) {
    return (await http.get<Campaign[]>(`/events/${eventId}/campaigns`)).data;
  }
  async addCampaign(eventId: number, input: CreateCampaignInput) {
    await http.post(`/events/${eventId}/campaigns`, input);
  }
  async deleteCampaign(id: number) {
    await http.delete(`/campaigns/${id}`);
  }

  async getRooming(eventId: number) {
    return (await http.get<RoomingEntry[]>(`/events/${eventId}/rooming`)).data;
  }
  async setRoomStatus(id: number, field: RoomStatusField) {
    await http.patch(`/rooming/${id}`, { field });
  }

  async getHotels(eventId: number) {
    return (await http.get<Hotel[]>(`/events/${eventId}/hotels`)).data;
  }
  async addHotel(eventId: number, input: CreateHotelInput) {
    await http.post(`/events/${eventId}/hotels`, input);
  }
  async deleteHotel(id: number) {
    await http.delete(`/hotels/${id}`);
  }
  async getNights() {
    return (await http.get<Nights>('/nights')).data;
  }

  async getVendors(eventId: number) {
    return (await http.get<Vendor[]>(`/events/${eventId}/vendors`)).data;
  }
  async addVendor(eventId: number, input: CreateVendorInput) {
    await http.post(`/events/${eventId}/vendors`, input);
  }
  async deleteVendor(id: number) {
    await http.delete(`/vendors/${id}`);
  }
  async setVendorEvaluation(id: number, evaluation: VendorEvaluation, observation: string) {
    await http.patch(`/vendors/${id}/evaluation`, { evaluation, observation });
  }

  async getInvoices(eventId: number) {
    return (await http.get<Invoice[]>(`/events/${eventId}/invoices`)).data;
  }
  async getInvoiceTemplates() {
    return (await http.get<InvoiceTemplate[]>('/invoice-templates')).data;
  }
}
