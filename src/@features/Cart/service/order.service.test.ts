import { createOrderRequest, getOrderByIdRequest } from "./order.service";

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

  it("handles network errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const orderData = {
      folder_id: 1,
      vehicle_id: 1,
      options: [{ option_id: 1 }],
    };

    await expect(createOrderRequest(orderData)).rejects.toThrow(
      "Network error"
    );
  });

  it("handles JSON parsing errors from failed response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const orderData = {
      folder_id: 1,
      vehicle_id: 1,
      options: [{ option_id: 1 }],
    };

    await expect(createOrderRequest(orderData)).rejects.toThrow();
  });
});

describe("getOrderByIdRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches an order by id successfully", async () => {
    const mockOrderDetail = {
      id: 1,
      folder_id: 1,
      vehicle_id: 1,
      user_id: 1,
      status: "pending",
      created_at: "2024-01-01T00:00:00Z",
      folder: {
        id: 1,
        user_id: 1,
        vehicle_id: 1,
        status: "submitted",
        financing_type: "location",
        created_at: "2024-01-01T00:00:00Z",
      },
      vehicle: {
        id: 1,
        brand: "Tesla",
        model: "Model 3",
        type: "sale",
        price: 50000,
      },
      options: [
        {
          id: 1,
          option_id: 1,
          option: {
            id: 1,
            name: "GPS",
            price: 500,
          },
        },
      ],
      payments: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrderDetail,
    });

    const result = await getOrderByIdRequest(1);

    expect(result).toEqual(mockOrderDetail);
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/1`,
      expect.objectContaining({
        method: "GET",
        credentials: "include",
      })
    );
  });

  it("calls the correct API endpoint with correct orderId", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await getOrderByIdRequest(42);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/42`,
      expect.any(Object)
    );
  });

  it("sends GET method in request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await getOrderByIdRequest(1);

    const callOptions = mockFetch.mock.calls[0][1];
    expect(callOptions.method).toBe("GET");
  });

  it("includes credentials in GET request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await getOrderByIdRequest(1);

    const callOptions = mockFetch.mock.calls[0][1];
    expect(callOptions.credentials).toBe("include");
  });

  it("sends correct headers for GET request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await getOrderByIdRequest(1);

    const callOptions = mockFetch.mock.calls[0][1];
    expect(callOptions.headers).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("throws custom error message if API returns error with message", async () => {
    const errorMessage = "Commande introuvable";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    });

    await expect(getOrderByIdRequest(999)).rejects.toThrow(errorMessage);
  });

  it("throws default error message if API returns error without message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(getOrderByIdRequest(1)).rejects.toThrow(
      "Erreur lors de la récupération de la commande"
    );
  });

  it("handles network errors during GET request", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network timeout"));

    await expect(getOrderByIdRequest(1)).rejects.toThrow("Network timeout");
  });

  it("parses complex order details with multiple options and payments", async () => {
    const complexOrderDetail = {
      id: 5,
      folder_id: 3,
      vehicle_id: 2,
      user_id: 7,
      status: "completed",
      created_at: "2024-06-15T10:30:00Z",
      folder: {
        id: 3,
        user_id: 7,
        vehicle_id: 2,
        status: "accepted",
        financing_type: "comptant",
        created_at: "2024-06-10T08:00:00Z",
      },
      vehicle: {
        id: 2,
        brand: "BMW",
        model: "X5",
        type: "rent",
        price: 75000,
      },
      options: [
        {
          id: 1,
          option_id: 1,
          option: { id: 1, name: "GPS", price: 500 },
        },
        {
          id: 2,
          option_id: 2,
          option: { id: 2, name: "Climatisation", price: 1000 },
        },
        {
          id: 3,
          option_id: 3,
          option: { id: 3, name: "Toit panoramique", price: 2000 },
        },
      ],
      payments: [
        {
          id: 1,
          order_id: 5,
          amount: 25000,
          status: "paid",
          created_at: "2024-06-15T10:30:00Z",
        },
        {
          id: 2,
          order_id: 5,
          amount: 25000,
          status: "paid",
          created_at: "2024-06-20T14:15:00Z",
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => complexOrderDetail,
    });

    const result = await getOrderByIdRequest(5);

    expect(result).toEqual(complexOrderDetail);
    expect(result.options).toHaveLength(3);
    expect(result.payments).toHaveLength(2);
    expect(result.vehicle.brand).toBe("BMW");
  });
});
