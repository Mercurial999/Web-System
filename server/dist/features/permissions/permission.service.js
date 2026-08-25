import { permissionRepository } from "./permission.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
export class PermissionService {
    async getAllPermissions() {
        return permissionRepository.findAll();
    }
    async getPermissionById(id) {
        const permission = await permissionRepository.findById(id);
        if (!permission) {
            throw new AppError("Permission not found.", 404);
        }
        return permission;
    }
}
export const permissionService = new PermissionService();
