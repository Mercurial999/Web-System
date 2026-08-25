import { prisma } from "../../database/prisma.js";
export class UserRepository {
    async findById(id) {
        return prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                role: true,
            },
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async findAll() {
        return prisma.user.findMany({
            include: {
                role: true,
            },
            orderBy: {
                lastName: "asc",
            },
        });
    }
    async create(data) {
        return prisma.user.create({
            data,
            include: {
                role: true,
            },
        });
    }
    async update(id, data) {
        return prisma.user.update({
            where: {
                id,
            },
            data,
            include: {
                role: true,
            },
        });
    }
    async delete(id) {
        return prisma.user.delete({
            where: {
                id,
            },
        });
    }
}
export const userRepository = new UserRepository();
