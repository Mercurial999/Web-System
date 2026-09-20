import { Request, Response, NextFunction } from "express";

import { authService } from "./auth.service.js";

export class AuthController {
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPermissions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new Error("Authenticated user is missing.");
      }

      const permissions = await authService.getUserPermissions(req.user.userId);

      res.status(200).json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();