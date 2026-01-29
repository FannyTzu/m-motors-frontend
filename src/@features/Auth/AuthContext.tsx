"use client";
import React, { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest } from "./auth.service";

type User = {
  id: number;
  mail: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const register = async (email: string, password: string) => {
    const { user, accessToken } = await registerRequest(email, password);
    setUser(user);
    setAccessToken(accessToken);
  };

  const login = async (email: string, password: string) => {
    const { user, accessToken } = await loginRequest(email, password);
    setUser(user);
    setAccessToken(accessToken);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated, register, login }}
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
