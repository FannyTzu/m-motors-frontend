import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CardVehicleCatalog from "./CardVehicleCatalog";
import * as vehicleService from "@/@features/Vehicles/service/vehicle.service";
import { useRouter } from "next/navigation";

interface MockModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText: string;
  cancelText: string;
}

jest.mock("@/@features/Vehicles/service/vehicle.service");
jest.mock("next/navigation");
jest.mock("@/@Component/Modal/Modal", () => {
  return function Modal(props: MockModalProps) {
    return (
      <div data-testid="mock-modal">
        <div>{props.title}</div>
        <div>{props.description}</div>
        <button
          onClick={props.onConfirm}
          disabled={props.confirmText?.includes("...")}
        >
          {props.confirmText}
        </button>
        <button onClick={props.onClose}>{props.cancelText}</button>
      </div>
    );
  };
});

const mockVehicle = {
  id: 1,
  image: "/car.jpg",
  status: "available",
  brand: "Houdi",
  model: "Z4",
  year: 2023,
  km: 15000,
  energy: "Essence",
  transmission: "automatic",
  price: 25000,
  type: "sale",
};

const mockRentalVehicle = {
  ...mockVehicle,
  type: "rental",
  price: 450,
};

describe("CardVehicleCatalog", () => {
  const mockPush = jest.fn();
  const mockOnDelete = jest.fn();
  const mockDeleteVehicleById = vehicleService.deleteVehicleById as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockDeleteVehicleById.mockResolvedValue({ success: true });
  });

  it("should render vehicle card with all details", () => {
    render(<CardVehicleCatalog {...mockVehicle} />);

    expect(screen.getByText("Houdi Z4")).toBeInTheDocument();
    expect(screen.getByText("Disponible")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("15000 km")).toBeInTheDocument();
    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText("Automatique")).toBeInTheDocument();
    expect(screen.getByText(/25\s*000/)).toBeInTheDocument();
  });

  it("should display edit and delete buttons", () => {
    render(<CardVehicleCatalog {...mockVehicle} />);

    expect(screen.getByText("Modifier")).toBeInTheDocument();
    expect(screen.getByText("Supprimer")).toBeInTheDocument();
  });

  it("should navigate to edit page when edit button is clicked", () => {
    render(<CardVehicleCatalog {...mockVehicle} />);

    const editButton = screen.getByText("Modifier");
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledWith("/business-space/update/1");
  });

  it("should show delete confirmation modal when delete button is clicked", () => {
    render(<CardVehicleCatalog {...mockVehicle} />);

    const deleteButton = screen.getByText("Supprimer");
    fireEvent.click(deleteButton);

    expect(screen.getByText("Supprimer le véhicule ?")).toBeInTheDocument();
    expect(
      screen.getByText(/Êtes-vous sûr de vouloir supprimer/)
    ).toBeInTheDocument();
  });

  it("should delete vehicle and call onDelete when confirmed", async () => {
    render(<CardVehicleCatalog {...mockVehicle} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText("Supprimer");
    fireEvent.click(deleteButton);

    const modal = screen.getByTestId("mock-modal");
    const confirmButton = modal.querySelector("button");
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }

    await waitFor(() => {
      expect(mockDeleteVehicleById).toHaveBeenCalledWith(1);
      expect(mockOnDelete).toHaveBeenCalled();
    });
  });

  it("should close modal without deleting when cancel is clicked", () => {
    render(<CardVehicleCatalog {...mockVehicle} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText("Supprimer");
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText("Annuler");
    fireEvent.click(cancelButton);

    expect(mockDeleteVehicleById).not.toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it("should display rental price with per month unit", () => {
    render(<CardVehicleCatalog {...mockRentalVehicle} />);

    expect(screen.getByText(/450/)).toBeInTheDocument();
    expect(screen.getByText("/ mois")).toBeInTheDocument();
  });

  it("should not display per month text for sale vehicle", () => {
    render(<CardVehicleCatalog {...mockVehicle} />);

    expect(screen.queryByText("/ mois")).not.toBeInTheDocument();
  });

  it("should format price with French locale", () => {
    render(<CardVehicleCatalog {...mockVehicle} price={1234567} />);

    expect(screen.getByText(/1\s*234\s*567/)).toBeInTheDocument();
  });

  it("should convert transmission labels correctly", () => {
    const { rerender } = render(
      <CardVehicleCatalog {...mockVehicle} transmission="automatic" />
    );

    expect(screen.getByText("Automatique")).toBeInTheDocument();

    jest.clearAllMocks();
    rerender(<CardVehicleCatalog {...mockVehicle} transmission="manual" />);

    expect(screen.getByText("Manuelle")).toBeInTheDocument();
  });

  it("should convert status labels correctly", () => {
    const { rerender } = render(
      <CardVehicleCatalog {...mockVehicle} status="available" />
    );

    expect(screen.getByText("Disponible")).toBeInTheDocument();

    jest.clearAllMocks();
    rerender(<CardVehicleCatalog {...mockVehicle} status="reserved" />);

    expect(screen.getByText("Réservé")).toBeInTheDocument();

    jest.clearAllMocks();
    rerender(<CardVehicleCatalog {...mockVehicle} status="sold" />);

    expect(screen.getByText("Vendu")).toBeInTheDocument();
  });

  it("should handle deletion error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();
    mockDeleteVehicleById.mockRejectedValue(new Error("Erreur serveur"));

    render(<CardVehicleCatalog {...mockVehicle} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText("Supprimer");
    fireEvent.click(deleteButton);

    const modal = screen.getByTestId("mock-modal");
    const confirmButton = modal.querySelector("button");
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Erreur lors de la suppression"),
        expect.any(Error)
      );
      expect(alertSpy).toHaveBeenCalledWith("Erreur serveur");
      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it("should disable buttons during deletion", async () => {
    mockDeleteVehicleById.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<CardVehicleCatalog {...mockVehicle} onDelete={mockOnDelete} />);

    // Get references to the card buttons before clicking
    const editButton = screen.getByText("Modifier");
    const cardDeleteButtons = screen.getAllByText("Supprimer");
    const cardDeleteButton = cardDeleteButtons[0]; // The card's delete button

    fireEvent.click(cardDeleteButton);

    const modal = screen.getByTestId("mock-modal");
    const confirmButton = modal.querySelector("button");
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }

    // Wait for the buttons to be disabled
    await waitFor(() => {
      expect(editButton).toBeDisabled();
      expect(cardDeleteButton).toBeDisabled();
    });

    // Wait for deletion to complete
    await waitFor(() => {
      expect(mockDeleteVehicleById).toHaveBeenCalled();
    });
  });

  it("should show loading text during deletion", async () => {
    mockDeleteVehicleById.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<CardVehicleCatalog {...mockVehicle} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText("Supprimer");
    fireEvent.click(deleteButton);

    const modal = screen.getByTestId("mock-modal");
    const confirmButton = modal.querySelector("button");
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }

    expect(screen.getByText("Suppression...")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDeleteVehicleById).toHaveBeenCalled();
    });
  });

  it("should render image with correct alt text", () => {
    render(<CardVehicleCatalog {...mockVehicle} />);

    const image = screen.getByAltText("Houdi Z4");
    expect(image).toBeInTheDocument();
  });

  it("should not call onDelete if onDelete is not provided", async () => {
    render(<CardVehicleCatalog {...mockVehicle} />);

    const deleteButton = screen.getByText("Supprimer");
    fireEvent.click(deleteButton);

    const modal = screen.getByTestId("mock-modal");
    const confirmButton = modal.querySelector("button");
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }

    await waitFor(() => {
      expect(mockDeleteVehicleById).toHaveBeenCalledWith(1);
    });
  });
});
