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
}
export const deliveryRepository = new DeliveryRepository();
