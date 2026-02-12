import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormCreateVehicle from "./FormCreateVehicle";
import { useRouter } from "next/navigation";
import { createVehicles } from "@/@features/Vehicles/service/vehicle.service";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/@features/Vehicles/service/vehicle.service", () => ({
  createVehicles: jest.fn(),
}));

jest.mock("lucide-react", () => ({
  CircleX: () => <span data-testid="icon-error" />,
}));

const mockPush = jest.fn();
const mockCreateVehicles = createVehicles as jest.MockedFunction<
  typeof createVehicles
>;

const fillForm = () => {
  fireEvent.change(screen.getByLabelText(/Marque/), {
    target: { value: "Opria" },
  });
  fireEvent.change(screen.getByLabelText(/Modèle/), {
    target: { value: "S2" },
  });
  fireEvent.change(screen.getByLabelText(/Transmission/), {
    target: { value: "manual" },
  });
  fireEvent.change(screen.getByLabelText(/Année/), {
    target: { value: "2020" },
  });
  fireEvent.change(screen.getByLabelText(/Énergie/), {
    target: { value: "Essence" },
  });
  fireEvent.change(screen.getByLabelText(/Kilométrage/), {
    target: { value: "12000" },
  });
  fireEvent.change(screen.getByLabelText(/Couleur/), {
    target: { value: "Noir" },
  });
  fireEvent.change(screen.getByLabelText(/places/), {
    target: { value: "4" },
  });
  fireEvent.change(screen.getByLabelText(/portes/), {
    target: { value: "4" },
  });
  fireEvent.change(screen.getByLabelText(/Type de/), {
    target: { value: "sale" },
  });
  fireEvent.change(screen.getByLabelText(/Statut/), {
    target: { value: "available" },
  });
  fireEvent.change(screen.getByLabelText(/Prix/), {
    target: { value: "25000" },
  });
  fireEvent.change(screen.getByLabelText(/Description/), {
    target: { value: "Vehicule en tres bon etat" },
  });
  fireEvent.change(screen.getByLabelText(/Image/), {
    target: { value: "https://example.com/image.jpg" },
  });
};

describe("FormCreateVehicle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it(" submit submits form and redirects", async () => {
    mockCreateVehicles.mockResolvedValueOnce({ id: 1 });

    render(<FormCreateVehicle />);
    fillForm();

    fireEvent.submit(screen.getByRole("button", { name: /Enregistrer/ }));

    await waitFor(() => {
      expect(mockCreateVehicles).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/business-space");
    });

    expect(mockCreateVehicles).toHaveBeenCalledWith({
      brand: "Opria",
      model: "S2",
      transmission: "manual",
      year: 2020,
      energy: "Essence",
      km: 12000,
      color: "Noir",
      place: 4,
      door: 4,
      type: "sale",
      price: 25000,
      image: "https://example.com/image.jpg",
      description: "Vehicule en tres bon etat",
      status: "available",
    });
  });

  it(" displays an error if creation fails", async () => {
    mockCreateVehicles.mockRejectedValueOnce(new Error("Erreur API"));

    render(<FormCreateVehicle />);
    fillForm();

    fireEvent.submit(screen.getByRole("button", { name: /Enregistrer/ }));

    await waitFor(() => {
      expect(screen.getByText(/Erreur API/)).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it(" displays a generic message if the error isn't an Error", async () => {
    mockCreateVehicles.mockRejectedValueOnce("Unknown error");

    render(<FormCreateVehicle />);
    fillForm();

    fireEvent.submit(screen.getByRole("button", { name: /Enregistrer/ }));

    await waitFor(() => {
      expect(
        screen.getByText(/Erreur lors de la création du véhicule/)
      ).toBeInTheDocument();
    });
  });

  it("change label price for rental", () => {
    render(<FormCreateVehicle />);

    const priceLabel = screen.getByText(/Prix/);
    expect(priceLabel).not.toHaveTextContent(/mois/);

    fireEvent.change(screen.getByLabelText(/Type de/), {
      target: { value: "rental" },
    });

    expect(screen.getByText(/Prix/)).toHaveTextContent(/mois/);
  });

  it("go back on Cancel", () => {
    const backSpy = jest
      .spyOn(window.history, "back")
      .mockImplementation(() => {});

    render(<FormCreateVehicle />);

    fireEvent.click(screen.getByRole("button", { name: /Annuler/ }));

    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });
});
