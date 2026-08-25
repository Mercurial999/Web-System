import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth.js";
import { AppError } from "../shared/errors/AppError.js";


export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError(
        "Authentication token is required.",
        401
      );
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError(
        "Invalid authentication format.",
        401
      );
    }

    const payload = jwt.verify(
      token,
      authConfig.jwtSecret
    );

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.userId !== "number" ||
      typeof payload.roleId !== "number" ||
      typeof payload.role !== "string"
    ) {
      throw new AppError("Invalid authentication token.", 401);
    }

    req.user = {
      userId: payload.userId,
      roleId: payload.roleId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}