import { render, screen, waitFor } from "@testing-library/react";
import DisplayCardVehicle from "./DisplayCardVehicle";
import { getVehicles } from "@/@features/Vehicles/service/vehicle.service";

jest.mock("@/@features/Vehicles/service/vehicle.service");
const mockGetVehicles = getVehicles as jest.MockedFunction<typeof getVehicles>;

jest.mock("../CardVehicleCatalog/CardVehicleCatalog", () => {
  return function MockCardVehicleCatalog({
    brand,
    model,
  }: {
    brand: string;
    model: string;
  }) {
    return <div data-testid="card-vehicle-catalog">{`${brand} ${model}`}</div>;
  };
});

describe("DisplayCardVehicle (Business)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display loading message while fetching vehicles", () => {
    mockGetVehicles.mockImplementation(() => new Promise(() => {}));
    render(<DisplayCardVehicle />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("should display vehicles after loading succeeds", async () => {
    const mockVehicles = [
      {
        id: 1,
        image: "/car1.jpg",
        status: "available",
        brand: "Opria road",
        model: "S100",
        year: 2023,
        km: 5000,
        energy: "Essence",
        transmission: "Automatique",
        price: 35000,
        type: "sale",
      },
      {
        id: 2,
        image: "/car2.jpg",
        status: "rented",
        brand: "DMXX",
        model: "Cargo",
        year: 2022,
        km: 10000,
        energy: "Diesel",
        transmission: "Manuel",
        price: 45000,
        type: "rental",
      },
    ];

    mockGetVehicles.mockResolvedValueOnce(mockVehicles);

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    const cards = screen.getAllByTestId("card-vehicle-catalog");
    expect(cards).toHaveLength(2);
    expect(screen.getByText("Opria road S100")).toBeInTheDocument();
    expect(screen.getByText("DMXX Cargo")).toBeInTheDocument();
  });

  it("should display error message when fetching fails", async () => {
    const errorMessage = "Erreur réseau";
    mockGetVehicles.mockRejectedValueOnce(new Error(errorMessage));

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(screen.getByText(`Erreur: ${errorMessage}`)).toBeInTheDocument();
    });

    expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
  });

  it("should display generic error message when error is not an instance of Error", async () => {
    mockGetVehicles.mockRejectedValueOnce("Unknown error");
    render(<DisplayCardVehicle />);
    await waitFor(() => {
      expect(
        screen.getByText("Erreur: Erreur lors du chargement")
      ).toBeInTheDocument();
    });
  });

  it("should display empty list when no vehicles are returned", async () => {
    mockGetVehicles.mockResolvedValueOnce([]);

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    const cards = screen.queryAllByTestId("card-vehicle-catalog");
    expect(cards).toHaveLength(0);
  });

  it("should use default image when vehicle has no image", async () => {
    const mockVehicles = [
      {
        id: 1,
        image: "",
        status: "available",
        brand: "Opria road",
        model: "S100",
        year: 2021,
        km: 15000,
        energy: "Essence",
        transmission: "Automatique",
        price: 18000,
        type: "sale",
      },
    ];

    mockGetVehicles.mockResolvedValueOnce(mockVehicles);

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Opria road S100")).toBeInTheDocument();
  });

  it("should refresh vehicle list when onDelete is called", async () => {
    const mockVehicles = [
      {
        id: 1,
        image: "/car1.jpg",
        status: "available",
        brand: "Opria road",
        model: "S100",
        year: 2023,
        km: 5000,
        energy: "Essence",
        transmission: "Automatique",
        price: 35000,
        type: "sale",
      },
    ];

    mockGetVehicles.mockResolvedValue(mockVehicles);

    render(<DisplayCardVehicle />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    expect(mockGetVehicles).toHaveBeenCalledTimes(1);
  });
});
