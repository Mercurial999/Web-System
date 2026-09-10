import { prisma } from "../../database/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

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

  async findById(
    id: number,
    client: Prisma.TransactionClient = prisma,
  ) {
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

  async createFromOrder(data: {
    orderId: number;
    customerId: number;
    deliveryDate: Date;
    notes?: string;
    items: {
      productId: number;
      quantity: number;
      unitPrice: Prisma.Decimal;
      subtotal: Prisma.Decimal;
    }[];
  }) {
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

  async updateStatus(
    id: number,
    status: "DRAFT" | "COMPLETED" | "CANCELLED",
    client: Prisma.TransactionClient = prisma,
  ) {
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

  async findForUpdate(
    id: number,
    client: Prisma.TransactionClient = prisma,
  ) {
    const result = await client.$queryRaw<
      Array<{
        id: number;
        customerId: number;
        deliveryDate: Date;
        status: "DRAFT" | "COMPLETED" | "CANCELLED";
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`
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