import { prisma } from "../../database/prisma.js";
export class OrderRepository {
    async findAll() {
        return prisma.order.findMany({
            orderBy: { orderDate: "desc" },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                delivery: true,
            },
        });
    }
    async findById(id, client = prisma) {
        return client.order.findUnique({
            where: { id },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                delivery: true,
            },
        });
    }
    async create(data) {
        return prisma.order.create({
            data: {
                customerId: data.customerId,
                orderDate: data.orderDate,
                notes: data.notes,
                items: {
                    create: data.items,
                },
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
    async addItem(orderId, data) {
        return prisma.orderItem.create({
            data: {
                orderId,
                productId: data.productId,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
                subtotal: data.subtotal,
            },
            include: {
                product: true,
            },
        });
    }
    async updateItem(itemId, data) {
        return prisma.orderItem.update({
            where: { id: itemId },
            data,
            include: {
                product: true,
            },
        });
    }
    async deleteItem(itemId) {
        return prisma.orderItem.delete({
            where: { id: itemId },
        });
    }
    async update(id, data) {
        return prisma.order.update({
            where: { id },
            data,
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
    async updateStatus(id, status) {
        return prisma.order.update({
            where: { id },
            data: { status },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                delivery: true,
            },
        });
    }
}
export const orderRepository = new OrderRepository();
