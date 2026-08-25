export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
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