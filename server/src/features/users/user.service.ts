import bcrypt from "bcrypt";

import { userRepository } from "./user.repository.js";
import { roleRepository } from "../roles/role.repository.js";

import { authConfig } from "../../config/auth.js";
import { AppError } from "../../shared/errors/AppError.js";

import type { CreateUserDto,UpdateUserDto,} from "./user.types.js";

export class UserService {
  async createUser(data: CreateUserDto) {
    // 1. Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already exists.", 409);
    }

    // 2. Check if role exists
    const role = await roleRepository.findById(data.roleId);

    if (!role) {
      throw new AppError("Role not found.", 404);
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(
      data.password,
      authConfig.bcryptSaltRounds
    );

    // 4. Create user
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // 5. Never return password
    const { password, ...safeUser } = user;

    return safeUser;
  }

  async getAllUsers() {
  const users = await userRepository.findAll();

  return users.map(({ password, ...safeUser }) => safeUser);
  }

  async getUserById(id: number) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const { password, ...safeUser } = user;

  return safeUser;
}

async deleteUser(id: number) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  await userRepository.delete(id);
}

async updateUser(id: number, data: UpdateUserDto) {
  // 1. Check if user exists
  const existingUser = await userRepository.findById(id);

  if (!existingUser) {
    throw new AppError("User not found.", 404);
  }

  // 2. If email is being changed, make sure it isn't already used
  if (data.email && data.email !== existingUser.email) {
    const emailExists = await userRepository.findByEmail(data.email);

    if (emailExists) {
      throw new AppError("Email already exists.", 409);
    }
  }

  // 3. If roleId is being changed, make sure the role exists
  if (data.roleId !== undefined) {
    const role = await roleRepository.findById(data.roleId);

    if (!role) {
      throw new AppError("Role not found.", 404);
    }
  }

  // 4. Update user
  const user = await userRepository.update(id, data);

  // 5. Never return password
  const { password, ...safeUser } = user;

  return safeUser;
}

}

export const userService = new UserService();