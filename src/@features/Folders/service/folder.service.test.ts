import {
  createFolderRequest,
  getFolderByUserIdRequest,
  getFolderByIdRequest,
  getAllFoldersRequest,
  updateFolderStatusRequest,
} from "./folder.service";

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("Folder Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createFolderRequest", () => {
    it("should create a folder successfully", async () => {
      const mockData = { id: 1, vehicleId: 145878, userId: 458 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as unknown as unknown as Response);

      const result = await createFolderRequest({
        vehicleId: 145878,
        userId: 458,
      });

      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/create`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ vehicleId: 145878, userId: 458 }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("should throw an error when folder creation fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as unknown as unknown as Response);

      await expect(
        createFolderRequest({ vehicleId: 145878, userId: 458 })
      ).rejects.toThrow("Failed to create folder");
    });
  });

  describe("getFolderByUserIdRequest", () => {
    it("should fetch folders by user id successfully", async () => {
      const mockFolders = [
        { id: 1, user_id: 458, vehicle_id: 145878, status: "active" },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFolders,
      } as unknown as Response);

      const result = await getFolderByUserIdRequest(458);

      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/user/458`,
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
      );
      expect(result).toEqual(mockFolders);
    });

    it("should throw an error when fetching folders by user id fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as unknown as Response);

      await expect(getFolderByUserIdRequest(458)).rejects.toThrow(
        "Failed to fetch folder"
      );
    });
  });

  describe("getFolderByIdRequest", () => {
    it("should fetch a folder by id successfully", async () => {
      const mockFolder = {
        id: 1,
        user_id: 458,
        vehicle_id: 145878,
        status: "active",
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFolder,
      } as unknown as Response);

      const result = await getFolderByIdRequest(1);

      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/1`,
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
      );
      expect(result).toEqual(mockFolder);
    });

    it("should throw an error when fetching folder by id fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as unknown as Response);

      await expect(getFolderByIdRequest(1)).rejects.toThrow(
        "Failed to fetch folder"
      );
    });
  });

  describe("getAllFoldersRequest", () => {
    it("should fetch all folders successfully", async () => {
      const mockFolders = [
        {
          id: 1,
          user_id: 458,
          vehicle_id: 145878,
          status: "active",
        },
        {
          id: 2,
          user_id: 459,
          vehicle_id: 145879,
          status: "submitted",
        },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFolders,
      } as unknown as Response);

      const result = await getAllFoldersRequest();

      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/folder`,
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
      );
      expect(result).toEqual(mockFolders);
    });

    it("should throw an error when fetching all folders fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as unknown as Response);

      await expect(getAllFoldersRequest()).rejects.toThrow(
        "Failed to fetch all folders"
      );
    });
  });

  describe("updateFolderStatusRequest", () => {
    it("should update folder status successfully", async () => {
      const mockUpdatedFolder = {
        id: 1,
        user_id: 458,
        vehicle_id: 145878,
        status: "submitted",
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedFolder,
      } as unknown as Response);

      const result = await updateFolderStatusRequest({
        folderId: 1,
        status: "submitted",
      });

      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/1/status`,
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: "submitted" }),
        })
      );
      expect(result).toEqual(mockUpdatedFolder);
    });

    it("should throw an error when updating folder status fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as unknown as Response);

      await expect(
        updateFolderStatusRequest({ folderId: 1, status: "accepted" })
      ).rejects.toThrow("Failed to update folder status");
    });

    it("should handle all valid status values", async () => {
      const statuses = [
        "submitted",
        "accepted",
        "rejected",
        "closed",
        "cancelled",
        "archived",
      ] as const;

      for (const status of statuses) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, status }),
        } as unknown as Response);

        const result = await updateFolderStatusRequest({
          folderId: 1,
          status,
        });

        expect(result.status).toBe(status);
      }
    });
  });

  describe("Error handling", () => {
    it("should properly handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getFolderByIdRequest(1)).rejects.toThrow("Network error");
    });

    it("should properly handle JSON parsing errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      await expect(getFolderByIdRequest(1)).rejects.toThrow("Invalid JSON");
    });
  });
});
