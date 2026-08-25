import { RoleService } from "./role.service.js";
export class RoleController {
    roleService;
    constructor(roleService = new RoleService()) {
        this.roleService = roleService;
    }
    async getAll(req, res, next) {
        try {
            const roles = await this.roleService.getAllRoles();
            res.status(200).json({
                success: true,
                data: roles,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const role = await this.roleService.getRoleById(id);
            res.status(200).json({
                success: true,
                data: role,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const role = await this.roleService.createRole(req.body);
            res.status(201).json({
                success: true,
                message: "Role created successfully.",
                data: role,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const role = await this.roleService.updateRole(id, req.body);
            res.status(200).json({
                success: true,
                message: "Role updated successfully.",
                data: role,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const id = Number(req.params.id);
            await this.roleService.deleteRole(id);
            res.status(200).json({
                success: true,
                message: "Role deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getPermissions(req, res, next) {
        try {
            const roleId = Number(req.params.id);
            const permissions = await this.roleService.getRolePermissions(roleId);
            res.status(200).json({
                success: true,
                data: permissions,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async assignPermission(req, res, next) {
        try {
            const roleId = Number(req.params.id);
            const result = await this.roleService.assignPermission(roleId, req.body);
            res.status(201).json({
                success: true,
                message: "Permission assigned successfully.",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async removePermission(req, res, next) {
        try {
            const roleId = Number(req.params.roleId);
            const permissionId = Number(req.params.permissionId);
            await this.roleService.removePermission(roleId, permissionId);
            res.status(200).json({
                success: true,
                message: "Permission removed successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
