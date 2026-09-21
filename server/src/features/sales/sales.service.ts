import { salesRepository } from "./sales.repository.js";

export class SalesService {
  async getSalesSummary() {
    const deliveries = await salesRepository.getSalesSummary();

    let totalSales = 0;
    let totalQuantitySold = 0;

    for (const delivery of deliveries) {
      for (const item of delivery.items) {
        totalSales += Number(item.subtotal);
        totalQuantitySold += item.quantity;
      }
    }

    return {
      completedDeliveries: deliveries.length,
      totalQuantitySold,
      totalSales,
    };
  }
}

export const salesService = new SalesService();