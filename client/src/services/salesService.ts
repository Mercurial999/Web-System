import { apiRequest } from "../lib/api";
import type { SalesSummary } from "../types/sales.types";

export async function getSalesSummary(): Promise<SalesSummary> {
  const response = await apiRequest<{ data: SalesSummary }>("/sales/summary");
  return response.data;
}