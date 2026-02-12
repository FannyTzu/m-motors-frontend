import {
  getMeRequest,
  loginRequest,
  refreshTokenRequest,
  registerRequest,
} from "./auth.service";

const mockFetch = fetch as jest.Mock;

describe("registerRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns data if registration succeeds", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, email: "test@example.com" }),
    });

    const result = await registerRequest("test@example.com", "password");

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );

    expect(result).toEqual({ id: 1, email: "test@example.com" });
  });
  it("throws an error if API returns an error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Email déjà utilisé" }),
    });

    await expect(
      registerRequest("test@example.com", "password")
    ).rejects.toThrow("Email déjà utilisé");
  });
  it("return data if login success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    const result = await loginRequest("test@example.com", "password");

    expect(result).toEqual({ id: 1 });
  });
  it("throws a default error if no message is returned", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(
      loginRequest("test@example.com", "badpassword")
    ).rejects.toThrow("L'identifiant ou le mot de passe est incorrect");
  });
  it("returns user if authentication succeeds", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, email: "test@example.com" }),
    });
    const result = await getMeRequest();
    expect(result).toEqual({ id: 1, email: "test@example.com" });
  });
  it("throws an error if user is not authenticated", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "Non authentifié" }),
    });
    await expect(getMeRequest()).rejects.toThrow("Not authenticated");
  });
  it("returns data if refresh token success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ accessToken: "new-token" }),
    });

    const result = await refreshTokenRequest();

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );
    expect(result).toEqual({ accessToken: "new-token" });
  });
  it("throws an error if refresh token fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Refresh failed" }),
    });

    await expect(refreshTokenRequest()).rejects.toThrow(
      "Failed to refresh token"
    );
  });
});
