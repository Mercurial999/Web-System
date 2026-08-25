import {
  Request,
  Response,
  NextFunction,
} from "express";

import { permissionService } from "./permission.service.js";

export class PermissionController {
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const permissions =
        await permissionService.getAllPermissions();

      res.status(200).json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      const permission =
        await permissionService.getPermissionById(id);

      res.status(200).json({
        success: true,
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const permissionController =
  new PermissionController();