import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from "../lib/storage";

import type { AuthUser } from "../types/auth.types";

import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setAuthToken] = useState<string | null>(() => getToken());

  const [user, setUser] = useState<AuthUser | null>(() =>
    getStoredUser<AuthUser>(),
  );

  function login(newToken: string, newUser: AuthUser): void {
    setToken(newToken);
    setStoredUser(newUser);

    setAuthToken(newToken);
    setUser(newUser);
  }

  function logout(): void {
    clearAuthStorage();

    setAuthToken(null);
    setUser(null);
  }

  const isAuthenticated = Boolean(token);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      logout,
    }),
    [user, token, isAuthenticated],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}