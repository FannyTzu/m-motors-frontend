import { AuthProvider, useAuthContext } from "./AuthContext";
import { renderHook, waitFor } from "@testing-library/react";
import * as authService from "../service/auth.service";
import { act } from "react";

jest.mock("../service/auth.service");

const mockRegister = authService.registerRequest as jest.Mock;
const mockLogin = authService.loginRequest as jest.Mock;
const mockLogout = authService.logoutRequest as jest.Mock;
const mockGetMe = authService.getMeRequest as jest.Mock;
const mockRefresh = authService.refreshTokenRequest as jest.Mock;

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetMe.mockRejectedValue(new Error("Not authenticated"));
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );
  it("context must run correctly", async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
  it("register updates value user and accessToken", async () => {
    mockRegister.mockResolvedValue({
      user: { id: 1, mail: "test@mail.com", role: "user" },
      accessToken: "token123",
    });
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

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
  it("login updates value user and accessToken", async () => {
    mockLogin.mockResolvedValue({
      user: { id: 2, mail: "login@mail.com", role: "admin" },
      accessToken: "token456",
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

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
  it("logout resets the user value", async () => {
    mockLogout.mockResolvedValue({});

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current
        .register("test@mail.com", "password")
        .catch(() => {});
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("refreshToken updates accessToken", async () => {
    mockRefresh.mockResolvedValue({ accessToken: "new-token" });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshToken();
    });

    expect(result.current.accessToken).toBe("new-token");
  });

  it("refreshToken fails and resets the session", async () => {
    mockRefresh.mockRejectedValue(new Error("Refresh failed"));

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await expect(result.current.refreshToken()).rejects.toThrow(
        "Refresh failed"
      );
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("using hook without context throws an error", () => {
    expect(() => {
      renderHook(() => useAuthContext());
    }).toThrow("useAuthContext must be used inside AuthProvider");
  });
});
