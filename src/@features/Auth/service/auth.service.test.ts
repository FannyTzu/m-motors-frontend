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

  it("retourne les données si l'inscription réussit", async () => {
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
  it("throw une erreur si l'API retourne une erreur", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Email déjà utilisé" }),
    });

    await expect(
      registerRequest("test@example.com", "password")
    ).rejects.toThrow("Email déjà utilisé");
  });
  it("retourne les données si le login réussit", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    const result = await loginRequest("test@example.com", "password");

    expect(result).toEqual({ id: 1 });
  });
  it("throw une erreur par défaut si aucun message n'est retourné", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(
      loginRequest("test@example.com", "badpassword")
    ).rejects.toThrow("L'identifiant ou le mot de passe est incorrect");
  });
  it("retourne le user si authenification réussit", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, email: "test@example.com" }),
    });
    const result = await getMeRequest();
    expect(result).toEqual({ id: 1, email: "test@example.com" });
  });
  it("throw une erreur si le user n'est pas authentifié", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "Non authentifié" }),
    });
    await expect(getMeRequest()).rejects.toThrow("Not authenticated");
  });
  it("retourne les données si le refresh token réussit", async () => {
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
  it("throw une erreur si le refresh token échoue", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Refresh failed" }),
    });

    await expect(refreshTokenRequest()).rejects.toThrow(
      "Failed to refresh token"
    );
  });
});
