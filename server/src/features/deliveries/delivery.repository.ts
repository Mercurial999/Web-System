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

    async addItem(
    deliveryId: number,
    data: {
      productId: number;
      quantity: number;
    },
  ) {
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

   async updateItem(
    itemId: number,
    data: {
      quantity: number;
    },
  ) {
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

    async deleteItem(itemId: number) {
    return prisma.deliveryItem.delete({
      where: {
        id: itemId,
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