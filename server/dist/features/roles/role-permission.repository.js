import { prisma } from "../../database/prisma.js";
export class RolePermissionRepository {
    async findByRoleAndPermission(roleId, permissionId) {
        return prisma.rolePermission.findUnique({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId,
                },
            },
        });
    }
    async findByRole(roleId) {
        return prisma.rolePermission.findMany({
            where: {
                roleId,
            },
            include: {
                permission: true,
            },
            orderBy: {
                permission: {
                    name: "asc",
                },
            },
        });
    }
    async create(roleId, permissionId) {
        return prisma.rolePermission.create({
            data: {
                roleId,
                permissionId,
            },
            include: {
                permission: true,
            },
        });
    }
    async delete(roleId, permissionId) {
        return prisma.rolePermission.delete({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId,
                },
            },
        });
    }
}
export const rolePermissionRepository = new RolePermissionRepository();
