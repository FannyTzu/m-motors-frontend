"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginRequest,
  logoutRequest,
  registerRequest,
  getMeRequest,
  refreshTokenRequest,
} from "../service/auth.service";
import { catchAsync } from "@/@utils/catchAsync";
import { addBreadcrumb } from "@/@utils/sentry";

type User = {
  id: number;
  mail: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (
    email: string,
    password: string
  ) => Promise<{ user: User; accessToken: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User; accessToken: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const userData = await getMeRequest();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const register = async (email: string, password: string) => {
    addBreadcrumb("Auth register", "auth");
    const { user, accessToken } = await catchAsync(
      () => registerRequest(email, password),
      {
        tags: { feature: "auth", action: "register" },
        extra: { email },
      }
    );
    setUser(user);
    setAccessToken(accessToken);
    return { user, accessToken };
  };

  const login = async (email: string, password: string) => {
    addBreadcrumb("Auth login", "auth");
    const { user, accessToken } = await catchAsync(
      () => loginRequest(email, password),
      {
        tags: { feature: "auth", action: "login" },
        extra: { email },
      }
    );
    setUser(user);
    setAccessToken(accessToken);
    return { user, accessToken };
  };

  const logout = async () => {
    addBreadcrumb("Auth logout", "auth");
    await catchAsync(() => logoutRequest(), {
      tags: { feature: "auth", action: "logout" },
    });
    setUser(null);
    setAccessToken(null);
  };

  const refreshToken = async () => {
    const newTokenData = await catchAsync(() => refreshTokenRequest(), {
      tags: { feature: "auth", action: "refreshToken" },
    });
    setAccessToken(newTokenData.accessToken);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
};
