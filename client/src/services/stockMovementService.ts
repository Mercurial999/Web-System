import { apiRequest } from "../lib/api";
import type { StockMovement } from "../types/stock-movement.types";

export async function getStockMovements(): Promise<StockMovement[]> {
  const response = await apiRequest<{ data: StockMovement[] }>("/stock-movements");
  return response.data;
}
