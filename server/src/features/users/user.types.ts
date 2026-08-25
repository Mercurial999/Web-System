export interface CreateUserDto {
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  roleId?: number;
  status?: "ACTIVE" | "INACTIVE";
}

export interface LoginUserDto {
  email: string;
  password: string;
}