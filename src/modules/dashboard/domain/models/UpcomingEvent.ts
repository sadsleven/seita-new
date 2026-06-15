/** Lightweight view of the next event, owned by the dashboard. */
export interface UpcomingEvent {
  id: number;
  name: string;
  shortName: string;
  country: string;
  address: string;
  startDate: string;
  endDate: string;
  daysToStart: number;
  status: 'ACTIVE' | 'FINISHED';
}
