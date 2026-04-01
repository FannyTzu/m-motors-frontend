import { createOrderRequest } from "./order.service";

const mockFetch = fetch as jest.Mock;

describe("createOrderRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an order successfully", async () => {
    const mockResponse = {
      id: 1,
      folder_id: 1,
      vehicle_id: 1,
      user_id: 1,
      status: "pending",
      created_at: "2024-01-01T00:00:00Z",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const orderData = {
      folder_id: 1,
      vehicle_id: 1,
      options: [{ option_id: 1 }, { option_id: 2 }],
    };

    const result = await createOrderRequest(orderData);

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/create`,
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );
  });

  it("sends correct headers", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const orderData = {
      folder_id: 1,
      vehicle_id: 1,
      options: [{ option_id: 1 }],
    };

    await createOrderRequest(orderData);

    const callOptions = mockFetch.mock.calls[0][1];
    expect(callOptions.headers).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("sends correct data to the server", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const orderData = {
      folder_id: 5,
      vehicle_id: 10,
      options: [{ option_id: 1 }, { option_id: 2 }],
    };

    await createOrderRequest(orderData);

    const callArgs = mockFetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body).toEqual(orderData);
  });

  it("includes credentials in the request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const orderData = {
      folder_id: 1,
      vehicle_id: 1,
      options: [{ option_id: 1 }],
    };

    await createOrderRequest(orderData);

    const callOptions = mockFetch.mock.calls[0][1];
    expect(callOptions.credentials).toBe("include");
  });

  it("throws an error with custom message if API returns error with message", async () => {
    const errorMessage = "Commande non créée";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    });

    const orderData = {
      folder_id: 1,
      vehicle_id: 1,
      options: [{ option_id: 1 }],
    };

    await expect(createOrderRequest(orderData)).rejects.toThrow(errorMessage);
  });

  it("throws a default error message if API returns error without message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const orderData = {
      folder_id: 1,
      vehicle_id: 1,
      options: [{ option_id: 1 }],
    };

    await expect(createOrderRequest(orderData)).rejects.toThrow(
      "Erreur lors de la création de la commande"
    );
  });

  it("calls the correct API endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const orderData = {
      folder_id: 1,
      vehicle_id: 1,
      options: [{ option_id: 1 }],
    };

    await createOrderRequest(orderData);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/create`,
      expect.any(Object)
    );
  });

  it("parses the response as JSON", async () => {
    const mockResponse = {
      id: 99,
      folder_id: 5,
      vehicle_id: 10,
      user_id: 7,
      status: "completed",
      created_at: "2024-12-01T15:30:00Z",
    };

    const jsonSpy = jest.fn(async () => mockResponse);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jsonSpy,
    });

    const orderData = {
      folder_id: 5,
      vehicle_id: 10,
      options: [{ option_id: 1 }],
    };

    const result = await createOrderRequest(orderData);

    expect(jsonSpy).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it("handles multiple options correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const orderData = {
      folder_id: 1,
      vehicle_id: 1,
      options: [
        { option_id: 1 },
        { option_id: 2 },
        { option_id: 3 },
        { option_id: 4 },
      ],
    };

    await createOrderRequest(orderData);

    const callArgs = mockFetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.options).toHaveLength(4);
    expect(body.options).toEqual([
      { option_id: 1 },
      { option_id: 2 },
      { option_id: 3 },
      { option_id: 4 },
    ]);
  });
});
