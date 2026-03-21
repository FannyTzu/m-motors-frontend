import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DetailsViewContent from "./DetailedViewContent";
import * as vehicleService from "../Vehicles/service/vehicle.service";
import * as folderService from "../Folders/service/folder.service";
import * as authHook from "../Auth/hook/useAuth";
import { useRouter } from "next/navigation";

jest.mock("../Vehicles/service/vehicle.service");
jest.mock("../Folders/service/folder.service");
jest.mock("../Auth/hook/useAuth");
jest.mock("next/navigation");
jest.mock("@/@Component/ArrowBack/ArrowBack", () => {
  return function DummyArrowBack() {
    return <div>ArrowBack</div>;
  };
});

const mockVehicle = {
  image: "/car.jpg",
  brand: "Tahueta",
  model: "Airsport",
  year: 2023,
  km: 15000,
  energy: "Essence",
  transmission: "automatic",
  color: "Bleu",
  door: 4,
  place: 5,
  description: "Une excellente voiture familiale",
  price: 25000,
  type: "sale",
};

const mockRentalVehicle = {
  ...mockVehicle,
  type: "rental",
  price: 450,
};

describe("DetailsViewContent", () => {
  const mockPush = jest.fn();
  const mockGetVehicleById = vehicleService.getVehicleById as jest.Mock;
  const mockCreateFolderRequest =
    folderService.createFolderRequest as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseAuth = authHook.useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseAuth.mockReturnValue({
      user: {
        id: 123,
        firstName: "Jean",
        lastName: "Dupont",
        phone: "0612345678",
        address: "11 rue de la fontaine",
      },
    });
    mockGetVehicleById.mockResolvedValue(mockVehicle);
    mockCreateFolderRequest.mockResolvedValue({ success: true });
  });

  it("should display loading message while fetching vehicle", () => {
    mockGetVehicleById.mockImplementation(() => new Promise(() => {}));

    render(<DetailsViewContent vehicleId={1} />);

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("should display vehicle details after loading", async () => {
    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Tahueta Airsport")).toBeInTheDocument();
    });

    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("15000")).toBeInTheDocument();
    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText("Automatique")).toBeInTheDocument();
    expect(
      screen.getByText("Une excellente voiture familiale")
    ).toBeInTheDocument();
    expect(screen.getByText("Bleu")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should display price for sale vehicle", async () => {
    mockGetVehicleById.mockResolvedValue(mockVehicle);

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Paiement comptant")).toBeInTheDocument();
      expect(screen.getByText(/25\s*000/)).toBeInTheDocument();
    });
  });

  it("should display rental price for rental vehicle", async () => {
    mockGetVehicleById.mockResolvedValue(mockRentalVehicle);

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Location longue durée")).toBeInTheDocument();
      expect(screen.getByText(/450/)).toBeInTheDocument();
      expect(screen.getByText("/ mois")).toBeInTheDocument();
    });
  });

  it("should display error message when vehicle fetch fails", async () => {
    const errorMessage = "Erreur réseau";
    mockGetVehicleById.mockRejectedValue(new Error(errorMessage));

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Erreur : " + errorMessage)).toBeInTheDocument();
    });
  });

  it("should display vehicle not found message when vehicle is null", async () => {
    mockGetVehicleById.mockResolvedValue(null);

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Véhicule non trouvé")).toBeInTheDocument();
    });
  });

  it("should create folder and redirect when user is authenticated", async () => {
    mockCreateFolderRequest.mockResolvedValue({ success: true });

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Tahueta Airsport")).toBeInTheDocument();
    });

    const button = screen.getByText("Déposer mon dossier pour ce véhicule");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCreateFolderRequest).toHaveBeenCalledWith({
        vehicleId: 1,
        userId: 123,
      });
      expect(mockPush).toHaveBeenCalledWith("/user-space");
    });
  });

  it("should show modal when user is not authenticated", async () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Tahueta Airsport")).toBeInTheDocument();
    });

    const button = screen.getByText("Déposer mon dossier pour ce véhicule");
    fireEvent.click(button);

    expect(screen.getByText("Vous n'êtes pas connecté")).toBeInTheDocument();
    expect(
      screen.getByText(/Vous devez être connecté pour créer un dossier/)
    ).toBeInTheDocument();
  });

  it("should redirect to login when modal confirms", async () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Tahueta Airsport")).toBeInTheDocument();
    });

    const button = screen.getByText("Déposer mon dossier pour ce véhicule");
    fireEvent.click(button);

    const loginButton = screen.getByText("Se connecter");
    fireEvent.click(loginButton);

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should close modal when cancel is clicked", async () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Tahueta Airsport")).toBeInTheDocument();
    });

    const button = screen.getByText("Déposer mon dossier pour ce véhicule");
    fireEvent.click(button);

    const cancelButton = screen.getByText("Annuler");
    fireEvent.click(cancelButton);

    expect(
      screen.queryByText("Vous n'êtes pas connecté")
    ).not.toBeInTheDocument();
  });

  it("should handle folder creation error gracefully", async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 123,
        firstName: "Jean",
        lastName: "Dupont",
        phone: "0612345678",
        address: "11 rue de la fontaine",
      },
    });
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockCreateFolderRequest.mockRejectedValue(new Error("Erreur serveur"));

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Tahueta Airsport")).toBeInTheDocument();
    });

    const button = screen.getByText("Déposer mon dossier pour ce véhicule");
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Erreur lors de la création du dossier"),
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("should convert transmission labels correctly", async () => {
    mockGetVehicleById.mockResolvedValue({
      ...mockVehicle,
      transmission: "manual",
    });

    render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Manuelle")).toBeInTheDocument();
    });
  });

  it("should fetch vehicle with correct vehicleId", async () => {
    render(<DetailsViewContent vehicleId={42} />);

    await waitFor(() => {
      expect(mockGetVehicleById).toHaveBeenCalledWith(42);
    });
  });

  it("should refetch vehicle when vehicleId changes", async () => {
    const { rerender } = render(<DetailsViewContent vehicleId={1} />);

    await waitFor(() => {
      expect(mockGetVehicleById).toHaveBeenCalledWith(1);
    });

    jest.clearAllMocks();
    mockGetVehicleById.mockResolvedValue(mockVehicle);

    rerender(<DetailsViewContent vehicleId={2} />);

    await waitFor(() => {
      expect(mockGetVehicleById).toHaveBeenCalledWith(2);
    });
  });
});
