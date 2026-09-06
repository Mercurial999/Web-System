import { prisma } from "../../database/prisma.js";
export class CustomerRepository {
    async findAll() {
        return prisma.customer.findMany({
            orderBy: {
                name: "asc",
            },
        });
    }
    async findById(id) {
        return prisma.customer.findUnique({
            where: {
                id,
            },
        });
    }
    async create(data) {
        return prisma.customer.create({
            data,
        });
    }
    async update(id, data) {
        return prisma.customer.update({
            where: {
                id,
            },
            data,
        });
    }
    async deactivate(id) {
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
