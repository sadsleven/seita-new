/* Lodging & service-provider sub-entities of an event. */

export interface Hotel {
  id: number;
  eventId: number;
  name: string;
  priority: number;
  single: number;
  double: number;
  rooms: number;
  available: number;
  assigned: number;
  nights: number;
}

export interface CreateHotelInput {
  name: string;
  priority: number;
  single: number;
  double: number;
}

export interface Nights {
  booked: number;
  assigned: number;
  available: number;
  additional: number;
}

export interface RoomingEntry {
  id: number;
  eventId: number;
  name: string;
  plant: string;
  arrival: string;
  departure: string;
  /** Noches asignadas. */
  na: number;
  /** Noches adicionales. */
  addtl: number;
  hotel: string;
  companion: string;
  confirmed: boolean;
  cancelled: boolean;
}

export type RoomStatusField = 'confirmed' | 'cancelled';

export type VendorEvaluation = 'Excellent' | 'Good' | 'Regular' | 'Deficient' | 'No Evaluation';

export interface Vendor {
  id: number;
  eventId: number;
  company: string;
  nick: string;
  country: string;
  industry: string;
  subtypes: string;
  evaluation: VendorEvaluation;
  observation: string;
}

export interface CreateVendorInput {
  company: string;
  nick: string;
  country: string;
  industry: string;
  subtypes: string;
}
