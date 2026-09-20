import { apiRequest } from "../lib/api";
import type { Role, RoleInput } from "../types/role.types";

export async function getRoles(): Promise<Role[]> {
	const response = await apiRequest<{ data: Role[] }>("/roles");
	return response.data;
}

export async function createRole(input: RoleInput): Promise<Role> {
	const response = await apiRequest<{ data: Role }>("/roles", { method: "POST", body: input });
	return response.data;
}
