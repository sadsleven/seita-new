import type {
  CreateEventInput,
  EventDetail,
  EventStats,
  EventSummary,
} from './models/Event';
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
} from './models/EventResources';
import type {
  CreateHotelInput,
  CreateVendorInput,
  Hotel,
  Nights,
  RoomStatusField,
  RoomingEntry,
  Vendor,
  VendorEvaluation,
} from './models/Logistics';

/**
 * One gateway for the whole event domain (events + all event-scoped
 * sub-resources). Implemented by infrastructure for localStorage or HTTP.
 */
export interface EventsGateway {
  // Events
  list(): Promise<EventSummary[]>;
  getById(id: number): Promise<EventDetail | null>;
  create(input: CreateEventInput): Promise<number>;
  delete(id: number): Promise<void>;
  getStats(eventId: number): Promise<EventStats>;

  // Registration / orders
  getRegistrablePlants(): Promise<RegistrablePlant[]>;
  getRegistrations(eventId: number): Promise<Registration[]>;
  addRegistration(eventId: number, input: CreateRegistrationInput): Promise<void>;
  deleteRegistration(id: number): Promise<void>;

  // Products
  getProducts(eventId: number): Promise<EventProduct[]>;
  addProduct(eventId: number, input: CreateEventProductInput): Promise<void>;
  deleteProduct(id: number): Promise<void>;

  // Packages
  getPackages(eventId: number): Promise<EventPackage[]>;
  addPackage(eventId: number, input: CreatePackageInput): Promise<void>;
  deletePackage(id: number): Promise<void>;

  // Campaigns
  getCampaigns(eventId: number): Promise<Campaign[]>;
  addCampaign(eventId: number, input: CreateCampaignInput): Promise<void>;
  deleteCampaign(id: number): Promise<void>;

  // Rooming
  getRooming(eventId: number): Promise<RoomingEntry[]>;
  setRoomStatus(id: number, field: RoomStatusField): Promise<void>;

  // Hotels
  getHotels(eventId: number): Promise<Hotel[]>;
  addHotel(eventId: number, input: CreateHotelInput): Promise<void>;
  deleteHotel(id: number): Promise<void>;
  getNights(): Promise<Nights>;

  // Vendors
  getVendors(eventId: number): Promise<Vendor[]>;
  addVendor(eventId: number, input: CreateVendorInput): Promise<void>;
  deleteVendor(id: number): Promise<void>;
  setVendorEvaluation(id: number, evaluation: VendorEvaluation, observation: string): Promise<void>;

  // Invoices
  getInvoices(eventId: number): Promise<Invoice[]>;
  getInvoiceTemplates(): Promise<InvoiceTemplate[]>;
}
