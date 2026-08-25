import { prisma } from "../../database/prisma.js";
export class InventoryRepository {
    async findAll() {
        return prisma.inventory.findMany({
            include: {
                product: true,
            },
            orderBy: {
                id: "asc",
            },
        });
    }
    async findById(id) {
        return prisma.inventory.findUnique({
            where: {
                id,
            },
            include: {
                product: true,
            },
        });
    }
    async findForUpdate(id, client = prisma) {
        const result = await client.$queryRaw `
    SELECT
      id,
      "productId",
      quantity,
      "minimumStock",
      "createdAt",
      "updatedAt"
    FROM "inventory"
    WHERE id = ${id}
    FOR UPDATE
  `;
        if (result.length === 0) {
            return null;
        }
        return result[0];
    }
    async findByProductId(productId) {
        return prisma.inventory.findUnique({
            where: {
                productId,
            },
            include: {
                product: true,
            },
        });
    }
    async create(data) {
        return prisma.inventory.create({
            data,
            include: {
                product: true,
            },
        });
    }
    async update(id, data, client = prisma) {
        return client.inventory.update({
            where: {
                id,
            },
            data,
        });
    }
}
export const inventoryRepository = new InventoryRepository();
