import { prisma } from "../../database/prisma.js";
export class PermissionRepository {
    async findAll() {
        return prisma.permission.findMany({
            orderBy: {
                name: "asc",
            },
        });
    }
    async findById(id) {
        return prisma.permission.findUnique({
            where: {
                id,
            },
        });
    }
    async findByName(name) {
        return prisma.permission.findUnique({
            where: {
                name,
            },
        });
    }
}
export const permissionRepository = new PermissionRepository();
