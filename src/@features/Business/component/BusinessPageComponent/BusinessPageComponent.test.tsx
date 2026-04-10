import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BusinessPageComponent from "./BusinessPageComponent";

jest.mock("../VehicleCatalogComponent/VehicleCatalogComponent", () => {
  return function MockVehicleCatalogComponent() {
    return <div data-testid="vehicle-catalog">Vehicle Catalog</div>;
  };
});

jest.mock(
  "@/@features/Folders/component/FolderToValidate/FolderToValidateComponent",
  () => {
    return function MockFolderToValidate() {
      return <div data-testid="folder-to-validate">Folder To Validate</div>;
    };
  }
);

describe("BusinessPageComponent", () => {
  it("renders the page title and subtitle", () => {
    render(<BusinessPageComponent />);
    expect(screen.getByText("Espace professionnel")).toBeInTheDocument();
    expect(
      screen.getByText("Gérez vos véhicules et les dossiers clients")
    ).toBeInTheDocument();
  });

  it("renders both tab buttons", () => {
    render(<BusinessPageComponent />);
    expect(
      screen.getByRole("button", { name: "Véhicules" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Dossiers clients" })
    ).toBeInTheDocument();
  });

  it("displays VehicleCatalogComponent by default", () => {
    render(<BusinessPageComponent />);
    expect(screen.getByTestId("vehicle-catalog")).toBeInTheDocument();
    expect(screen.queryByTestId("folder-to-validate")).not.toBeInTheDocument();
  });

  it("switches to clients tab when clicked", () => {
    render(<BusinessPageComponent />);
    const clientsButton = screen.getByRole("button", {
      name: "Dossiers clients",
    });

    fireEvent.click(clientsButton);

    expect(screen.queryByTestId("vehicle-catalog")).not.toBeInTheDocument();
    expect(screen.getByTestId("folder-to-validate")).toBeInTheDocument();
  });

  it("switches back to vehicles tab when clicked", () => {
    render(<BusinessPageComponent />);
    const clientsButton = screen.getByRole("button", {
      name: "Dossiers clients",
    });
    const vehiclesButton = screen.getByRole("button", { name: "Véhicules" });

    fireEvent.click(clientsButton);
    expect(screen.queryByTestId("vehicle-catalog")).not.toBeInTheDocument();

    fireEvent.click(vehiclesButton);
    expect(screen.getByTestId("vehicle-catalog")).toBeInTheDocument();
    expect(screen.queryByTestId("folder-to-validate")).not.toBeInTheDocument();
  });

  it("applies active class to vehicles tab by default", () => {
    render(<BusinessPageComponent />);
    const vehiclesButton = screen.getByRole("button", { name: "Véhicules" });

    expect(vehiclesButton).toHaveClass("tabButtonActive");
  });

  it("removes active class from vehicles tab when clients tab is clicked", () => {
    render(<BusinessPageComponent />);
    const vehiclesButton = screen.getByRole("button", { name: "Véhicules" });
    const clientsButton = screen.getByRole("button", {
      name: "Dossiers clients",
    });

    fireEvent.click(clientsButton);

    expect(vehiclesButton).not.toHaveClass("tabButtonActive");
    expect(clientsButton).toHaveClass("tabButtonActive");
  });

  it("applies active class to clients tab when clicked", () => {
    render(<BusinessPageComponent />);
    const clientsButton = screen.getByRole("button", {
      name: "Dossiers clients",
    });

    fireEvent.click(clientsButton);

    expect(clientsButton).toHaveClass("tabButtonActive");
  });

  it("toggles tabs correctly after multiple clicks", () => {
    render(<BusinessPageComponent />);
    const vehiclesButton = screen.getByRole("button", { name: "Véhicules" });
    const clientsButton = screen.getByRole("button", {
      name: "Dossiers clients",
    });

    //start on vehicles tab
    expect(screen.getByTestId("vehicle-catalog")).toBeInTheDocument();

    //switch to clients
    fireEvent.click(clientsButton);
    expect(screen.getByTestId("folder-to-validate")).toBeInTheDocument();

    //switch back to vehicles
    fireEvent.click(vehiclesButton);
    expect(screen.getByTestId("vehicle-catalog")).toBeInTheDocument();

    //switch to clients again
    fireEvent.click(clientsButton);
    expect(screen.getByTestId("folder-to-validate")).toBeInTheDocument();
  });
});
