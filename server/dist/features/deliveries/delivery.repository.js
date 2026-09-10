import { prisma } from "../../database/prisma.js";
export class DeliveryRepository {
    async findAll() {
        return prisma.delivery.findMany({
            orderBy: {
                deliveryDate: "desc",
            },
            include: {
                customer: true,
                order: true,
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
                order: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async createFromOrder(data) {
        return prisma.delivery.create({
            data: {
                orderId: data.orderId,
                customerId: data.customerId,
                deliveryDate: data.deliveryDate,
                notes: data.notes,
                items: {
                    create: data.items,
                },
            },
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
