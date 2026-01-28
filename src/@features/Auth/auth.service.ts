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
  return response.json();
};
