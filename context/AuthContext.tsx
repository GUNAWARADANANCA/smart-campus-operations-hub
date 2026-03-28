"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, Role } from "@/lib/types";

const STORAGE_KEY = "smart-campus-auth-user";

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  login: (email: string, password: string, nameOverride?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function deriveRoleFromEmail(email: string): Role {
  const e = email.toLowerCase();
  if (e.includes("admin")) return "ADMIN";
  return "USER";
}

function buildUser(email: string, nameOverride?: string): AuthUser {
  const role = deriveRoleFromEmail(email);
  const name =
    nameOverride?.trim() ||
    (role === "ADMIN" ? "Admin User" : email.split("@")[0] || "User");
  return {
    id: `local-${email}`,
    name,
    email,
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setIsReady(true);
  }, []);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(
    (email: string, _password: string, nameOverride?: string) => {
      persist(buildUser(email, nameOverride));
    },
    [persist],
  );

  const logout = useCallback(() => {
    persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({ user, isReady, login, logout }),
    [user, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
