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

export const uploadDocumentRequest = async ({
  folderId,
  documentType,
  file,
}: {
  folderId: number;
  documentType: "idCard" | "drivingLicense" | "rib";
  file: File;
}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folderId", folderId.toString());
  formData.append("name", file.name);
  formData.append("type", documentType);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  return response.json();
};
