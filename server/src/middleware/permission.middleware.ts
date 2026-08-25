import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../shared/errors/AppError.js";
import { authService } from "../features/auth/auth.service.js";

export function authorize(permission: string) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(
          "Authentication required.",
          401
        );
      }

      const permissions =
        await authService.getUserPermissions(
          req.user.userId
        );

      if (!permissions.includes(permission)) {
        throw new AppError(
          "You do not have permission to perform this action.",
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}