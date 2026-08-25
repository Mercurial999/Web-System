import { prisma } from "../../database/prisma.js";
import type {
    CreateRoleDto,
    UpdateRoleDto,
} from "./role.types.js";

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

  async findById(id: number) {
    return prisma.role.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return prisma.role.findUnique({
      where: { name },
    });
  }

  async create(data: CreateRoleDto) {
    return prisma.role.create({
      data,
    });
  }

  async update(id: number, data: UpdateRoleDto) {
    return prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.role.delete({
      where: { id },
    });
  }
}
export const roleRepository =
    new RoleRepository();