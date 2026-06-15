import { daysTo } from '@/lib';
import type {
  EventRow,
  OrderRow,
  EventProductRow,
  PackageRow,
  CampaignRow,
  RoomingRow,
  HotelRow,
  VendorRow,
  InvoiceRow,
  InvoiceTemplateRow,
} from '@/lib';
import type { EventSummary } from '../../domain/models/Event';
import type {
  Campaign,
  EventPackage,
  EventProduct,
  Invoice,
  InvoiceTemplate,
  Registration,
  RegistrationType,
} from '../../domain/models/EventResources';
import type { Hotel, RoomingEntry, Vendor, VendorEvaluation } from '../../domain/models/Logistics';

export const TYPE_LABEL: Record<string, string> = {
  Attendee: 'Asistente',
  'Technical Presentation': 'Presentación Técnica',
  'Table Top': 'Mesa',
  Other: 'Otro',
};
export const CATEGORY_LABEL: Record<string, string> = { Paper: 'Papel', Can: 'Lata', Corr: 'Corr' };

export const eventFromRow = (r: EventRow): EventSummary => ({
  id: r.id,
  name: r.name,
  shortName: r.shortName,
  country: r.country,
  address: r.address,
  industries: r.industries,
  startDate: r.start_date,
  endDate: r.end_date,
  status: r.status,
  daysToStart: daysTo(r.start_date),
  grossIncome: r.gross_income,
});

export const registrationFromRow = (r: OrderRow): Registration => ({
  id: r.id,
  eventId: r.event_id,
  plant: r.plant,
  contact: r.contact,
  type: r.type as RegistrationType,
  typeLabel: TYPE_LABEL[r.type] ?? r.type,
  spouse: r.spouse,
  nights: r.nights,
  amount: r.amount,
  category: r.category,
  categoryLabel: CATEGORY_LABEL[r.category] ?? r.category,
});

export const productFromRow = (r: EventProductRow): EventProduct => ({
  id: r.id,
  eventId: r.event_id,
  name: r.name,
  types: r.types,
  price: r.price,
  description: r.description,
});

export const packageFromRow = (r: PackageRow): EventPackage => ({
  id: r.id,
  eventId: r.event_id,
  name: r.name,
  products: r.products,
  discountRate: r.discountRate,
  status: r.status,
  validation: r.validation,
});

export const campaignFromRow = (r: CampaignRow): Campaign => ({
  id: r.id,
  eventId: r.event_id,
  name: r.name,
  startDate: r.start_date,
  endDate: r.end_date,
  days: r.days,
});

export const roomingFromRow = (r: RoomingRow): RoomingEntry => ({
  id: r.id,
  eventId: r.event_id,
  name: r.name,
  plant: r.plant,
  arrival: r.arrival,
  departure: r.departure,
  na: r.na,
  addtl: r.addtl,
  hotel: r.hotel,
  companion: r.companion,
  confirmed: r.confirmed,
  cancelled: r.cancelled,
});

export const hotelFromRow = (r: HotelRow): Hotel => ({
  id: r.id,
  eventId: r.event_id,
  name: r.name,
  priority: r.priority,
  single: r.single,
  double: r.double,
  rooms: r.rooms,
  available: r.available,
  assigned: r.assigned,
  nights: r.nights,
});

export const vendorFromRow = (r: VendorRow): Vendor => ({
  id: r.id,
  eventId: r.event_id,
  company: r.company,
  nick: r.nick,
  country: r.country,
  industry: r.industry,
  subtypes: r.subtypes,
  evaluation: r.evaluation as VendorEvaluation,
  observation: r.observation,
});

export const invoiceFromRow = (r: InvoiceRow): Invoice => ({
  id: r.id,
  eventId: r.event_id,
  number: r.number,
  plant: r.plant,
  date: r.date,
  amount: r.amount,
  status: r.status,
});

export const invoiceTemplateFromRow = (r: InvoiceTemplateRow): InvoiceTemplate => ({
  id: r.id,
  name: r.name,
  address: r.address,
  phone: r.phone,
  paymentInstructions: r.payment_instructions,
});
