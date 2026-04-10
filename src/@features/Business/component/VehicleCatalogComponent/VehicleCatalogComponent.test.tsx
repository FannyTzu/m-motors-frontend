import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import VehicleCatalogComponent from "./VehicleCatalogComponent";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../DisplayCardVehicle/DisplayCardVehicle", () => {
  return function MockDisplayCardVehicle() {
    return <div data-testid="display-card-vehicle">Display Card Vehicle</div>;
  };
});

const mockUseRouter = useRouter as jest.Mock;

describe("VehicleCatalogComponent", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the add vehicle button", () => {
    render(<VehicleCatalogComponent />);
    const button = screen.getByRole("button", { name: /ajouter un véhicule/i });
    expect(button).toBeInTheDocument();
  });

  it("renders DisplayCardVehicle component", () => {
    render(<VehicleCatalogComponent />);
    const displayCard = screen.getByTestId("display-card-vehicle");
    expect(displayCard).toBeInTheDocument();
  });

  it("redirects to /business-space/create when add button is clicked", () => {
    render(<VehicleCatalogComponent />);
    const button = screen.getByRole("button", { name: /ajouter un véhicule/i });

    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith("/business-space/create");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("uses the router hook", () => {
    render(<VehicleCatalogComponent />);
    expect(mockUseRouter).toHaveBeenCalled();
  });
});
