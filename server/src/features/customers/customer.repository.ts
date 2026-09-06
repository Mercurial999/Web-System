import { prisma } from "../../database/prisma.js";

export class CustomerRepository {
  async findAll() {
    return prisma.customer.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: number) {
    return prisma.customer.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: {
    name: string;
    address: string;
    contactPerson?: string;
    phone?: string;
  }) {
    return prisma.customer.create({
      data,
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      address?: string;
      contactPerson?: string;
      phone?: string;
      status?: "ACTIVE" | "INACTIVE";
    }
  ) {
    return prisma.customer.update({
      where: {
        id,
      },
      data,
    });
  }

  async deactivate(id: number) {
    return prisma.customer.update({
      where: {
        id,
      },
      data: {
        status: "INACTIVE",
      },
    });
  }
}

export const customerRepository = new CustomerRepository();