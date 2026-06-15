/* Commercial sub-entities sold/managed within an event. */

export type RegistrationType =
  | 'Attendee'
  | 'Technical Presentation'
  | 'Table Top'
  | 'Other';

export interface Registration {
  id: number;
  eventId: number;
  plant: string;
  contact: string;
  type: RegistrationType;
  typeLabel: string;
  spouse: boolean;
  nights: number;
  amount: number;
  category: string;
  categoryLabel: string;
}

export interface CreateRegistrationInput {
  plant: string;
  contact: string;
  type: RegistrationType;
  typeLabel: string;
  spouse: boolean;
  nights: number;
  amount: number;
  category: string;
  categoryLabel: string;
}

/** Minimal plant info the registration form needs (the legacy reads the plant directory). */
export interface RegistrablePlant {
  companyName: string;
  contact: string;
  industry: string;
}

export interface EventProduct {
  id: number;
  eventId: number;
  name: string;
  types: string[];
  price: number;
  description: string;
}

export interface CreateEventProductInput {
  name: string;
  types: string[];
  price: number;
  description: string;
}

export type PackageValidation = 'green' | 'yellow' | 'red';

export interface EventPackage {
  id: number;
  eventId: number;
  name: string;
  products: number;
  discountRate: number;
  status: boolean;
  validation: PackageValidation;
}

export interface CreatePackageInput {
  name: string;
  products: number;
  discountRate: number;
  status: boolean;
}

export interface Campaign {
  id: number;
  eventId: number;
  name: string;
  startDate: string;
  endDate: string;
  days: number;
}

export interface CreateCampaignInput {
  name: string;
  startDate: string;
  endDate: string;
}

export type CampaignPhase = 'En curso' | 'Próxima' | 'Finalizada';

export interface Invoice {
  id: number;
  eventId: number;
  number: string;
  plant: string;
  date: string;
  amount: number;
  status: string;
}

export interface InvoiceTemplate {
  id: number;
  name: string;
  address: string;
  phone: string;
  paymentInstructions: string;
}
