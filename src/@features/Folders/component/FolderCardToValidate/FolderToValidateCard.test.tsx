import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FolderToValidateCard from "./FolderToValidateCard";
import * as formatDateModule from "@/@utils/formatDate";

jest.mock("@/@utils/formatDate", () => ({
  formatDate: jest.fn(() => "01/01/2026"),
}));

describe("FolderToValidateCard", () => {
  const mockFolder = {
    id: 1,
    user_id: 4587,
    vehicle_id: 8534,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
  };

  const mockUser = {
    id: 4587,
    mail: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    phone_number: "0123456789",
  };

  const mockVehicle = {
    id: 8534,
    brand: "Peugi",
    model: "Station",
    type: "sale",
  };

  const mockOnConsultFolder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render folder card with correct data", () => {
    render(
      <FolderToValidateCard
        folder={mockFolder}
        user={mockUser}
        vehicle={mockVehicle}
        onConsultFolder={mockOnConsultFolder}
      />
    );

    // Check vehicle info
    expect(screen.getByText(/Peugi Station/)).toBeInTheDocument();
    expect(screen.getByText(/Vente/)).toBeInTheDocument();

    // Check user info
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/user@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/0123456789/)).toBeInTheDocument();

    // Check date
    expect(screen.getByText(/01\/01\/2026/)).toBeInTheDocument();
  });

  it("should display rental type when vehicle type is not sale", () => {
    const rentalVehicle = { ...mockVehicle, type: "rental" };

    render(
      <FolderToValidateCard
        folder={mockFolder}
        user={mockUser}
        vehicle={rentalVehicle}
        onConsultFolder={mockOnConsultFolder}
      />
    );

    expect(screen.getByText(/Location/)).toBeInTheDocument();
  });

  it("should call onConsultFolder with correct folderId when button is clicked", () => {
    render(
      <FolderToValidateCard
        folder={mockFolder}
        user={mockUser}
        vehicle={mockVehicle}
        onConsultFolder={mockOnConsultFolder}
      />
    );

    const button = screen.getByRole("button", {
      name: /Consulter le dossier/,
    });

    fireEvent.click(button);

    expect(mockOnConsultFolder).toHaveBeenCalledWith(1);
    expect(mockOnConsultFolder).toHaveBeenCalledTimes(1);
  });

  it("should render consult button", () => {
    render(
      <FolderToValidateCard
        folder={mockFolder}
        user={mockUser}
        vehicle={mockVehicle}
        onConsultFolder={mockOnConsultFolder}
      />
    );

    const button = screen.getByRole("button", {
      name: /Consulter le dossier/,
    });

    expect(button).toBeInTheDocument();
  });

  it("should display status placeholder", () => {
    render(
      <FolderToValidateCard
        folder={mockFolder}
        user={mockUser}
        vehicle={mockVehicle}
        onConsultFolder={mockOnConsultFolder}
      />
    );

    expect(screen.getByText(/Status à venir/)).toBeInTheDocument();
  });

  it("should format date correctly", () => {
    render(
      <FolderToValidateCard
        folder={mockFolder}
        user={mockUser}
        vehicle={mockVehicle}
        onConsultFolder={mockOnConsultFolder}
      />
    );

    expect(formatDateModule.formatDate).toHaveBeenCalledWith(
      mockFolder.created_at
    );
  });

  it("should handle multiple folder ids correctly", () => {
    const folder2 = { ...mockFolder, id: 2 };

    const { rerender } = render(
      <FolderToValidateCard
        folder={mockFolder}
        user={mockUser}
        vehicle={mockVehicle}
        onConsultFolder={mockOnConsultFolder}
      />
    );

    let button = screen.getByRole("button", { name: /Consulter le dossier/ });
    fireEvent.click(button);

    expect(mockOnConsultFolder).toHaveBeenCalledWith(1);

    mockOnConsultFolder.mockClear();

    rerender(
      <FolderToValidateCard
        folder={folder2}
        user={mockUser}
        vehicle={mockVehicle}
        onConsultFolder={mockOnConsultFolder}
      />
    );

    button = screen.getByRole("button", { name: /Consulter le dossier/ });
    fireEvent.click(button);

    expect(mockOnConsultFolder).toHaveBeenCalledWith(2);
  });
});
