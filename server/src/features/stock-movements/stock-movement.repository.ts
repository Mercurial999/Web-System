import { prisma } from "../../database/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

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

  async findById(id: number) {
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

  async findByInventoryId(inventoryId: number) {
    return prisma.stockMovement.findMany({
      where: {
        inventoryId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(
  data: {
    inventoryId: number;
    type: "IN" | "OUT" | "ADJUSTMENT";
    reason:
      | "PURCHASE"
      | "SALE"
      | "DAMAGE"
      | "RETURN"
      | "MANUAL_ADJUSTMENT";
    quantity: number;
    reference?: string;
    notes?: string;
  },
  client: Prisma.TransactionClient = prisma
) {
  return client.stockMovement.create({
    data,
  });
}
}

export const stockMovementRepository =
  new StockMovementRepository();