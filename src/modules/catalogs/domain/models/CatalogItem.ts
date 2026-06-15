/** The five catalog dimensions managed on /catalogos. */
export type CatalogName = 'countries' | 'industries' | 'plantTypes' | 'sources' | 'associations';

export interface CatalogItem {
  id: number;
  name: string;
  /** ISO 2-letter code — only present for `countries`. */
  code?: string;
  /** Comma-separated sub-industry list — only present for `industries`. */
  subs?: string;
  /** Country name — only present for `associations`. */
  country?: string;
}
