import { authHeaders } from "@/@features/Auth/service/auth.service";
import { catchAsync } from "@/@utils/catchAsync";

export const createFolderRequest = (data: {
  vehicleId: number;
  userId: number;
}) =>
  catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
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
    },
    { tags: { feature: "folder", action: "createFolder" } }
  );

export const getFolderByUserIdRequest = (userId: number) =>
  catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/user/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch folder");
      }

      return response.json();
    },
    { tags: { feature: "folder", action: "getFolderByUserId" } }
  );

export const getFolderByIdRequest = (folderId: number) =>
  catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/${folderId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch folder");
      }

      return response.json();
    },
    { tags: { feature: "folder", action: "getFolderById" } }
  );

export const getAllFoldersRequest = () =>
  catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch all folders");
      }

      return response.json();
    },
    { tags: { feature: "folder", action: "getAllFolders" } }
  );

export const updateFolderStatusRequest = ({
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
}) =>
  catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/${folderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update folder status");
      }
      return response.json();
    },
    { tags: { feature: "folder", action: "updateFolderStatus" } }
  );

export const deleteFolderRequest = (folderId: number) =>
  catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/${folderId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json", ...authHeaders() },
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
      } catch {
        return { success: true };
      }
    },
    { tags: { feature: "folder", action: "deleteFolder" } }
  );
