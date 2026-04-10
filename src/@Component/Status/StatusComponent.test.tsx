import { render, screen, waitFor } from "@testing-library/react";
import StatusComponent from "./StatusComponent";
import * as folderService from "@/@features/Folders/service/folder.service";

jest.mock("@/@features/Folders/service/folder.service");

const mockGetFolderByIdRequest =
  folderService.getFolderByIdRequest as jest.MockedFunction<
    typeof folderService.getFolderByIdRequest
  >;

describe("StatusComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    mockGetFolderByIdRequest.mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(<StatusComponent folderId={1} />);

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("should display error message when fetch fails", async () => {
    mockGetFolderByIdRequest.mockRejectedValueOnce(new Error("Fetch error"));

    render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Statut indisponible")).toBeInTheDocument();
    });
  });

  it("should display 'En attente d'envoi des documents' status for active folder", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "active",
    });

    render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Statut :")).toBeInTheDocument();
      expect(
        screen.getByText("En attente d'envoi des documents")
      ).toBeInTheDocument();
    });
  });

  it("should display 'Documents envoyés' status for submitted folder", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "submitted",
    });

    render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Documents envoyés")).toBeInTheDocument();
    });
  });

  it("should display 'En attente de paiement' status for accepted folder", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "accepted",
    });

    render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText("En attente de paiement")).toBeInTheDocument();
    });
  });

  it("should display 'Refusé' status for rejected folder", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "rejected",
    });

    render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Refusé")).toBeInTheDocument();
    });
  });

  it("should apply correct styling for active status", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "active",
    });

    const { container } = render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      const statusContainer = container.querySelector(".container");
      expect(statusContainer).toHaveStyle({
        backgroundColor: "#fff3cd",
        borderColor: "#e0c25f",
      });
    });
  });

  it("should apply correct styling for accepted status", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "accepted",
    });

    const { container } = render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      const statusContainer = container.querySelector(".container");
      expect(statusContainer).toHaveStyle({
        backgroundColor: "#d4edda",
        borderColor: "#28a745",
      });
    });
  });

  it("should apply correct styling for rejected status", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "rejected",
    });

    const { container } = render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      const statusContainer = container.querySelector(".container");
      expect(statusContainer).toHaveStyle({
        backgroundColor: "#f8d7da",
        borderColor: "#dc3545",
      });
    });
  });

  it("should call getFolderByIdRequest with correct folderId", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 42,
      status: "active",
    });

    render(<StatusComponent folderId={42} />);

    await waitFor(() => {
      expect(mockGetFolderByIdRequest).toHaveBeenCalledWith(42);
    });
  });

  it("should refetch when folderId prop changes", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "active",
    });

    const { rerender } = render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(mockGetFolderByIdRequest).toHaveBeenCalledWith(1);
    });

    jest.clearAllMocks();
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 2,
      status: "submitted",
    });

    rerender(<StatusComponent folderId={2} />);

    await waitFor(() => {
      expect(mockGetFolderByIdRequest).toHaveBeenCalledWith(2);
    });
  });

  it("should handle unknown status gracefully", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "unknown_status",
    });

    render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Statut non reconnu")).toBeInTheDocument();
    });
  });

  it("should render the correct icon for active status", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "active",
    });

    const { container } = render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("should render the correct icon for accepted status", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "accepted",
    });

    const { container } = render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("should display error when status is null", async () => {
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: null,
    });

    render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Statut indisponible")).toBeInTheDocument();
    });
  });

  it("should log console error when fetch fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const error = new Error("Network error");
    mockGetFolderByIdRequest.mockRejectedValueOnce(error);

    render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching folder status:",
        error
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("should log console warning for unknown status", async () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    mockGetFolderByIdRequest.mockResolvedValueOnce({
      id: 1,
      status: "future_status",
    });

    render(<StatusComponent folderId={1} />);

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Statut inconnu: future_status"
      );
    });

    consoleWarnSpy.mockRestore();
  });
});
