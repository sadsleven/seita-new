/* ════════════════════════════════════════════════════════════════════════
   Static reference catalogs.

   Industries and plant types are FIXED for now (single source of truth shared
   by every screen: catalogs, create event, create plant, product types). They
   are intentionally not user-editable yet — sub-industries / sub-types exist in
   the real domain but are deferred.
   ════════════════════════════════════════════════════════════════════════ */

export interface IndustryDef {
  name: string;
  description: string;
}

/** The 3 fixed industries. */
export const INDUSTRIES: IndustryDef[] = [
  { name: 'CAN', description: 'MANUFACTURING INDUSTRY' },
  { name: 'PAPER', description: 'PAPER INDUSTRY' },
  { name: 'CORR', description: 'BOX MANUFACTURING INDUSTRY' },
];

/** Industry names only — for option lists. */
export const INDUSTRY_NAMES: string[] = INDUSTRIES.map((i) => i.name);

/** The 5 fixed plant types. */
export const PLANT_TYPES: string[] = ['MAKERS', 'SUPPLIERS', 'MEDIA', 'ORGANIZERS', 'VENDORS'];
