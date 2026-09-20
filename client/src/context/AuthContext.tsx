import { createContext } from "react";

import type { AuthUser } from "../types/auth.types";

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);