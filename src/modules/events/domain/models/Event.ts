export type EventStatus = 'ACTIVE' | 'FINISHED';

export interface EventSummary {
  id: number;
  name: string;
  shortName: string;
  country: string;
  address: string;
  industries: string[];
  startDate: string;
  endDate: string;
  status: EventStatus;
  daysToStart: number;
  grossIncome: number;
}

export type EventDetail = EventSummary;

/** Collected by the create-event wizard. Only core fields are persisted in the demo. */
export interface CreateEventInput {
  name: string;
  billingPrefix: string;
  billCounter: string;
  country: string;
  address: string;
  numberOfNights: number;
  numberMakers: number;
  startDate: string;
  endDate: string;
  industries: string[];
}

export interface EventStats {
  attendees: number;
  spouses: number;
  presentations: number;
  tableTops: number;
  others: number;
  totalOrders: number;
  plantsRegistered: number;
  grossIncome: number;
  assignedProducts: number;
  paper: number;
  can: number;
  corr: number;
  totalCat: number;
}
