import { prisma } from "../../database/prisma.js";
export class RoleRepository {
    async findAll() {
        return prisma.role.findMany({
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
    }
    async findById(id) {
        return prisma.role.findUnique({
            where: { id },
        });
    }
    async findByName(name) {
        return prisma.role.findUnique({
            where: { name },
        });
    }
    async create(data) {
        return prisma.role.create({
            data,
        });
    }
    async update(id, data) {
        return prisma.role.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma.role.delete({
            where: { id },
        });
    }
}
export const roleRepository = new RoleRepository();
