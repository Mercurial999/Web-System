import { prisma } from "../../database/prisma.js";
import type { CreateUserDto,UpdateUserDto,} from "./user.types.js";

export class UserRepository {
  async findById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
  }

  async findByEmail(email: string) {
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

  async create(data: CreateUserDto) {
    return prisma.user.create({
      data,
      include: {
        role: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
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
  
  async delete(id: number) {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  }

}


export const userRepository = new UserRepository();