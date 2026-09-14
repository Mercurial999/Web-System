import { prisma } from "../../database/prisma.js";

export class ProductRepository {
  async findAll(status?: "ACTIVE" | "INACTIVE") {
  return prisma.product.findMany({
    where: status
      ? {
          status,
        }
      : undefined,
    orderBy: {
      name: "asc",
    },
  });
}

  async findById(id: number) {
    return prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string) {
    return prisma.product.findUnique({
      where: {
        name,
      },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    unit: string;
    price: number;
  }) {
    return prisma.product.create({
      data,
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      unit?: string;
      price?: number;
      status?: "ACTIVE" | "INACTIVE";
    }
  ) {
    return prisma.product.update({
      where: {
        id,
      },
      data,
    });
  }

 async deactivate(id: number) {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      status: "INACTIVE",
    },
  });

}

}

export const productRepository = new ProductRepository();