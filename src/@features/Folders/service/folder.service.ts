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
    if (response.status === 401) {
      throw new Error("Non authentifié");
    }
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

export const getFolderByIdRequest = async (folderId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/folder/${folderId}`,
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

export const getAllFoldersRequest = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch all folders");
  }

  return response.json();
};

export const updateFolderStatusRequest = async ({
  folderId,
  status,
}: {
  folderId: number;
  status:
    | "submitted"
    | "accepted"
    | "rejected"
    | "closed"
    | "cancelled"
    | "archived";
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/folder/${folderId}/status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update folder status");
  }
  return response.json();
};

export const deleteFolderRequest = async (folderId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/folder/${folderId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete folder");
  }

  const text = await response.text();
  if (!text || text.trim() === "") {
    return { success: true };
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { success: true };
  }
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

export const getDocumentsByIdRequest = async (folderId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/folder/${folderId}`,

    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};

export const deleteDocumentRequest = async (documentId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete document");
  }
  return response.json();
};
