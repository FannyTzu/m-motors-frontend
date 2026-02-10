import {
  createVehicles,
  getVehicleById,
  getVehicles,
  getVehiclesByType,
  updateVehicle,
} from "./vehicle.service";

global.fetch = jest.fn();
const mockFetch = fetch as jest.Mock;

const mockVehicleData = {
  brand: "Astraa",
  model: "Série 3",
  transmission: "automatic" as const,
  year: 2023,
  energy: "Essence",
  km: 5000,
  color: "Noir métallisé",
  place: 5,
  door: 4,
  type: "sale" as const,
  price: 25000,
  image: "https://example.com/image.jpg",
  status: "available" as const,
};

describe("createVehicles", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  it("crée un véhicule avec succès", async () => {
    const mockResponse = { id: 1, ...mockVehicleData };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await createVehicles(mockVehicleData);

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(mockVehicleData),
      }
    );
  });

  it("lance une erreur si la création ne se fait pas", async () => {
    const errorMessage = "Véhicule non créé";

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });

    await expect(createVehicles(mockVehicleData)).rejects.toThrow(errorMessage);
  });

  it("lance une erreur générique si la réponse n'a pas de message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(createVehicles(mockVehicleData)).rejects.toThrow(
      "Failed to create vehicle"
    );
  });

  it("envoie les données correctes au serveur", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await createVehicles(mockVehicleData);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/vehicle/create"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
    );

    const callArgs = mockFetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body).toEqual(mockVehicleData);
  });

  it("inclut les credentials dans la requête", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await createVehicles(mockVehicleData);

    const callOptions = mockFetch.mock.calls[0][1];
    expect(callOptions.credentials).toBe("include");
  });
});

describe("getVehicles", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  it("récupère la liste des véhicules avec succès", async () => {
    const mockResponse = [
      { id: 1, ...mockVehicleData },
      { id: 2, ...mockVehicleData },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const result = await getVehicles();
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
  });

  it("lance une erreur si la récupération échoue", async () => {
    const errorMessage = "Erreur de récupération";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });
    await expect(getVehicles()).rejects.toThrow(errorMessage);
  });
});

describe("getVehicleById", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  it("récupère un véhicule par ID avec succès", async () => {
    const mockResponse = { id: 1, ...mockVehicleData };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const result = await getVehicleById(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle/1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
  });

  it("lance une erreur si la récupération échoue", async () => {
    const errorMessage = "Véhicule non trouvé";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });
    await expect(getVehicleById(999)).rejects.toThrow(errorMessage);
  });
});

describe("getVehicleByType", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  it("récupère les véhicules par type avec succès", async () => {
    const mockResponse = [
      { id: 1, ...mockVehicleData, type: "sale" },
      { id: 2, ...mockVehicleData, type: "sale" },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const result = await getVehiclesByType("sale");
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle/type/sale`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
  });

  it("lance une erreur si la récupération échoue", async () => {
    const errorMessage = "Erreur de récupération par type";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });
    await expect(getVehiclesByType("rental")).rejects.toThrow(errorMessage);
  });
});

describe("updateVehicle", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });
  it("met à jour un véhicule avec succès", async () => {
    const mockResponse = { id: 1, ...mockVehicleData };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const completeVehicleData = {
      brand: "Astraa",
      model: "Série 3",
      transmission: "automatic" as const,
      year: 2023,
      energy: "Essence",
      km: 5000,
      color: "Noir métallisé",
      place: 5,
      door: 4,
      type: "sale" as const,
      price: 30000,
      status: "available" as const,
      // image et description peuvent être ajoutés si besoin
    };
    const result = await updateVehicle(1, completeVehicleData);
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle/1`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(completeVehicleData),
      }
    );
  });

  it("lance une erreur si la mise à jour échoue", async () => {
    const errorMessage = "Erreur de mise à jour";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });
    const completeVehicleData = {
      brand: "Astraa",
      model: "Série 3",
      transmission: "automatic" as const,
      year: 2023,
      energy: "Essence",
      km: 5000,
      color: "Noir métallisé",
      place: 5,
      door: 4,
      type: "sale" as const,
      price: 30000,
      status: "available" as const,
    };
    await expect(updateVehicle(1, completeVehicleData)).rejects.toThrow(
      errorMessage
    );
  });
});
