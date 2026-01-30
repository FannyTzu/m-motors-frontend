import { AuthProvider, useAuthContext } from "./AuthContext";
import { renderHook } from "@testing-library/react";
import * as authService from "../service/auth.service";
import { act } from "react";

jest.mock("../service/auth.service");

const mockRegister = authService.registerRequest as jest.Mock;
const mockLogin = authService.loginRequest as jest.Mock;
const mockLogout = authService.logoutRequest as jest.Mock;

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );
  it("le contexte doit se lancer correctement", () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
  it("register met à jour la valeur de user et accessToken", async () => {
    mockRegister.mockResolvedValue({
      user: { id: 1, mail: "test@mail.com", role: "user" },
      accessToken: "token123",
    });
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.register("test@mail.com", "password");
    });

    expect(result.current.user).toEqual({
      id: 1,
      mail: "test@mail.com",
      role: "user",
    });
    expect(result.current.accessToken).toBe("token123");
    expect(result.current.isAuthenticated).toBe(true);
  });
  it("le login met à jour la valeur user et accessToken", async () => {
    mockLogin.mockResolvedValue({
      user: { id: 2, mail: "login@mail.com", role: "admin" },
      accessToken: "token456",
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.login("login@mail.com", "password");
    });

    expect(result.current.user).toEqual({
      id: 2,
      mail: "login@mail.com",
      role: "admin",
    });
    expect(result.current.accessToken).toBe("token456");
    expect(result.current.isAuthenticated).toBe(true);
  });
  it("logout réinitialise la valeur de user", async () => {
    mockLogout.mockResolvedValue({});

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current
        .register("test@mail.com", "password")
        .catch(() => {});
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("utiliser le hook sans le contexte remonte une erreur", () => {
    expect(() => {
      renderHook(() => useAuthContext());
    }).toThrow("useAuthContext must be used inside AuthProvider");
  });
});
