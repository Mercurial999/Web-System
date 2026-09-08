import { prisma } from "../../database/prisma.js";
export class DeliveryRepository {
    async findAll() {
        return prisma.delivery.findMany({
            orderBy: {
                deliveryDate: "desc",
            },
            include: {
                customer: true,
            },
        });
    }
    async findById(id, client = prisma) {
        return client.delivery.findUnique({
            where: {
                id,
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
    async create(data) {
        return prisma.delivery.create({
            data: {
                customerId: data.customerId,
                deliveryDate: data.deliveryDate,
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
    async addItem(deliveryId, data) {
        return prisma.deliveryItem.create({
            data: {
                deliveryId,
                productId: data.productId,
                quantity: data.quantity,
            },
            include: {
                product: true,
            },
        });
    }
    async updateItem(itemId, data) {
        return prisma.deliveryItem.update({
            where: {
                id: itemId,
            },
            data,
            include: {
                product: true,
            },
        });
    }
    async deleteItem(itemId) {
        return prisma.deliveryItem.delete({
            where: {
                id: itemId,
            },
        });
    }
    async update(id, data) {
        return prisma.delivery.update({
            where: {
                id,
            },
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
    async updateStatus(id, status, client = prisma) {
        return client.delivery.update({
            where: {
                id,
            },
            data: {
                status,
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
    async findForUpdate(id, client = prisma) {
        const result = await client.$queryRaw `
    SELECT
      id,
      "customerId",
      "deliveryDate",
      status,
      notes,
      "createdAt",
      "updatedAt"
    FROM "deliveries"
    WHERE id = ${id}
    FOR UPDATE
  `;
        if (result.length === 0) {
            return null;
        }
        return result[0];
    }
}
export const deliveryRepository = new DeliveryRepository();
