import { Request, Response, NextFunction } from "express";
import { RoleService } from "./role.service.js";

export class RoleController {
  constructor(
    private readonly roleService = new RoleService()
  ) {}

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const roles = await this.roleService.getAllRoles();

      res.status(200).json({
        success: true,
        data: roles,
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

      const role = await this.roleService.getRoleById(id);

      res.status(200).json({
        success: true,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const role = await this.roleService.createRole(req.body);

      res.status(201).json({
        success: true,
        message: "Role created successfully.",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      const role = await this.roleService.updateRole(
        id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Role updated successfully.",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      await this.roleService.deleteRole(id);

      res.status(200).json({
        success: true,
        message: "Role deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getPermissions(
  req: Request,
  res: Response,
  next: NextFunction
  ) {
  try {
    const roleId = Number(req.params.id);

    const permissions =
      await this.roleService.getRolePermissions(roleId);

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    next(error);
  }
  }

  async assignPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const roleId = Number(req.params.id);

    const result =
      await this.roleService.assignPermission(
        roleId,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Permission assigned successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async removePermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const roleId = Number(req.params.roleId);
    const permissionId = Number(req.params.permissionId);

    await this.roleService.removePermission(
      roleId,
      permissionId
    );

    res.status(200).json({
      success: true,
      message: "Permission removed successfully.",
    });
  } catch (error) {
    next(error);
  }
}
}