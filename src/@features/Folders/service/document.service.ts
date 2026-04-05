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
