/* ════════════════════════════════════════════════════════════════════════
   SEITA demo persistence — a single seeded localStorage database.

   This is shared infrastructure (lib/), not a module. It owns the raw row
   schema (snake_case, mirrors the legacy data store) and seeds realistic
   paper-industry congress data on first run. Each module's StorageGateway
   reads its slice through `db` and maps rows → its own domain models, so the
   domain layer never sees this shape.
   ════════════════════════════════════════════════════════════════════════ */
import { addDays } from './format';

/* ── Raw row schema (the demo "DTO" layer) ─────────────────────────────── */
export interface AccountRow {
  first_name: string;
  last_name: string;
  role: string;
  initials: string;
}
export interface EventRow {
  id: number;
  name: string;
  shortName: string;
  country: string;
  address: string;
  industries: string[];
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'FINISHED';
  gross_income: number;
}
export interface PlantRow {
  id: number;
  company_name: string;
  nick_name: string;
  type: string;
  country: string;
  city: string;
  industry: string;
  sub_industry: string;
  contact: string;
  email: string;
  phone: string;
  tax_id: string;
  invoice_name: string;
  web: string;
  source: string;
  association: string;
  status: string;
}
export interface ContactRow {
  id: number;
  plant_id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  main: boolean;
}
export interface OrderRow {
  id: number;
  event_id: number;
  plant: string;
  contact: string;
  type: string;
  spouse: boolean;
  nights: number;
  amount: number;
  category: string;
}
export interface HotelRow {
  id: number;
  event_id: number;
  name: string;
  priority: number;
  single: number;
  double: number;
  rooms: number;
  available: number;
  assigned: number;
  nights: number;
}
export interface VendorRow {
  id: number;
  event_id: number;
  company: string;
  nick: string;
  country: string;
  industry: string;
  subtypes: string;
  evaluation: string;
  observation: string;
}
export interface UserRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
}
export interface NoteRow {
  id: string;
  author: string;
  date: string;
  text: string;
}
export interface EventProductRow {
  id: number;
  event_id: number;
  name: string;
  types: string[];
  price: number;
  description: string;
}
export interface PackageRow {
  id: number;
  event_id: number;
  name: string;
  products: number;
  discountRate: number;
  status: boolean;
  validation: 'green' | 'yellow' | 'red';
}
export interface CampaignRow {
  id: number;
  event_id: number;
  name: string;
  start_date: string;
  end_date: string;
  days: number;
}
export interface RoomingRow {
  id: number;
  event_id: number;
  name: string;
  plant: string;
  arrival: string;
  departure: string;
  na: number;
  addtl: number;
  hotel: string;
  companion: string;
  confirmed: boolean;
  cancelled: boolean;
}
export interface InvoiceRow {
  id: number;
  event_id: number;
  number: string;
  plant: string;
  date: string;
  amount: number;
  status: string;
}
export interface InvoiceTemplateRow {
  id: number;
  name: string;
  address: string;
  phone: string;
  payment_instructions: string;
}
export interface CatalogItemRow {
  id: number;
  name: string;
  [key: string]: unknown;
}
export interface SettingsRow {
  notesVisible: boolean;
  density: 'comfortable' | 'compact';
}

export interface DemoDb {
  account: AccountRow;
  events: EventRow[];
  plants: PlantRow[];
  contacts: ContactRow[];
  catalogs: Record<string, CatalogItemRow[]>;
  products: { id: number; name: string; description: string; availableFor: string[] }[];
  orders: OrderRow[];
  hotels: HotelRow[];
  nights: { booked: number; assigned: number; available: number; additional: number };
  vendors: VendorRow[];
  users: UserRow[];
  notes: { general: NoteRow[]; mine: NoteRow[] };
  settings: SettingsRow;
  eventProducts: EventProductRow[];
  packages: PackageRow[];
  campaigns: CampaignRow[];
  rooming: RoomingRow[];
  invoices: InvoiceRow[];
  invoiceTemplates: InvoiceTemplateRow[];
  nextId: Record<string, number>;
}

const KEY = 'seita_web_v1';

/* ── Seed (realistic paper / pulp / tissue congress data) ──────────────── */
function createSeed(): DemoDb {
  return {
    account: { first_name: 'Julia', last_name: 'Marín', role: 'Administrador General', initials: 'JM' },
    events: [
      { id: 1, name: 'Latin America Paper & Tissue Congress', shortName: 'LATAM Paper 2026', country: 'Mexico', address: 'Hotel Camino Real, Mexico City', industries: ['Paper Mills', 'Tissue'], start_date: addDays(8), end_date: addDays(11), status: 'ACTIVE', gross_income: 184200 },
      { id: 2, name: 'Tissue World São Paulo', shortName: 'Tissue World SP', country: 'Brazil', address: 'Expo Center Norte, São Paulo', industries: ['Tissue', 'Pulp'], start_date: addDays(26), end_date: addDays(28), status: 'ACTIVE', gross_income: 96400 },
      { id: 3, name: 'Pack Expo Americas', shortName: 'Pack Expo', country: 'United States', address: 'McCormick Place, Chicago', industries: ['Packaging', 'Corrugated'], start_date: addDays(63), end_date: addDays(66), status: 'ACTIVE', gross_income: 41000 },
      { id: 4, name: 'Andean Pulp Summit 2025', shortName: 'Andean Pulp', country: 'Chile', address: 'Hotel W, Santiago', industries: ['Pulp'], start_date: addDays(-40), end_date: addDays(-38), status: 'FINISHED', gross_income: 152300 },
    ],
    plants: [
      { id: 1, company_name: 'Northmill Paper Co.', nick_name: 'Northmill', type: 'Molino Integrado', country: 'México', city: 'Monterrey', industry: 'Molinos de Papel', sub_industry: 'Papel para Imprenta', contact: 'Carlos Ruiz', email: 'cruiz@northmill.mx', phone: '+52 81 8123 4567', tax_id: 'NOR920305AB1', invoice_name: 'Northmill Paper S.A. de C.V.', web: 'https://northmill.mx', source: 'Feria PaperWeek', association: 'ANFPP', status: 'Activa' },
      { id: 2, company_name: 'Celulosa del Pacífico', nick_name: 'CelPac', type: 'Molino de Celulosa', country: 'Chile', city: 'Concepción', industry: 'Celulosa', sub_industry: 'Fibra Larga', contact: 'Ana Gómez', email: 'agomez@celpac.cl', phone: '+56 41 234 5678', tax_id: '76.123.456-7', invoice_name: 'Celulosa del Pacífico SpA', web: 'https://celpac.cl', source: 'Referido', association: 'APROCEL', status: 'Activa' },
      { id: 3, company_name: 'TissuePro Brasil', nick_name: 'TissuePro', type: 'Convertidor Tissue', country: 'Brasil', city: 'Curitiba', industry: 'Tissue', sub_industry: 'Higiénico', contact: 'João Silva', email: 'joao@tissuepro.br', phone: '+55 41 3322 1100', tax_id: '12.345.678/0001-90', invoice_name: 'TissuePro Indústria Ltda', web: 'https://tissuepro.com.br', source: 'Sitio web', association: 'ABTCP', status: 'Activa' },
      { id: 4, company_name: 'CartonBox Americas', nick_name: 'CartonBox', type: 'Planta de Corrugado', country: 'Estados Unidos', city: 'Chicago', industry: 'Empaque', sub_industry: 'Corrugado', contact: 'Mary Johnson', email: 'mary@cartonbox.com', phone: '+1 312 555 0199', tax_id: '36-4855120', invoice_name: 'CartonBox Americas Inc.', web: 'https://cartonbox.com', source: 'Feria Pack Expo', association: 'AICC', status: 'Activa' },
      { id: 5, company_name: 'Papelera Andina', nick_name: 'Andina', type: 'Molino Integrado', country: 'Perú', city: 'Lima', industry: 'Molinos de Papel', sub_industry: 'Papel Kraft', contact: 'Luis Fernández', email: 'lfernandez@andina.pe', phone: '+51 1 612 3400', tax_id: '20123456789', invoice_name: 'Papelera Andina S.A.C.', web: 'https://andina.pe', source: 'Referido', association: 'ANFPP', status: 'Activa' },
      { id: 6, company_name: 'GreenFiber Recycling', nick_name: 'GreenFiber', type: 'Fibra Reciclada', country: 'México', city: 'Guadalajara', industry: 'Celulosa', sub_industry: 'Fibra Reciclada', contact: 'Sofía Torres', email: 'storres@greenfiber.mx', phone: '+52 33 3777 8800', tax_id: 'GRE150620XY2', invoice_name: 'GreenFiber Reciclados S.A.', web: 'https://greenfiber.mx', source: 'Campaña email', association: 'ANFPP', status: 'Prospecto' },
    ],
    contacts: [
      { id: 1, plant_id: 1, name: 'Carlos Ruiz', position: 'Director General', email: 'cruiz@northmill.mx', phone: '+52 81 8123 4567', main: true },
      { id: 2, plant_id: 1, name: 'Elena Vargas', position: 'Gerente de Compras', email: 'evargas@northmill.mx', phone: '+52 81 8123 4570', main: false },
      { id: 3, plant_id: 2, name: 'Ana Gómez', position: 'Gerente Comercial', email: 'agomez@celpac.cl', phone: '+56 41 234 5678', main: true },
      { id: 4, plant_id: 3, name: 'João Silva', position: 'Director de Operaciones', email: 'joao@tissuepro.br', phone: '+55 41 3322 1100', main: true },
      { id: 5, plant_id: 4, name: 'Mary Johnson', position: 'VP de Ventas', email: 'mary@cartonbox.com', phone: '+1 312 555 0199', main: true },
      { id: 6, plant_id: 4, name: 'Robert King', position: 'Coordinador de Eventos', email: 'rking@cartonbox.com', phone: '+1 312 555 0205', main: false },
      { id: 7, plant_id: 5, name: 'Luis Fernández', position: 'Gerente de Planta', email: 'lfernandez@andina.pe', phone: '+51 1 612 3400', main: true },
      { id: 8, plant_id: 6, name: 'Sofía Torres', position: 'Fundadora', email: 'storres@greenfiber.mx', phone: '+52 33 3777 8800', main: true },
    ],
    catalogs: {
      countries: [
        { id: 1, name: 'México', code: 'MX' }, { id: 2, name: 'Estados Unidos', code: 'US' },
        { id: 3, name: 'Brasil', code: 'BR' }, { id: 4, name: 'Chile', code: 'CL' },
        { id: 5, name: 'Perú', code: 'PE' }, { id: 6, name: 'Canadá', code: 'CA' },
      ],
      industries: [
        { id: 1, name: 'CAN', description: 'MANUFACTURING INDUSTRY' },
        { id: 2, name: 'PAPER', description: 'PAPER INDUSTRY' },
        { id: 3, name: 'CORR', description: 'BOX MANUFACTURING INDUSTRY' },
      ],
      plantTypes: [
        { id: 1, name: 'MAKERS', description: '' },
        { id: 2, name: 'SUPPLIERS', description: '' },
        { id: 3, name: 'MEDIA', description: '' },
        { id: 4, name: 'ORGANIZERS', description: '' },
        { id: 5, name: 'VENDORS', description: '' },
      ],
      sources: [
        { id: 1, name: 'Feria PaperWeek' }, { id: 2, name: 'Referido' },
        { id: 3, name: 'Sitio web' }, { id: 4, name: 'Campaña email' }, { id: 5, name: 'Feria Pack Expo' },
      ],
      associations: [
        { id: 1, name: 'ANFPP', country: 'México' }, { id: 2, name: 'APROCEL', country: 'Chile' },
        { id: 3, name: 'ABTCP', country: 'Brasil' }, { id: 4, name: 'AICC', country: 'Estados Unidos' },
      ],
    },
    products: [
      { id: 1, name: 'ATTENDEES', description: 'Standard description Attendees', availableFor: ['MAKERS', 'SUPPLIERS', 'MEDIA', 'ORGANIZERS', 'VENDORS'] },
      { id: 2, name: 'COMPANION', description: 'Standard description Companion', availableFor: ['MAKERS', 'SUPPLIERS', 'MEDIA', 'ORGANIZERS', 'VENDORS'] },
      { id: 3, name: 'OTHERS', description: 'Standard description Others', availableFor: ['MAKERS', 'SUPPLIERS', 'MEDIA', 'ORGANIZERS', 'VENDORS'] },
      { id: 4, name: 'TABLETOP', description: 'Standard description Table Top', availableFor: ['SUPPLIERS', 'ORGANIZERS', 'MEDIA'] },
      { id: 5, name: 'Technical presentation', description: 'Standard description Technical Presentation', availableFor: ['SUPPLIERS', 'ORGANIZERS', 'MAKERS', 'MEDIA'] },
    ],
    orders: [
      { id: 1, event_id: 1, plant: 'Northmill Paper Co.', contact: 'Carlos Ruiz', type: 'Attendee', spouse: true, nights: 3, amount: 1200, category: 'Paper' },
      { id: 2, event_id: 1, plant: 'Papelera Andina', contact: 'Luis Fernández', type: 'Technical Presentation', spouse: false, nights: 3, amount: 2400, category: 'Paper' },
      { id: 3, event_id: 1, plant: 'CartonBox Americas', contact: 'Mary Johnson', type: 'Table Top', spouse: true, nights: 2, amount: 1800, category: 'Corr' },
      { id: 4, event_id: 1, plant: 'GreenFiber Recycling', contact: 'Sofía Torres', type: 'Attendee', spouse: false, nights: 4, amount: 1100, category: 'Can' },
      { id: 5, event_id: 2, plant: 'TissuePro Brasil', contact: 'João Silva', type: 'Attendee', spouse: true, nights: 2, amount: 1300, category: 'Paper' },
    ],
    hotels: [
      { id: 1, event_id: 1, name: 'Hotel Camino Real', priority: 1, single: 60, double: 60, rooms: 120, available: 38, assigned: 82, nights: 360 },
      { id: 2, event_id: 1, name: 'Hyatt Regency', priority: 2, single: 50, double: 30, rooms: 80, available: 25, assigned: 55, nights: 220 },
    ],
    nights: { booked: 14, assigned: 12, available: 568, additional: 2 },
    vendors: [
      { id: 1, event_id: 1, company: 'AV Pro Solutions', nick: 'AVPro', country: 'México', industry: 'Audiovisual', subtypes: 'Sonido, Iluminación', evaluation: 'Excellent', observation: 'Montaje impecable y puntual en la edición anterior.' },
      { id: 2, event_id: 1, company: 'Banquetes del Valle', nick: 'Del Valle', country: 'México', industry: 'Catering', subtypes: 'Coffee break, Cena de gala', evaluation: 'Good', observation: 'Buen servicio; mejorar variedad vegetariana.' },
      { id: 3, event_id: 1, company: 'Stand Builders Co.', nick: 'StandCo', country: 'Estados Unidos', industry: 'Mobiliario', subtypes: 'Stands, Mamparas', evaluation: 'No Evaluation', observation: '' },
      { id: 4, event_id: 1, company: 'Logística Express', nick: 'LogiX', country: 'México', industry: 'Logística', subtypes: 'Transporte, Aduanas', evaluation: 'Regular', observation: 'Retrasos en la entrega de material promocional.' },
    ],
    users: [
      { id: 1, first_name: 'Julia', last_name: 'Marín', email: 'julia.marin@intertech.com', role: 'Administrador General', status: 'Activo' },
      { id: 2, first_name: 'Andrés', last_name: 'Soto', email: 'asoto@intertech.com', role: 'Gestor de Evento', status: 'Activo' },
      { id: 3, first_name: 'Patricia', last_name: 'Lima', email: 'plima@intertech.com', role: 'Auditor', status: 'Activo' },
      { id: 4, first_name: 'Roberto', last_name: 'Díaz', email: 'rdiaz@intertech.com', role: 'Gestor de Evento', status: 'Inactivo' },
    ],
    notes: {
      general: [
        { id: 'g1', author: 'Admin', date: '2026-05-15', text: 'Confirmar bloque de habitaciones con el Hotel Camino Real antes de fin de mes.' },
        { id: 'g2', author: 'Admin', date: '2026-06-02', text: 'Revisar la lista de plantas participantes del congreso LATAM Paper 2026.' },
      ],
      mine: [
        { id: 'm1', author: 'Yo', date: '2026-06-10', text: 'Llamar a Northmill Paper para coordinar su presentación técnica.' },
        { id: 'm2', author: 'Yo', date: '2026-06-12', text: 'Enviar facturas pendientes de Tissue World São Paulo.' },
      ],
    },
    settings: { notesVisible: true, density: 'comfortable' },
    eventProducts: [
      { id: 1, event_id: 1, name: 'Stand de Exhibición 3x3', types: ['Plantas', 'Patrocinadores'], price: 3500, description: 'Espacio de exhibición con mampara, iluminación y mobiliario básico.' },
      { id: 2, event_id: 1, name: 'Slot de Presentación Técnica', types: ['Plantas'], price: 2400, description: '30 minutos en sala plenaria con equipo audiovisual.' },
      { id: 3, event_id: 1, name: 'Patrocinio Oro', types: ['Patrocinadores'], price: 12000, description: 'Logo en escenario, programa impreso y lanyards.' },
      { id: 4, event_id: 1, name: 'Pase de Conferencia', types: ['Plantas', 'Acompañantes'], price: 800, description: 'Acceso a todas las sesiones y comidas.' },
      { id: 5, event_id: 2, name: 'Stand de Exhibición 3x3', types: ['Plantas'], price: 3200, description: 'Espacio de exhibición estándar.' },
    ],
    packages: [
      { id: 1, event_id: 1, name: 'Paquete Expositor', products: 3, discountRate: 10, status: true, validation: 'green' },
      { id: 2, event_id: 1, name: 'Paquete Patrocinador Oro', products: 4, discountRate: 15, status: true, validation: 'yellow' },
      { id: 3, event_id: 1, name: 'Paquete Básico', products: 2, discountRate: 5, status: false, validation: 'red' },
    ],
    campaigns: [
      { id: 1, event_id: 1, name: 'Preventa Temprana', start_date: addDays(-30), end_date: addDays(-5), days: 25 },
      { id: 2, event_id: 1, name: 'Tarifa Regular', start_date: addDays(-4), end_date: addDays(5), days: 9 },
      { id: 3, event_id: 1, name: 'Última Llamada', start_date: addDays(6), end_date: addDays(7), days: 1 },
    ],
    rooming: [
      { id: 1, event_id: 1, name: 'Carlos Ruiz', plant: 'Northmill Paper Co.', arrival: addDays(7), departure: addDays(10), na: 3, addtl: 0, hotel: 'Hotel Camino Real', companion: '—', confirmed: true, cancelled: false },
      { id: 2, event_id: 1, name: 'Luis Fernández', plant: 'Papelera Andina', arrival: addDays(7), departure: addDays(11), na: 3, addtl: 1, hotel: 'Hyatt Regency', companion: '—', confirmed: true, cancelled: false },
      { id: 3, event_id: 1, name: 'Mary Johnson', plant: 'CartonBox Americas', arrival: addDays(8), departure: addDays(10), na: 2, addtl: 0, hotel: 'Hotel Camino Real', companion: 'John Johnson', confirmed: false, cancelled: false },
      { id: 4, event_id: 1, name: 'Sofía Torres', plant: 'GreenFiber Recycling', arrival: addDays(7), departure: addDays(11), na: 4, addtl: 0, hotel: 'Hyatt Regency', companion: '—', confirmed: false, cancelled: false },
    ],
    invoices: [
      { id: 1, event_id: 1, number: 'INV-2026-0142', plant: 'Northmill Paper Co.', date: addDays(-12), amount: 5900, status: 'Pagada' },
      { id: 2, event_id: 1, number: 'INV-2026-0143', plant: 'Papelera Andina', date: addDays(-8), amount: 2400, status: 'Pagada' },
      { id: 3, event_id: 1, number: 'INV-2026-0144', plant: 'CartonBox Americas', date: addDays(-3), amount: 1800, status: 'Pendiente' },
      { id: 4, event_id: 1, number: 'INV-2026-0145', plant: 'GreenFiber Recycling', date: addDays(-1), amount: 1100, status: 'Pendiente' },
    ],
    invoiceTemplates: [
      { id: 1, name: 'InterTech Americas, Corp', address: '1450 Brickell Ave, Miami, FL 33131', phone: '+1 305 555 0142', payment_instructions: 'Transferencia a Bank of America, cuenta No. 0042-1188-7720.' },
      { id: 2, name: 'InterTech México, S.A.', address: 'Av. Paseo de la Reforma 222, CDMX', phone: '+52 55 1234 5678', payment_instructions: 'Pago a 30 días vía SPEI a CLABE 0021 8000 1234 5678.' },
    ],
    nextId: { event: 5, plant: 7, order: 6, user: 5, eproduct: 6, pkg: 4, campaign: 4, contact: 9, cat: 100, hotel: 3, vendor: 5 },
  };
}

/* ── Engine ────────────────────────────────────────────────────────────── */
const listeners = new Set<() => void>();
let cache: DemoDb | null = null;

function load(): DemoDb {
  const seed = createSeed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as DemoDb;
      // Merge in keys added since this browser last saved, so older cached
      // data never crashes newer screens.
      const merge = saved as unknown as Record<string, unknown>;
      for (const k of Object.keys(seed) as (keyof DemoDb)[]) {
        if (saved[k] === undefined) merge[k] = seed[k];
      }
      for (const sk of Object.keys(seed.nextId)) {
        if (saved.nextId[sk] === undefined) saved.nextId[sk] = seed.nextId[sk];
      }
      return saved;
    }
  } catch {
    /* fall through to fresh seed */
  }
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

function read(): DemoDb {
  if (!cache) cache = load();
  return cache;
}

function persist(): void {
  if (cache) localStorage.setItem(KEY, JSON.stringify(cache));
}

function emit(): void {
  listeners.forEach((fn) => fn());
}

export const db = {
  /** Read the (mutable) in-memory database. Treat as read-only outside write(). */
  read,

  /** Apply a mutation, persist, and notify subscribers. Returns the mutator result. */
  write<T>(mutator: (database: DemoDb) => T): T {
    const result = mutator(read());
    persist();
    emit();
    return result;
  },

  /** Grab the next id for a sequence (e.g. 'event', 'plant') and advance it. */
  nextId(sequence: string): number {
    return this.write((d) => {
      if (d.nextId[sequence] === undefined) d.nextId[sequence] = 1;
      return d.nextId[sequence]++;
    });
  },

  /** Subscribe to any write; returns an unsubscribe fn. */
  subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  /** Wipe persisted data and re-seed. */
  reset(): void {
    localStorage.removeItem(KEY);
    cache = load();
    persist();
    emit();
  },
};

/** Simulate network latency so the demo's loading states are visible. */
export const delay = (ms = 140): Promise<void> => new Promise((r) => setTimeout(r, ms));

/** Deep-clone a row so callers never mutate the live cache by reference. */
export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
