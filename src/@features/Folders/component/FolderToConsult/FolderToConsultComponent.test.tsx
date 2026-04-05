import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FolderToConsultComponent from "./FolderToConsultComponent";
import * as folderService from "../../service/folder.service";
import * as documentService from "../../service/document.service";

jest.mock("../../service/folder.service");
jest.mock("../../service/document.service");

jest.mock("@/@Component/Status/StatusComponent", () => {
  return function DummyStatusComponent() {
    return <div data-testid="status-component">Status Component</div>;
  };
});

jest.mock("@/@Component/ArrowBack/ArrowBack", () => {
  return function DummyArrowBack() {
    return <div data-testid="arrow-back">Arrow Back</div>;
  };
});

jest.mock("@/@utils/formatDate", () => ({
  formatDate: jest.fn(() => "01/01/2026"),
}));

const mockFolderService = folderService as jest.Mocked<typeof folderService>;
const mockDocumentService = documentService as jest.Mocked<
  typeof documentService
>;

describe("FolderToConsultComponent", () => {
  const mockFolder = {
    id: 1,
    user_id: 45,
    vehicle_id: 1240,
    status: "submitted",
    created_at: "2026-01-01T00:00:00Z",
    user: {
      id: 45,
      mail: "user@example.com",
      first_name: "John",
      last_name: "Doe",
      phone_number: "0123456789",
    },
    vehicle: {
      id: 1240,
      brand: "Touhita",
      model: "Serie 5",
      type: "sale",
    },
  };

  const mockDocuments = [
    {
      id: 1,
      type: "idCard",
      url: "https://example.com/id.pdf",
      name: "id.pdf",
    },
    {
      id: 2,
      type: "drivingLicense",
      url: "https://example.com/license.pdf",
      name: "license.pdf",
    },
    {
      id: 3,
      type: "rib",
      url: "https://example.com/rib.pdf",
      name: "rib.pdf",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFolderService.getFolderByIdRequest.mockResolvedValue(mockFolder);
    mockDocumentService.getDocumentsByIdRequest.mockResolvedValue(
      mockDocuments
    );
    mockFolderService.updateFolderStatusRequest.mockResolvedValue(mockFolder);
  });

  it("should render component with loading state initially", () => {
    mockFolderService.getFolderByIdRequest.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockFolder), 100))
    );

    render(<FolderToConsultComponent folderId={1} />);

    expect(screen.getByText(/Chargement du dossier/)).toBeInTheDocument();
  });

  it("should display folder details after loading", async () => {
    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Détail du dossier/)).toBeInTheDocument();
      expect(screen.getByText(/Informations véhicule/)).toBeInTheDocument();
      expect(screen.getByText(/Touhita Serie 5/)).toBeInTheDocument();
    });
  });

  it("should display folder vehicle information", async () => {
    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Touhita Serie 5/)).toBeInTheDocument();
      expect(screen.getByText(/Vente/)).toBeInTheDocument();
    });
  });

  it("should display folder user information", async () => {
    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/user@example.com/)).toBeInTheDocument();
      expect(screen.getByText(/0123456789/)).toBeInTheDocument();
    });
  });

  it("should display all documents with checkmarks", async () => {
    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Carte d'identité/)).toBeInTheDocument();
      expect(screen.getByText(/Permis de conduire/)).toBeInTheDocument();
      expect(screen.getByText(/RIB/)).toBeInTheDocument();
    });
  });

  it("should display view buttons for each document", async () => {
    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      const viewButtons = screen.getAllByText(/Voir/);
      expect(viewButtons.length).toBe(3);
    });
  });

  it("should display not provided message for missing documents", async () => {
    mockDocumentService.getDocumentsByIdRequest.mockResolvedValue([]);

    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      const notProvidedElements = screen.getAllByText(/Non fourni/);
      expect(notProvidedElements.length).toBe(3);
    });
  });

  it("should open document in new tab when view button is clicked", async () => {
    const windowOpenSpy = jest.spyOn(window, "open").mockImplementation();

    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      const viewButtons = screen.getAllByText(/Voir/);
      expect(viewButtons.length).toBeGreaterThan(0);
    });

    const firstViewButton = screen.getAllByText(/Voir/)[0];
    fireEvent.click(firstViewButton);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      "https://example.com/id.pdf",
      "_blank"
    );

    windowOpenSpy.mockRestore();
  });

  it("should display validate and reject buttons", async () => {
    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Valider/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Refuser/ })
      ).toBeInTheDocument();
    });
  });

  it("should call updateFolderStatusRequest with approved status when validating", async () => {
    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Valider/ })
      ).toBeInTheDocument();
    });

    const validateButton = screen.getByRole("button", { name: /Valider/ });
    fireEvent.click(validateButton);

    await waitFor(() => {
      expect(mockFolderService.updateFolderStatusRequest).toHaveBeenCalledWith({
        folderId: 1,
        status: "accepted",
      });
    });
  });

  it("should call updateFolderStatusRequest with rejected status when rejecting", async () => {
    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Refuser/ })
      ).toBeInTheDocument();
    });

    const rejectButton = screen.getByRole("button", { name: /Refuser/ });
    fireEvent.click(rejectButton);

    await waitFor(() => {
      expect(mockFolderService.updateFolderStatusRequest).toHaveBeenCalledWith({
        folderId: 1,
        status: "rejected",
      });
    });
  });

  it("should handle error when loading folder fails", async () => {
    mockFolderService.getFolderByIdRequest.mockRejectedValue(
      new Error("Failed to fetch folder")
    );

    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Erreur lors du chargement du dossier/)
      ).toBeInTheDocument();
    });
  });

  it("should handle error when folder is not found", async () => {
    mockFolderService.getFolderByIdRequest.mockResolvedValue(null);

    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Dossier introuvable/)).toBeInTheDocument();
    });
  });

  it("should display rental type when vehicle type is rental", async () => {
    const rentalFolder = {
      ...mockFolder,
      vehicle: { ...mockFolder.vehicle, type: "rental" },
    };
    mockFolderService.getFolderByIdRequest.mockResolvedValue(rentalFolder);

    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Location/)).toBeInTheDocument();
    });
  });

  it("should fetch folder data on mount", async () => {
    render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(mockFolderService.getFolderByIdRequest).toHaveBeenCalledWith(1);
      expect(mockDocumentService.getDocumentsByIdRequest).toHaveBeenCalledWith(
        1
      );
    });
  });

  it("should refetch data when folderId changes", async () => {
    const { rerender } = render(<FolderToConsultComponent folderId={1} />);

    await waitFor(() => {
      expect(mockFolderService.getFolderByIdRequest).toHaveBeenCalledWith(1);
    });

    mockFolderService.getFolderByIdRequest.mockClear();
    mockDocumentService.getDocumentsByIdRequest.mockClear();

    rerender(<FolderToConsultComponent folderId={2} />);

    await waitFor(() => {
      expect(mockFolderService.getFolderByIdRequest).toHaveBeenCalledWith(2);
    });
  });
});
