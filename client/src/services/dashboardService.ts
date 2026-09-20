import { apiRequest } from "../lib/api";

export interface DashboardSummary {
  sales: { today: number | string; thisWeek: number | string; thisMonth: number | string };
  deliveries: { draft: number; completed: number; cancelled: number };
  inventory: { totalProducts: number; lowStock: number; outOfStock: number };
  topSellingProducts: { productName: string; quantitySold: number }[];
  productsInDemand: { productName: string; quantityDemanded: number }[];
  recentOrders: { id: number; status: string; customer?: { name: string } }[];
  recentDeliveries: { id: number; status: string; customer?: { name: string } }[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await apiRequest<{ data: DashboardSummary }>("/dashboard/summary");
  return response.data;
}
