import { apiRequest } from "../lib/api";
import type { Product } from "../types/product.types";

interface ProductResponse {
  success: boolean;
  data: Product[];
}

export async function getProducts(): Promise<Product[]> {
  const response = await apiRequest<ProductResponse>("/products");

  return response.data;
}

export async function createProduct(input: {
  name: string;
  description?: string;
  unit: string;
  price: number;
}): Promise<Product> {
  const response = await apiRequest<{ data: Product }>("/products", {
    method: "POST",
    body: input,
  });
  return response.data;
}

export async function updateProduct(
  id: number,
  input: Partial<{ name: string; description: string; unit: string; price: number; status: "ACTIVE" | "INACTIVE" }>,
): Promise<Product> {
  const response = await apiRequest<{ data: Product }>(`/products/${id}`, {
    method: "PUT",
    body: input,
  });
  return response.data;
}

export async function deactivateProduct(id: number): Promise<void> {
  await apiRequest(`/products/${id}`, { method: "DELETE" });
}