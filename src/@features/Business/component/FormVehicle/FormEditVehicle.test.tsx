import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormEditVehicle from "./FormEditVehicle";
import { useRouter } from "next/navigation";
import {
  getVehicleById,
  updateVehicle,
} from "@/@features/Vehicles/service/vehicle.service";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/@features/Vehicles/service/vehicle.service", () => ({
  getVehicleById: jest.fn(),
  updateVehicle: jest.fn(),
}));

jest.mock("lucide-react", () => ({
  CircleX: () => <span data-testid="icon-error" />,
}));

const mockPush = jest.fn();
const mockGetVehicleById = getVehicleById as jest.MockedFunction<
  typeof getVehicleById
>;
const mockUpdateVehicle = updateVehicle as jest.MockedFunction<
  typeof updateVehicle
>;

const mockVehicle = {
  brand: "Opria",
  model: "S2",
  transmission: "manual" as const,
  year: 2020,
  energy: "Essence",
  km: 12000,
  color: "Noir",
  place: 4,
  door: 4,
  type: "sale" as const,
  price: 25000,
  image: "https://example.com/image.jpg",
  description: "Vehicule en tres bon etat",
  status: "available" as const,
};

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

describe("FormEditVehicle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("display shows a loading state at first", () => {
    mockGetVehicleById.mockImplementation(() => new Promise(() => {}));

    render(<FormEditVehicle vehicleId={1} />);

    expect(screen.getByText(/Chargement/)).toBeInTheDocument();
  });

  it("prefill the form after loading", async () => {
    mockGetVehicleById.mockResolvedValueOnce(mockVehicle);

    render(<FormEditVehicle vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Modifier le véhicule/)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Marque/)).toHaveValue("Opria");
    expect(screen.getByLabelText(/Modèle/)).toHaveValue("S2");
    expect(screen.getByLabelText(/Année/)).toHaveValue(2020);
  });

  it("displays an error if loading fails", async () => {
    mockGetVehicleById.mockRejectedValueOnce(new Error("API Error"));

    render(<FormEditVehicle vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/API Error/)).toBeInTheDocument();
    });
  });

  it("submits changes and redirects", async () => {
    mockGetVehicleById.mockResolvedValueOnce(mockVehicle);
    mockUpdateVehicle.mockResolvedValueOnce({ id: 1 });

    render(<FormEditVehicle vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Modifier le véhicule/)).toBeInTheDocument();
    });

    fillForm();
    fireEvent.submit(
      screen.getByRole("button", { name: /Enregistrer les modifications/ })
    );

    await waitFor(() => {
      expect(mockUpdateVehicle).toHaveBeenCalledWith(1, {
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
      expect(mockPush).toHaveBeenCalledWith("/business-space");
    });
  });

  it("displays an error if saving fails", async () => {
    mockGetVehicleById.mockResolvedValueOnce(mockVehicle);
    mockUpdateVehicle.mockRejectedValueOnce(new Error("Update Error"));

    render(<FormEditVehicle vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Modifier le véhicule/)).toBeInTheDocument();
    });

    fillForm();
    fireEvent.submit(
      screen.getByRole("button", { name: /Enregistrer les modifications/ })
    );

    await waitFor(() => {
      expect(screen.getByText(/Update Error/)).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("go back on Cancel", async () => {
    const backSpy = jest
      .spyOn(window.history, "back")
      .mockImplementation(() => {});

    mockGetVehicleById.mockResolvedValueOnce(mockVehicle);

    render(<FormEditVehicle vehicleId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Modifier le véhicule/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Annuler/ }));

    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });
});
