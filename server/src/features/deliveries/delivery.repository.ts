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
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

  async create(data: {
    customerId: number;
    deliveryDate: Date;
    notes?: string;
    items: {
      productId: number;
      quantity: number;
    }[];
  }) {
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

  async update(
    id: number,
    data: {
      customerId?: number;
      deliveryDate?: Date;
      notes?: string;
    },
  ) {
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

}


export const deliveryRepository = new DeliveryRepository();