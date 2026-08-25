import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { authRepository } from "./auth.repository.js";

import { authConfig } from "../../config/auth.js";

import { AppError } from "../../shared/errors/AppError.js";

import type { LoginDto } from "./auth.types.js";

export class AuthService {
  async login(data: LoginDto) {
    // Step 1
    const user = await authRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    // Step 2
    const passwordMatches = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password.", 401);
    }

    // Step 3
    if (user.status !== "ACTIVE") {
      throw new AppError("Your account is inactive.", 403);
    }

    // Step 4
    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.roleId,
        role: user.role.name,
      },
      authConfig.jwtSecret,
      {
        expiresIn: authConfig.jwtExpiresIn,
      }
    );

    // Step 5
    const { password, ...safeUser } = user;

    return {
      token,
      user: safeUser,
    };

    
  }

  async getUserPermissions(userId: number) {
  const user = await authRepository.findUserPermissions(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user.role.rolePermissions.map(
    (rolePermission) => rolePermission.permission.name
  );
}

}

export const authService = new AuthService();