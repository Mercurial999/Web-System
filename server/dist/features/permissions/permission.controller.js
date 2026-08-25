import { permissionService } from "./permission.service.js";
export class PermissionController {
    async getAll(req, res, next) {
        try {
            const permissions = await permissionService.getAllPermissions();
            res.status(200).json({
                success: true,
                data: permissions,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const permission = await permissionService.getPermissionById(id);
            res.status(200).json({
                success: true,
                data: permission,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export const permissionController = new PermissionController();
