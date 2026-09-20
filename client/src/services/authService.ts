import { apiRequest } from "../lib/api";

import type {
  LoginCredentials,
  LoginResponse,
  PermissionsResponse,
} from "../types/auth.types";

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export async function getPermissions(): Promise<string[]> {
  const response = await apiRequest<PermissionsResponse>("/auth/permissions");
  return response.data;
}