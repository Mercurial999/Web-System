import { prisma } from "../../database/prisma.js";
export class AuthRepository {
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                role: true,
            },
        });
    }
    findUserPermissions(userId) {
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            include: {
                                permission: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
export const authRepository = new AuthRepository();
