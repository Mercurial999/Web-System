export interface Product {
  id: number;
  name: string;
  description?: string | null;
  unit: string;
  price: number | string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ProductInput {
  name: string;
  description?: string;
  unit: string;
  price: number;
}
