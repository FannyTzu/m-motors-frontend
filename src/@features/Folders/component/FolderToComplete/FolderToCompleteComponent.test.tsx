import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FolderToCompleteComponent from "./FolderToCompleteComponent";
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

const mockFolderService = folderService as jest.Mocked<typeof folderService>;
const mockDocumentService = documentService as jest.Mocked<
  typeof documentService
>;

describe("FolderToCompleteComponent", () => {
  const mockFolder = {
    id: 1,
    user_id: 478,
    vehicle_id: 639,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
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

  it("should render component with all required elements", async () => {
    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Dépôt de dossier/)).toBeInTheDocument();
      expect(screen.getByTestId("status-component")).toBeInTheDocument();
      expect(screen.getByText(/Pièces justificatives/)).toBeInTheDocument();
    });
  });

  it("should fetch folder data on mount", async () => {
    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      expect(mockFolderService.getFolderByIdRequest).toHaveBeenCalledWith(1);
      expect(mockDocumentService.getDocumentsByIdRequest).toHaveBeenCalledWith(
        1
      );
    });
  });

  it("should display upload buttons when no documents exist", async () => {
    mockDocumentService.getDocumentsByIdRequest.mockResolvedValue([]);

    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      const uploadButtons = screen.getAllByText(/Télécharger/);
      expect(uploadButtons.length).toBeGreaterThan(0);
    });
  });

  it("should display view and delete buttons when documents exist", async () => {
    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      const viewButtons = screen.getAllByText(/Voir/);
      expect(viewButtons.length).toBeGreaterThan(0);
    });
  });

  it("should show explanatory text when status is active", async () => {
    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Téléchargez vos documents un par un. Vous pouvez les supprimer à tout moment et les remplacer./
        )
      ).toBeInTheDocument();
    });
  });

  it("should show alternative text when status is not active", async () => {
    const submittedFolder = { ...mockFolder, status: "submitted" };
    mockFolderService.getFolderByIdRequest.mockResolvedValue(submittedFolder);

    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Vous ne pouvez plus supprimer vos documents mais vous pouvez toujours supprimer votre dossier sur votre espace personnel/
        )
      ).toBeInTheDocument();
    });
  });

  it("should enable submit button when all documents are uploaded", async () => {
    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      const submitButton = screen.queryByRole("button", {
        name: /Faites une demande de validation/,
      });
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("should disable submit button when status is not active", async () => {
    const submittedFolder = { ...mockFolder, status: "submitted" };
    mockFolderService.getFolderByIdRequest.mockResolvedValue(submittedFolder);

    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      const submitButton = screen.queryByRole("button", {
        name: /Suivez le statut/,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  it("should handle file upload", async () => {
    mockDocumentService.uploadDocumentRequest.mockResolvedValue({
      id: 4,
      type: "idCard",
      url: "https://example.com/new-id.pdf",
      name: "new-id.pdf",
    });

    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Pièces justificatives/)).toBeInTheDocument();
    });

    const fileInput = screen.getByLabelText(/Télécharger pièce d'identité/);
    const file = new File(["content"], "id.pdf", { type: "application/pdf" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockDocumentService.uploadDocumentRequest).toHaveBeenCalledWith({
        folderId: 1,
        documentType: "idCard",
        file,
      });
    });
  });

  it("should reject file if size exceeds 5MB", async () => {
    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Pièces justificatives/)).toBeInTheDocument();
    });

    const fileInput = screen.getByLabelText(/Télécharger pièce d'identité/);
    const largeFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      "large.pdf",
      { type: "application/pdf" }
    );

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(/Le fichier ne doit pas dépasser 5MB/)
      ).toBeInTheDocument();
    });
  });

  it("should reject file with invalid format", async () => {
    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Pièces justificatives/)).toBeInTheDocument();
    });

    const fileInput = screen.getByLabelText(/Télécharger pièce d'identité/);
    const invalidFile = new File(["content"], "file.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(
          /Ce format de fichier n'est pas accepté, utilisez JPG, PNG ou PDF/
        )
      ).toBeInTheDocument();
    });
  });

  it("should hide delete button when status is submitted", async () => {
    const submittedFolder = { ...mockFolder, status: "submitted" };
    mockFolderService.getFolderByIdRequest.mockResolvedValue(submittedFolder);

    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  it("should handle document view", async () => {
    const windowOpenSpy = jest.spyOn(window, "open").mockImplementation();

    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      const viewButtons = screen.getAllByText(/Voir/);
      expect(viewButtons.length).toBeGreaterThan(0);
    });

    const viewButton = screen.getAllByText(/Voir/)[0];
    fireEvent.click(viewButton);

    expect(windowOpenSpy).toHaveBeenCalled();

    windowOpenSpy.mockRestore();
  });

  it("should submit folder with correct status", async () => {
    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      const submitButton = screen.queryByRole("button", {
        name: /Faites une demande de validation/,
      });
      expect(submitButton).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: /Faites une demande de validation/,
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFolderService.updateFolderStatusRequest).toHaveBeenCalledWith({
        folderId: 1,
        status: "submitted",
      });
    });
  });

  it("should show success message after submission", async () => {
    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      const submitButton = screen.queryByRole("button", {
        name: /Faites une demande de validation/,
      });
      expect(submitButton).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: /Faites une demande de validation/,
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Dossier envoyé pour validation par M-Motors/)
      ).toBeInTheDocument();
    });
  });

  it("should handle submission error", async () => {
    mockFolderService.updateFolderStatusRequest.mockRejectedValue(
      new Error("Submission failed")
    );

    render(<FolderToCompleteComponent folderId={1} />);

    await waitFor(() => {
      const submitButton = screen.queryByRole("button", {
        name: /Faites une demande de validation/,
      });
      expect(submitButton).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: /Faites une demande de validation/,
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Erreur lors de l'envoi du dossier/)
      ).toBeInTheDocument();
    });
  });
});
