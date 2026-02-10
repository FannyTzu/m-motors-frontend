import { render, screen, waitFor } from "@testing-library/react";
import DisplayCardVehicle from "./DisplayCardVehicle";
import { getVehicles } from "@/@features/Vehicles/service/vehicle.service";

jest.mock("@/@features/Vehicles/service/vehicle.service");
const mockGetVehicles = getVehicles as jest.MockedFunction<typeof getVehicles>;

jest.mock("../CardVehicle/CardVehicle", () => {
  return function MockCardVehicle({
    brand,
    model,
  }: {
    brand: string;
    model: string;
  }) {
    return <div data-testid="card-vehicle">{`${brand} ${model}`}</div>;
  };
});

describe("DisplayCardVehicle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche un loader pendant le chargement", () => {
    mockGetVehicles.mockImplementation(() => new Promise(() => {}));

    render(<DisplayCardVehicle />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("affiche les véhicules après le chargement", async () => {
    const mockVehicles = [
      {
        id: 1,
        image: "/car1.jpg",
        type: "sale",
        brand: "Opria road",
        model: "S100",
        year: 2023,
        km: 5000,
        energy: "Essence",
        price: 35000,
      },
      {
        id: 2,
        image: "/car2.jpg",
        type: "rental",
        brand: "BMXX",
        model: "Cargo",
        year: 2022,
        km: 10000,
        energy: "Diesel",
        price: 45000,
      },
    ];

    mockGetVehicles.mockResolvedValueOnce(mockVehicles);

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    const cards = screen.getAllByTestId("card-vehicle");
    expect(cards).toHaveLength(2);
    expect(screen.getByText("Opria road S100")).toBeInTheDocument();
    expect(screen.getByText("BMXX Cargo")).toBeInTheDocument();
  });

  it("affiche un message d'erreur en cas d'échec", async () => {
    const errorMessage = "Erreur réseau";
    mockGetVehicles.mockRejectedValueOnce(new Error(errorMessage));

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(screen.getByText(`Erreur: ${errorMessage}`)).toBeInTheDocument();
    });

    expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
  });

  it("affiche un message d'erreur générique si l'erreur n'est pas une instance Error", async () => {
    mockGetVehicles.mockRejectedValueOnce("Erreur inconnue");

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(
        screen.getByText("Erreur: Erreur lors du chargement")
      ).toBeInTheDocument();
    });
  });

  it("affiche une liste vide si aucun véhicule n'est retourné", async () => {
    mockGetVehicles.mockResolvedValueOnce([]);

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    const cards = screen.queryAllByTestId("card-vehicle");
    expect(cards).toHaveLength(0);
  });

  it("passe l'image par défaut si le véhicule n'a pas d'image", async () => {
    const mockVehicles = [
      {
        id: 1,
        image: "",
        type: "sale",
        brand: "Opria road",
        model: "S100",
        year: 2021,
        km: 15000,
        energy: "Essence",
        price: 18000,
      },
    ];

    mockGetVehicles.mockResolvedValueOnce(mockVehicles);

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Opria road S100")).toBeInTheDocument();
  });
});
