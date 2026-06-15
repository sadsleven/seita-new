import type { PlantRow, ContactRow } from '@/lib';
import type { Plant, CreatePlantInput } from '../../domain/models/Plant';
import type { Contact, CreateContactInput } from '../../domain/models/Contact';

export const plantFromRow = (row: PlantRow): Plant => ({
  id: row.id,
  companyName: row.company_name,
  nickName: row.nick_name,
  type: row.type,
  country: row.country,
  city: row.city,
  industry: row.industry,
  subIndustry: row.sub_industry,
  contact: row.contact,
  email: row.email,
  phone: row.phone,
  taxId: row.tax_id,
  invoiceName: row.invoice_name,
  web: row.web,
  source: row.source,
  association: row.association,
  status: row.status,
});

export const plantInputToRow = (
  input: CreatePlantInput,
  id: number,
): PlantRow => ({
  id,
  company_name: input.companyName,
  nick_name: input.nickName ?? '',
  type: input.type,
  country: input.country,
  city: input.city ?? '',
  industry: input.industry,
  sub_industry: '',
  contact: '',
  email: input.email ?? '',
  phone: input.phone ?? '',
  tax_id: input.taxId ?? '',
  invoice_name: input.invoiceName ?? '',
  web: input.web ?? '',
  source: input.source ?? '',
  association: input.association ?? '',
  status: 'Activa',
});

export const contactFromRow = (row: ContactRow): Contact => ({
  id: row.id,
  plantId: row.plant_id,
  name: row.name,
  position: row.position,
  email: row.email,
  phone: row.phone,
  main: row.main,
});

export const contactInputToRow = (
  input: CreateContactInput,
  id: number,
  plantId: number,
): ContactRow => ({
  id,
  plant_id: plantId,
  name: input.name,
  position: input.position ?? '',
  email: input.email ?? '',
  phone: input.phone ?? '',
  main: false,
});
