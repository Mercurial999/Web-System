import { prisma } from "../../database/prisma.js";
export class ReportsRepository {
    async getCompletedDeliveries(from, to) {
        return prisma.delivery.findMany({
            where: {
                status: "COMPLETED",
                ...(from || to
                    ? {
                        deliveryDate: {
                            ...(from ? { gte: from } : {}),
                            ...(to ? { lte: to } : {}),
                        },
                    }
                    : {}),
            },
            orderBy: {
                deliveryDate: "desc",
            },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async getSalesDetails(from, to) {
        return prisma.delivery.findMany({
            where: {
                status: "COMPLETED",
                ...(from || to
                    ? {
                        deliveryDate: {
                            ...(from ? { gte: from } : {}),
                            ...(to ? { lte: to } : {}),
                        },
                    }
                    : {}),
            },
            orderBy: {
                deliveryDate: "desc",
            },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async getProductSales(from, to) {
        return prisma.deliveryItem.findMany({
            where: {
                delivery: {
                    status: "COMPLETED",
                    ...(from || to
                        ? {
                            deliveryDate: {
                                ...(from ? { gte: from } : {}),
                                ...(to ? { lte: to } : {}),
                            },
                        }
                        : {}),
                },
            },
            include: {
                product: true,
                delivery: true,
            },
        });
    }
    async getCustomerSales(from, to) {
        return prisma.delivery.findMany({
            where: {
                status: "COMPLETED",
                ...(from || to
                    ? {
                        deliveryDate: {
                            ...(from ? { gte: from } : {}),
                            ...(to ? { lte: to } : {}),
                        },
                    }
                    : {}),
            },
            include: {
                customer: true,
                items: true,
            },
        });
    }
    async getInventoryReport() {
        return prisma.inventory.findMany({
            orderBy: { id: "asc" },
            include: {
                product: true,
            },
        });
    }
    async getStockMovementReport(from, to) {
        return prisma.stockMovement.findMany({
            where: {
                ...(from || to
                    ? {
                        createdAt: {
                            ...(from ? { gte: from } : {}),
                            ...(to ? { lte: to } : {}),
                        },
                    }
                    : {}),
            },
            orderBy: { createdAt: "desc" },
            include: {
                inventory: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async getDeliveryReport(from, to) {
        return prisma.delivery.findMany({
            where: {
                ...(from || to
                    ? {
                        deliveryDate: {
                            ...(from ? { gte: from } : {}),
                            ...(to ? { lte: to } : {}),
                        },
                    }
                    : {}),
            },
            orderBy: { deliveryDate: "desc" },
            include: {
                customer: true,
                order: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
}
export const reportsRepository = new ReportsRepository();
