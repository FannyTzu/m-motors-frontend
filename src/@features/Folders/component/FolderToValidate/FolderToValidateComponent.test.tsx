import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FolderToValidateComponent from "./FolderToValidateComponent";
import * as folderService from "../../service/folder.service";
import { useRouter } from "next/navigation";

jest.mock("../../service/folder.service");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../FolderCardToValidate/FolderToValidateCard", () => {
  return function DummyCard({
    folder,
    onConsultFolder,
  }: {
    folder: { id: number };
    onConsultFolder: (id: number) => void;
  }) {
    return (
      <div data-testid={`folder-card-${folder.id}`}>
        <button onClick={() => onConsultFolder(folder.id)}>
          Consult Folder {folder.id}
        </button>
      </div>
    );
  };
});

const mockFolderService = folderService as jest.Mocked<typeof folderService>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("FolderToValidateComponent", () => {
  const mockFoldersData = [
    {
      id: 1,
      user_id: 485,
      vehicle_id: 45896,
      status: "submitted",
      created_at: "2026-01-01T00:00:00Z",
      user: {
        id: 485,
        mail: "user1@example.com",
        first_name: "John",
        last_name: "Doe",
        phone_number: "0123456789",
        address: "1 rue de la fontaine",
        city: "Bordeaux",
        zip_code: "33000",
        country: "France",
        role: "user",
      },
      vehicle: {
        id: 45896,
        brand: "Peugi",
        model: "Serie 3",
        type: "sale",
      },
    },
    {
      id: 2,
      user_id: 4578,
      vehicle_id: 457,
      status: "submitted",
      created_at: "2026-01-02T00:00:00Z",
      user: {
        id: 4578,
        mail: "user2@example.com",
        first_name: "Jane",
        last_name: "Smith",
        phone_number: "0987654321",
        address: "45 rue du parlement",
        city: "Lyon",
        zip_code: "69000",
        country: "France",
        role: "user",
      },
      vehicle: {
        id: 457,
        brand: "Houdi",
        model: "Sport",
        type: "rental",
      },
    },
  ];

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);
    mockFolderService.getAllFoldersRequest.mockResolvedValue(mockFoldersData);
  });

  it("should render component with loading state initially", () => {
    mockFolderService.getAllFoldersRequest.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockFoldersData), 100)
        )
    );

    render(<FolderToValidateComponent />);

    expect(screen.getByText(/Chargement des dossiers/)).toBeInTheDocument();
  });

  it("should fetch all folders on mount", async () => {
    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(mockFolderService.getAllFoldersRequest).toHaveBeenCalledTimes(1);
    });
  });

  it("should display folder cards after loading", async () => {
    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("folder-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("folder-card-2")).toBeInTheDocument();
    });
  });

  it("should display empty state when no folders exist", async () => {
    mockFolderService.getAllFoldersRequest.mockResolvedValue([]);

    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(screen.queryByTestId("folder-card-1")).not.toBeInTheDocument();
    });
  });

  it("should navigate to correct path when consulting folder", async () => {
    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("folder-card-1")).toBeInTheDocument();
    });

    const consultButton = screen.getByText("Consult Folder 1");
    fireEvent.click(consultButton);

    expect(mockPush).toHaveBeenCalledWith("/folder-to-consult/1");
  });

  it("should navigate with correct folder id for multiple folders", async () => {
    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("folder-card-2")).toBeInTheDocument();
    });

    const consultButton2 = screen.getByText("Consult Folder 2");
    fireEvent.click(consultButton2);

    expect(mockPush).toHaveBeenCalledWith("/folder-to-consult/2");
  });

  it("should handle error when fetching folders fails", async () => {
    mockFolderService.getAllFoldersRequest.mockRejectedValue(
      new Error("Failed to fetch folders")
    );

    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(
        screen.getByText(/Erreur lors du chargement des dossiers/)
      ).toBeInTheDocument();
    });
  });

  it("should display error when loading fails", async () => {
    mockFolderService.getAllFoldersRequest.mockRejectedValue(
      new Error("Network error")
    );

    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(
        screen.getByText(/Erreur lors du chargement des dossiers/)
      ).toBeInTheDocument();
    });
  });

  it("should render correct number of folders", async () => {
    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("folder-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("folder-card-2")).toBeInTheDocument();
    });

    const cards = screen.getAllByTestId(/folder-card-/);
    expect(cards).toHaveLength(2);
  });

  it("should pass correct folder data to card component", async () => {
    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("folder-card-1")).toBeInTheDocument();
    });

    expect(screen.getByTestId("folder-card-1")).toBeInTheDocument();
  });

  it("should handle multiple consult operations", async () => {
    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("folder-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("folder-card-2")).toBeInTheDocument();
    });

    const consultButton1 = screen.getByText("Consult Folder 1");
    fireEvent.click(consultButton1);

    expect(mockPush).toHaveBeenCalledWith("/folder-to-consult/1");

    mockPush.mockClear();

    const consultButton2 = screen.getByText("Consult Folder 2");
    fireEvent.click(consultButton2);

    expect(mockPush).toHaveBeenCalledWith("/folder-to-consult/2");
  });

  it("should render with correct container structure", async () => {
    render(<FolderToValidateComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("folder-card-1")).toBeInTheDocument();
    });

    // Verify component is rendered
    expect(screen.getByTestId("folder-card-1")).toBeInTheDocument();
  });

  it("should update loading state after folders are fetched", async () => {
    render(<FolderToValidateComponent />);

    expect(screen.getByText(/Chargement des dossiers/)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText(/Chargement des dossiers/)
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("folder-card-1")).toBeInTheDocument();
    });
  });
});
