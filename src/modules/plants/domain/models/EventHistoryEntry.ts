/** One participation record in a plant's event history. */
export interface EventHistoryEntry {
  id: number;
  event: string;
  date: string;
  type: string;
  amount: number;
}
