type User = {
  id: number;
  mail: string;
  role: string;
};

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};
export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const registerRequest = async (email: string, password: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Register failed");
  }

  const data = await response.json();
  if (data.accessToken) {
    setAccessToken(data.accessToken);
  }

  return data;
};

export const loginRequest = async (email: string, password: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(
      err.message || "L'identifiant ou le mot de passe est incorrect"
    );
  }
  const data = await response.json();
  if (data.accessToken) {
    setAccessToken(data.accessToken);
  }

  return data;
};

export const getMeRequest = async (): Promise<User> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken();
      throw new Error("Not authenticated");
    }
    throw new Error("Not authenticated");
  }
  return response.json();
};

export const logoutRequest = async () => {
  clearAccessToken();
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const refreshTokenRequest = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    clearAccessToken();
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  if (data.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
};
