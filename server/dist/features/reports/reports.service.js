import { ValidationError } from "../../shared/errors/index.js";
import { reportsRepository } from "./reports.repository.js";
export class ReportsService {
    reportsRepository = reportsRepository;
    async getSalesSummary(from, to) {
        let fromDate;
        let toDate;
        if (from) {
            fromDate = new Date(`${from}T00:00:00`);
            if (Number.isNaN(fromDate.getTime())) {
                throw new ValidationError("Invalid 'from' date");
            }
        }
        if (to) {
            toDate = new Date(`${to}T23:59:59.999`);
            if (Number.isNaN(toDate.getTime())) {
                throw new ValidationError("Invalid 'to' date");
            }
        }
        if (fromDate && toDate && fromDate > toDate) {
            throw new ValidationError("'from' date cannot be later than 'to' date");
        }
        const completedDeliveries = await this.reportsRepository.getCompletedDeliveries(fromDate, toDate);
        let totalSales = 0;
        let totalQuantitySold = 0;
        for (const delivery of completedDeliveries) {
            for (const item of delivery.items) {
                totalSales += Number(item.subtotal ?? 0);
                totalQuantitySold += item.quantity;
            }
        }
        return {
            completedSales: completedDeliveries.length,
            totalQuantitySold,
            totalSales,
        };
    }
    async getSalesDetails(from, to) {
        let fromDate;
        let toDate;
        if (from) {
            fromDate = new Date(`${from}T00:00:00`);
            if (Number.isNaN(fromDate.getTime())) {
                throw new ValidationError("Invalid 'from' date");
            }
        }
        if (to) {
            toDate = new Date(`${to}T23:59:59.999`);
            if (Number.isNaN(toDate.getTime())) {
                throw new ValidationError("Invalid 'to' date");
            }
        }
        if (fromDate && toDate && fromDate > toDate) {
            throw new ValidationError("'from' date cannot be later than 'to' date");
        }
        const completedDeliveries = await this.reportsRepository.getSalesDetails(fromDate, toDate);
        return completedDeliveries.map((delivery) => {
            let deliveryTotal = 0;
            const items = delivery.items.map((item) => {
                const unitPrice = item.unitPrice
                    ? Number(item.unitPrice)
                    : null;
                const subtotal = item.subtotal
                    ? Number(item.subtotal)
                    : null;
                if (subtotal !== null) {
                    deliveryTotal += subtotal;
                }
                return {
                    product: item.product.name,
                    quantity: item.quantity,
                    unit: item.product.unit,
                    unitPrice,
                    subtotal,
                };
            });
            return {
                deliveryId: delivery.id,
                orderId: delivery.orderId,
                deliveryDate: delivery.deliveryDate,
                customer: delivery.customer.name,
                status: delivery.status,
                items,
                total: deliveryTotal,
            };
        });
    }
    async getProductSales(from, to) {
        let fromDate;
        let toDate;
        if (from) {
            fromDate = new Date(`${from}T00:00:00`);
            if (Number.isNaN(fromDate.getTime())) {
                throw new ValidationError("Invalid 'from' date");
            }
        }
        if (to) {
            toDate = new Date(`${to}T23:59:59.999`);
            if (Number.isNaN(toDate.getTime())) {
                throw new ValidationError("Invalid 'to' date");
            }
        }
        if (fromDate && toDate && fromDate > toDate) {
            throw new ValidationError("'from' date cannot be later than 'to' date");
        }
        const deliveryItems = await this.reportsRepository.getProductSales(fromDate, toDate);
        const productSales = new Map();
        for (const item of deliveryItems) {
            const existing = productSales.get(item.productId);
            const quantitySold = item.quantity;
            const totalSales = Number(item.subtotal ?? 0);
            if (existing) {
                existing.quantitySold += quantitySold;
                existing.totalSales += totalSales;
            }
            else {
                productSales.set(item.productId, {
                    product: item.product.name,
                    unit: item.product.unit,
                    quantitySold,
                    totalSales,
                });
            }
        }
        return Array.from(productSales.values());
    }
    async getCustomerSales(from, to) {
        let fromDate;
        let toDate;
        if (from) {
            fromDate = new Date(`${from}T00:00:00`);
            if (Number.isNaN(fromDate.getTime())) {
                throw new ValidationError("Invalid 'from' date");
            }
        }
        if (to) {
            toDate = new Date(`${to}T23:59:59.999`);
            if (Number.isNaN(toDate.getTime())) {
                throw new ValidationError("Invalid 'to' date");
            }
        }
        if (fromDate && toDate && fromDate > toDate) {
            throw new ValidationError("'from' date cannot be later than 'to' date");
        }
        const deliveries = await this.reportsRepository.getCustomerSales(fromDate, toDate);
        const customerSales = new Map();
        for (const delivery of deliveries) {
            const existing = customerSales.get(delivery.customerId);
            let deliveryQuantity = 0;
            let deliveryTotal = 0;
            for (const item of delivery.items) {
                deliveryQuantity += item.quantity;
                deliveryTotal += Number(item.subtotal ?? 0);
            }
            if (existing) {
                existing.completedDeliveries += 1;
                existing.quantitySold += deliveryQuantity;
                existing.totalSales += deliveryTotal;
            }
            else {
                customerSales.set(delivery.customerId, {
                    customer: delivery.customer.name,
                    completedDeliveries: 1,
                    quantitySold: deliveryQuantity,
                    totalSales: deliveryTotal,
                });
            }
        }
        return Array.from(customerSales.values());
    }
    async getInventoryReport() {
        const inventory = await this.reportsRepository.getInventoryReport();
        return inventory.map((item) => ({
            product: item.product.name,
            unit: item.product.unit,
            currentStock: Number(item.quantity),
            minimumStock: Number(item.minimumStock),
        }));
    }
    async getStockMovementReport(from, to) {
        let fromDate;
        let toDate;
        if (from) {
            fromDate = new Date(`${from}T00:00:00`);
            if (Number.isNaN(fromDate.getTime())) {
                throw new ValidationError("Invalid 'from' date");
            }
        }
        if (to) {
            toDate = new Date(`${to}T23:59:59.999`);
            if (Number.isNaN(toDate.getTime())) {
                throw new ValidationError("Invalid 'to' date");
            }
        }
        if (fromDate && toDate && fromDate > toDate) {
            throw new ValidationError("'from' date cannot be later than 'to' date");
        }
        const movements = await this.reportsRepository.getStockMovementReport(fromDate, toDate);
        return movements.map((movement) => ({
            id: movement.id,
            product: movement.inventory.product.name,
            unit: movement.inventory.product.unit,
            type: movement.type,
            reason: movement.reason,
            quantity: Number(movement.quantity),
            reference: movement.reference,
            notes: movement.notes,
            createdAt: movement.createdAt,
        }));
    }
    async getDeliveryReport(from, to) {
        let fromDate;
        let toDate;
        if (from) {
            fromDate = new Date(`${from}T00:00:00`);
            if (Number.isNaN(fromDate.getTime())) {
                throw new ValidationError("Invalid 'from' date");
            }
        }
        if (to) {
            toDate = new Date(`${to}T23:59:59.999`);
            if (Number.isNaN(toDate.getTime())) {
                throw new ValidationError("Invalid 'to' date");
            }
        }
        if (fromDate && toDate && fromDate > toDate) {
            throw new ValidationError("'from' date cannot be later than 'to' date");
        }
        const deliveries = await this.reportsRepository.getDeliveryReport(fromDate, toDate);
        return deliveries.map((delivery) => {
            let total = 0;
            const items = delivery.items.map((item) => {
                const unitPrice = item.unitPrice !== null
                    ? Number(item.unitPrice)
                    : null;
                const subtotal = item.subtotal !== null
                    ? Number(item.subtotal)
                    : null;
                if (subtotal !== null) {
                    total += subtotal;
                }
                return {
                    product: item.product.name,
                    quantity: item.quantity,
                    unit: item.product.unit,
                    unitPrice,
                    subtotal,
                };
            });
            return {
                deliveryId: delivery.id,
                orderId: delivery.orderId,
                deliveryDate: delivery.deliveryDate,
                customer: delivery.customer.name,
                status: delivery.status,
                items,
                total,
            };
        });
    }
}
export const reportsService = new ReportsService();
