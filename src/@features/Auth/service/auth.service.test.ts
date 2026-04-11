import {
  getMeRequest,
  loginRequest,
  refreshTokenRequest,
  registerRequest,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
  updateMeRequest,
  logoutRequest,
  deleteUserAccountRequest,
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
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: "token123" }),
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    const result = await loginRequest("test@example.com", "password");

    expect(result).toEqual({ user: { id: 1 }, accessToken: "token123" });
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

describe("Token management", () => {
  beforeEach(() => {
    clearAccessToken();
  });

  it("should set and get access token", () => {
    const token = "test-token-random";
    setAccessToken(token);
    expect(getAccessToken()).toBe(token);
  });

  it("should clear access token", () => {
    setAccessToken("test-token-random");
    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("should return null if no token is set", () => {
    expect(getAccessToken()).toBeNull();
  });
});

describe("updateMeRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearAccessToken();
  });

  it("returns updated user data if update succeeds", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      phone: "123456789",
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, ...userData }),
    });

    const result = await updateMeRequest(userData);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      expect.objectContaining({
        method: "PATCH",
        credentials: "include",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(userData),
      })
    );

    expect(result).toEqual({ id: 1, ...userData });
  });

  it("throws an error if update fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Update failed" }),
    });

    await expect(updateMeRequest({ firstName: "John" })).rejects.toThrow(
      "Failed to update user information"
    );
  });
});

describe("logoutRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearAccessToken();
  });

  it("clears access token and calls logout endpoint", async () => {
    setAccessToken("test-token");

    mockFetch.mockResolvedValue({
      ok: true,
    });

    await logoutRequest();

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );

    expect(getAccessToken()).toBeNull();
  });

  it("clears access token even if request fails", async () => {
    setAccessToken("test-token-random");

    mockFetch.mockResolvedValue({
      ok: false,
    });

    await logoutRequest();

    expect(getAccessToken()).toBeNull();
  });
});

describe("deleteUserAccountRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearAccessToken();
  });

  it("deletes user account and clears token if successful", async () => {
    setAccessToken("test-token");

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Account deleted" }),
    });

    const result = await deleteUserAccountRequest();

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      expect.objectContaining({
        method: "DELETE",
        credentials: "include",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );

    expect(result).toEqual({ message: "Account deleted" });
    expect(getAccessToken()).toBeNull();
  });

  it("throws an error if delete fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Delete failed" }),
    });

    await expect(deleteUserAccountRequest()).rejects.toThrow(
      "Failed to delete user account"
    );
  });
});
