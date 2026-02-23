export const createFolderRequest = async (data: {
  vehicleId: number;
  userId: number;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/folder/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create folder");
  }

  return response.json();
};

export const getFolderByUserIdRequest = async (userId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/folder/user/${userId}`,
    {
      method: "GET",

      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch folder");
  }

  return response.json();
};
