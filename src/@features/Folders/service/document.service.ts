import { catchAsync } from "@/@utils/catchAsync";

export const uploadDocumentRequest = ({
  folderId,
  documentType,
  file,
}: {
  folderId: number;
  documentType: "idCard" | "drivingLicense" | "rib";
  file: File;
}) =>
  catchAsync(
    async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderId", folderId.toString());
      formData.append("name", file.name);
      formData.append("type", documentType);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/documents`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      return response.json();
    },
    { tags: { feature: "document", action: "uploadDocument" } }
  );

export const getDocumentsByIdRequest = (folderId: number) =>
  catchAsync(
    async () => {
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
    },
    { tags: { feature: "document", action: "getDocumentsById" } }
  );

export const deleteDocumentRequest = (documentId: number) =>
  catchAsync(
    async () => {
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
    },
    { tags: { feature: "document", action: "deleteDocument" } }
  );
