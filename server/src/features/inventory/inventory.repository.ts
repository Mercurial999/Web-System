import { prisma } from "../../database/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

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

  async findById(id: number) {
    return prisma.inventory.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
      },
    });
  }

  async findForUpdate(
  id: number,
  client: Prisma.TransactionClient = prisma
) {
  const result = await client.$queryRaw<
    Array<{
      id: number;
      productId: number;
      quantity: Prisma.Decimal;
      minimumStock: Prisma.Decimal;
      createdAt: Date;
      updatedAt: Date;
    }>
  >`
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

async findForUpdateByProductId(
  productId: number,
  client: Prisma.TransactionClient = prisma,
) {
  const result = await client.$queryRaw<
    Array<{
      id: number;
      productId: number;
      quantity: Prisma.Decimal;
      minimumStock: Prisma.Decimal;
      createdAt: Date;
      updatedAt: Date;
    }>
  >`
    SELECT
      id,
      "productId",
      quantity,
      "minimumStock",
      "createdAt",
      "updatedAt"
    FROM "inventory"
    WHERE "productId" = ${productId}
    FOR UPDATE
  `;

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

  async findByProductId(productId: number) {
    return prisma.inventory.findUnique({
      where: {
        productId,
      },
      include: {
        product: true,
      },
    });
  }

  async create(data: {
    productId: number;
    quantity: number;
    minimumStock: number;
  }) {
    return prisma.inventory.create({
      data,
      include: {
        product: true,
      },
    });
  }

  async update(
  id: number,
  data: {
    quantity?: number;
    minimumStock?: number;
  },
  client: Prisma.TransactionClient = prisma
) {
  return client.inventory.update({
    where: {
      id,
    },
    data,
  });
}
}

export const inventoryRepository = new InventoryRepository();