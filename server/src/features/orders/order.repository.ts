import { prisma } from "../../database/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

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

  async findById(
    id: number,
    client: Prisma.TransactionClient = prisma,
  ) {
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

  async create(
    data: {
      customerId: number;
      orderDate: Date;
      notes?: string;
      items: {
        productId: number;
        quantity: number;
        unitPrice: Prisma.Decimal;
        subtotal: Prisma.Decimal;
      }[];
    },
  ) {
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

  async addItem(
    orderId: number,
    data: {
      productId: number;
      quantity: number;
      unitPrice: Prisma.Decimal;
      subtotal: Prisma.Decimal;
    },
  ) {
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

  async updateItem(
    itemId: number,
    data: {
      quantity: number;
      unitPrice: Prisma.Decimal;
      subtotal: Prisma.Decimal;
    },
  ) {
    return prisma.orderItem.update({
      where: { id: itemId },
      data,
      include: {
        product: true,
      },
    });
  }

  async deleteItem(itemId: number) {
    return prisma.orderItem.delete({
      where: { id: itemId },
    });
  }

  async update(
    id: number,
    data: {
      customerId?: number;
      orderDate?: Date;
      notes?: string;
    },
  ) {
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

  async updateStatus(
    id: number,
    status: "PENDING" | "CONFIRMED" | "CANCELLED",
  ) {
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