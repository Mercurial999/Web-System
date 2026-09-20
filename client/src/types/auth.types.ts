export interface AuthRole {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: number;
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  role: AuthRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

export interface PermissionsResponse {
  success: boolean;
  data: string[];
}