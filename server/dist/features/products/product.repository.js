import { prisma } from "../../database/prisma.js";
export class ProductRepository {
    async findAll() {
        return prisma.product.findMany({
            orderBy: {
                name: "asc",
            },
        });
    }
    async findById(id) {
        return prisma.product.findUnique({
            where: {
                id,
            },
        });
    }
    async findByName(name) {
        return prisma.product.findUnique({
            where: {
                name,
            },
        });
    }
    async create(data) {
        return prisma.product.create({
            data,
        });
    }
    async update(id, data) {
        return prisma.product.update({
            where: {
                id,
            },
            data,
        });
    }
    async deactivate(id) {
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
