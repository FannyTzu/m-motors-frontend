import { fetchOptionsRequest } from "./option.service";

const mockFetch = fetch as jest.Mock;

describe("fetchOptionsRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches options successfully from array response", async () => {
    const mockResponse = [
      { id: 1, name: "Assurance", price: "50" },
      { id: 2, name: "Contrôle technique", price: 5 },
      { id: 3, name: "Entretien", price: "30" },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchOptionsRequest();

    expect(result).toEqual([
      { id: "1", label: "Assurance", price: 50 },
      { id: "2", label: "Contrôle technique", price: 5 },
      { id: "3", label: "Entretien", price: 30 },
    ]);
  });

  it("fetches options successfully from wrapped object response", async () => {
    const mockResponse = {
      options: [
        { id: 1, name: "Assurance", price: "50" },
        { id: 2, name: "Contrôle technique", price: 5 },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchOptionsRequest();

    expect(result).toEqual([
      { id: "1", label: "Assurance", price: 50 },
      { id: "2", label: "Contrôle technique", price: 5 },
    ]);
  });

  it("handles empty options array", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await fetchOptionsRequest();

    expect(result).toEqual([]);
  });

  it("handles empty wrapped object response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const result = await fetchOptionsRequest();

    expect(result).toEqual([]);
  });

  it("calls the correct API endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchOptionsRequest();

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/options`,
      expect.any(Object)
    );
  });

  it("sends correct request headers", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchOptionsRequest();

    const callOptions = mockFetch.mock.calls[0][1];
    expect(callOptions.headers).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("includes credentials in the request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchOptionsRequest();

    const callOptions = mockFetch.mock.calls[0][1];
    expect(callOptions.credentials).toBe("include");
  });

  it("sends GET method", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchOptionsRequest();

    const callOptions = mockFetch.mock.calls[0][1];
    expect(callOptions.method).toBe("GET");
  });

  it("throws error when response is not ok", async () => {
    const errorMessage = "Erreur serveur";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });

    await expect(fetchOptionsRequest()).rejects.toThrow(errorMessage);
  });

  it("throws default error message when response is not ok and no message provided", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(fetchOptionsRequest()).rejects.toThrow(
      "Impossible de récupérer les options"
    );
  });

  it("converts price from string to number", async () => {
    const mockResponse = [
      { id: 1, name: "Option 1", price: "100.50" },
      { id: 2, name: "Option 2", price: 50 },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchOptionsRequest();

    expect(result[0].price).toBe(100.5);
    expect(typeof result[0].price).toBe("number");
    expect(result[1].price).toBe(50);
    expect(typeof result[1].price).toBe("number");
  });

  it("converts id to string", async () => {
    const mockResponse = [
      { id: 1, name: "Option 1", price: 50 },
      { id: 42, name: "Option 2", price: 100 },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchOptionsRequest();

    expect(result[0].id).toBe("1");
    expect(typeof result[0].id).toBe("string");
    expect(result[1].id).toBe("42");
  });

  it("maps name to label", async () => {
    const mockResponse = [{ id: 1, name: "Assurance complète", price: 50 }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchOptionsRequest();

    expect(result[0].label).toBe("Assurance complète");
    expect(result[0]).not.toHaveProperty("name");
  });

  it("handles network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchOptionsRequest()).rejects.toThrow("Network error");
  });

  it("handles multiple options with mixed price formats", async () => {
    const mockResponse = [
      { id: 1, name: "Option 1", price: "50" },
      { id: 2, name: "Option 2", price: 75.5 },
      { id: 3, name: "Option 3", price: "100.25" },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchOptionsRequest();

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { id: "1", label: "Option 1", price: 50 },
      { id: "2", label: "Option 2", price: 75.5 },
      { id: "3", label: "Option 3", price: 100.25 },
    ]);
  });
});
