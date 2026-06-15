import type { CatalogItemRow } from '@/lib';
import type { CatalogItem } from '../../domain/models/CatalogItem';

/** Map a raw db row (open-ended Record) to a typed domain CatalogItem. */
export function catalogItemFromRow(row: CatalogItemRow): CatalogItem {
  return {
    id: row.id,
    name: row.name,
    code: typeof row['code'] === 'string' ? row['code'] : undefined,
    subs: typeof row['subs'] === 'string' ? row['subs'] : undefined,
    country: typeof row['country'] === 'string' ? row['country'] : undefined,
  };
}
