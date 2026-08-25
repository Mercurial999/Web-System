export type CreateProductDto = {
  name: string;
  description?: string;
  unit: string;
  price: number;
};

export type UpdateProductDto = {
  name?: string;
  description?: string;
  unit?: string;
  price?: number;
  status?: "ACTIVE" | "INACTIVE";
};