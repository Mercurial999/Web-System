export type CustomerStatus = "ACTIVE" | "INACTIVE";

export interface Customer {
  id: number;
  name: string;
  address: string;
  contactPerson?: string | null;
  phone?: string | null;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  address: string;
  contactPerson?: string;
  phone?: string;
}
