import { prisma } from "../../database/prisma.js";
export class StockMovementRepository {
    async findAll() {
        return prisma.stockMovement.findMany({
            include: {
                inventory: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findById(id) {
        return prisma.stockMovement.findUnique({
            where: {
                id,
            },
            include: {
                inventory: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async findByInventoryId(inventoryId) {
        return prisma.stockMovement.findMany({
            where: {
                inventoryId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async create(data, client = prisma) {
        return client.stockMovement.create({
            data,
        });
    }
}
export const stockMovementRepository = new StockMovementRepository();
