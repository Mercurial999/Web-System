import { rolePermissionRepository } from "./role-permission.repository.js";
import { permissionRepository } from "../permissions/permission.repository.js";
import { RoleRepository } from "./role.repository.js";
import { AppError } from "../../shared/errors/index.js";
export class RoleService {
    roleRepository;
    constructor(roleRepository = new RoleRepository()) {
        this.roleRepository = roleRepository;
    }
    async getAllRoles() {
        return this.roleRepository.findAll();
    }
    async getRoleById(id) {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new Error("Role not found.");
        }
        return role;
    }
    async createRole(data) {
        const existingRole = await this.roleRepository.findByName(data.name);
        if (existingRole) {
            throw new Error("Role name already exists.");
        }
        return this.roleRepository.create(data);
    }
    async updateRole(id, data) {
        await this.getRoleById(id);
        if (data.name) {
            const existingRole = await this.roleRepository.findByName(data.name);
            if (existingRole && existingRole.id !== id) {
                throw new Error("Role name already exists.");
            }
        }
        return this.roleRepository.update(id, data);
    }
    async deleteRole(id) {
        await this.getRoleById(id);
        return this.roleRepository.delete(id);
    }
    async getRolePermissions(roleId) {
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new AppError("Role not found.", 404);
        }
        return rolePermissionRepository.findByRole(roleId);
    }
    async assignPermission(roleId, data) {
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new AppError("Role not found.", 404);
        }
        const permission = await permissionRepository.findById(data.permissionId);
        if (!permission) {
            throw new AppError("Permission not found.", 404);
        }
        const existing = await rolePermissionRepository.findByRoleAndPermission(roleId, data.permissionId);
        if (existing) {
            throw new AppError("Permission is already assigned to this role.", 409);
        }
        return rolePermissionRepository.create(roleId, data.permissionId);
    }
    async removePermission(roleId, permissionId) {
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new AppError("Role not found.", 404);
        }
        const existing = await rolePermissionRepository.findByRoleAndPermission(roleId, permissionId);
        if (!existing) {
            throw new AppError("Permission is not assigned to this role.", 404);
        }
        await rolePermissionRepository.delete(roleId, permissionId);
    }
}
