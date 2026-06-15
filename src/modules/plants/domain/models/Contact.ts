/** Domain model for a plant contact. */
export interface Contact {
  id: number;
  plantId: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  main: boolean;
}

export interface CreateContactInput {
  name: string;
  position?: string;
  email?: string;
  phone?: string;
}
