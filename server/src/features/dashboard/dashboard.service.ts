import { dashboardRepository } from "./dashboard.repository.js";

export class DashboardService {
  private dashboardRepository = dashboardRepository;

  async getSalesSummary() {
    return this.dashboardRepository.getSalesSummary();
  }

  async getDeliverySummary() {
    return this.dashboardRepository.getDeliverySummary();
  }

  async getInventorySummary() {
  return this.dashboardRepository.getInventorySummary();
}

async getTopSellingProducts() {
  return this.dashboardRepository.getTopSellingProducts();
}

async getProductsInDemand() {
  return this.dashboardRepository.getProductsInDemand();
}

async getRecentOrders() {
  return this.dashboardRepository.getRecentOrders();
}

async getOrders(filters?: {
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  customerId?: number;
  from?: string;
  to?: string;
  limit?: number;
}) {
  return this.dashboardRepository.getOrders(filters);
}

async getDeliveries(filters?: {
  status?: "DRAFT" | "COMPLETED" | "CANCELLED";
  customerId?: number;
  from?: string;
  to?: string;
  limit?: number;
}) {
  return this.dashboardRepository.getDeliveries(filters);
}

async getRecentDeliveries() {
  return this.dashboardRepository.getRecentDeliveries();
}

async getSummary() {
  const [
    sales,
    deliveries,
    inventory,
    topSellingProducts,
    productsInDemand,
    recentOrders,
    recentDeliveries,
  ] = await Promise.all([
    this.dashboardRepository.getSalesSummary(),
    this.dashboardRepository.getDeliverySummary(),
    this.dashboardRepository.getInventorySummary(),
    this.dashboardRepository.getTopSellingProducts(),
    this.dashboardRepository.getProductsInDemand(),
    this.dashboardRepository.getRecentOrders(),
    this.dashboardRepository.getRecentDeliveries(),
  ]);

  return {
    sales,
    deliveries,
    inventory,
    topSellingProducts,
    productsInDemand,
    recentOrders,
    recentDeliveries,
  };
}

}

export const dashboardService =
  new DashboardService();