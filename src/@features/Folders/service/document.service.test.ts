import {
  uploadDocumentRequest,
  getDocumentsByIdRequest,
  deleteDocumentRequest,
} from "./document.service";

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("uploadDocumentRequest", () => {
  it("should upload a document successfully", async () => {
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });
    const mockResponse = {
      id: 1,
      folderId: 1,
      type: "idCard",
      url: "https://example.com/documents/1",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as unknown as Response);

    const result = await uploadDocumentRequest({
      folderId: 1,
      documentType: "idCard",
      file: mockFile,
    });

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/documents`,
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1]?.body).toBeInstanceOf(FormData);
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error when document upload fails", async () => {
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as unknown as Response);

    await expect(
      uploadDocumentRequest({
        folderId: 1,
        documentType: "idCard",
        file: mockFile,
      })
    ).rejects.toThrow("Failed to upload document");
  });

  it("should handle all document types", async () => {
    const documentTypes = ["idCard", "drivingLicense", "rib"] as const;

    for (const docType of documentTypes) {
      const mockFile = new File(["content"], `${docType}.pdf`, {
        type: "application/pdf",
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          folderId: 1,
          type: docType,
          url: "https://example.com/documents/1",
        }),
      } as unknown as Response);

      const result = await uploadDocumentRequest({
        folderId: 1,
        documentType: docType,
        file: mockFile,
      });

      expect(result.type).toBe(docType);
    }
  });
});

describe("getDocumentsByIdRequest", () => {
  it("should fetch documents by folder id successfully", async () => {
    const mockDocuments = [
      {
        id: 1,
        folderId: 1,
        type: "idCard",
        url: "https://example.com/documents/1",
        name: "id.pdf",
      },
      {
        id: 2,
        folderId: 1,
        type: "drivingLicense",
        url: "https://example.com/documents/2",
        name: "license.pdf",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDocuments,
    } as unknown as Response);

    const result = await getDocumentsByIdRequest(1);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/folder/1`,
      expect.objectContaining({
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
    );
    expect(result).toEqual(mockDocuments);
  });

  it("should throw an error when fetching documents fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as unknown as Response);

    await expect(getDocumentsByIdRequest(1)).rejects.toThrow(
      "Failed to fetch documents"
    );
  });

  it("should return empty array when no documents found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as unknown as Response);

    const result = await getDocumentsByIdRequest(1);

    expect(result).toEqual([]);
  });
});

describe("deleteDocumentRequest", () => {
  it("should delete a document successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as unknown as Response);

    const result = await deleteDocumentRequest(1);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/1`,
      expect.objectContaining({
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
    );
    expect(result).toEqual({ success: true });
  });

  it("should throw an error when document deletion fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as unknown as Response);

    await expect(deleteDocumentRequest(1)).rejects.toThrow(
      "Failed to delete document"
    );
  });
});
