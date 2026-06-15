/** Domain model for a plant (paper company). */
export interface Plant {
  id: number;
  companyName: string;
  nickName: string;
  type: string;
  country: string;
  city: string;
  industry: string;
  subIndustry: string;
  contact: string;
  email: string;
  phone: string;
  taxId: string;
  invoiceName: string;
  web: string;
  source: string;
  association: string;
  status: string;
}

export interface CreatePlantInput {
  companyName: string;
  nickName?: string;
  type: string;
  country: string;
  city?: string;
  industry: string;
  email?: string;
  phone?: string;
  taxId?: string;
  invoiceName?: string;
  web?: string;
  source?: string;
  association?: string;
}
