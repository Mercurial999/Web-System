import { rolePermissionRepository } from "./role-permission.repository.js";
import { permissionRepository } from "../permissions/permission.repository.js";
import type { AssignPermissionDto } from "./role-permission.types.js";

import { RoleRepository } from "./role.repository.js";
import { CreateRoleDto, UpdateRoleDto } from "./role.types.js";

import { AppError } from "../../shared/errors/index.js";


export class RoleService {
  constructor(
    private readonly roleRepository = new RoleRepository()
  ) {}

  async getAllRoles() {
    return this.roleRepository.findAll();
  }

  async getRoleById(id: number) {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new Error("Role not found.");
    }

    return role;
  }

  async createRole(data: CreateRoleDto) {
    const existingRole = await this.roleRepository.findByName(data.name);

    if (existingRole) {
      throw new Error("Role name already exists.");
    }

    return this.roleRepository.create(data);
  }

  async updateRole(id: number, data: UpdateRoleDto) {
    await this.getRoleById(id);

    if (data.name) {
      const existingRole = await this.roleRepository.findByName(data.name);

      if (existingRole && existingRole.id !== id) {
        throw new Error("Role name already exists.");
      }
    }

    return this.roleRepository.update(id, data);
  }

  async deleteRole(id: number) {
    await this.getRoleById(id);

    return this.roleRepository.delete(id);
  }

  async getRolePermissions(roleId: number) {
  const role = await this.roleRepository.findById(roleId);

  if (!role) {
    throw new AppError("Role not found.", 404);
  }

  return rolePermissionRepository.findByRole(roleId);
}
async assignPermission(
  roleId: number,
  data: AssignPermissionDto
) {
  const role = await this.roleRepository.findById(roleId);

  if (!role) {
    throw new AppError("Role not found.", 404);
  }

  const permission =
    await permissionRepository.findById(
      data.permissionId
    );

  if (!permission) {
    throw new AppError("Permission not found.", 404);
  }

  const existing =
    await rolePermissionRepository.findByRoleAndPermission(
      roleId,
      data.permissionId
    );

  if (existing) {
    throw new AppError(
      "Permission is already assigned to this role.",
      409
    );
  }

  return rolePermissionRepository.create(
    roleId,
    data.permissionId
  );
}
async removePermission(
  roleId: number,
  permissionId: number
) {
  const role = await this.roleRepository.findById(roleId);

  if (!role) {
    throw new AppError("Role not found.", 404);
  }

  const existing =
    await rolePermissionRepository.findByRoleAndPermission(
      roleId,
      permissionId
    );

  if (!existing) {
    throw new AppError(
      "Permission is not assigned to this role.",
      404
    );
  }

  await rolePermissionRepository.delete(
    roleId,
    permissionId
  );
}
}

