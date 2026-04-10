import {
  createPaymentRequest,
  updatePaymentStatusRequest,
} from "./payment.service";

// Mock fetch globally
global.fetch = jest.fn();

describe("Payment Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPaymentRequest", () => {
    it("should successfully create a payment", async () => {
      const mockResponse = {
        data: {
          id: 1,
          order_id: 1,
          amount: 47000,
          status: "pending",
          transaction_id: "txn-123",
          created_at: "2026-04-05T10:00:00Z",
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createPaymentRequest({
        order_id: 1,
        amount: 47000,
        transaction_id: "txn-123",
      });

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/payments`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
      );
    });

    it("should throw error on 401 response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(
        createPaymentRequest({
          order_id: 1,
          amount: 47000,
        })
      ).rejects.toThrow("Non authentifié");
    });

    it("should throw error on non-OK response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        createPaymentRequest({
          order_id: 1,
          amount: 47000,
        })
      ).rejects.toThrow("Failed to create payment");
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(
        createPaymentRequest({
          order_id: 1,
          amount: 47000,
        })
      ).rejects.toThrow("Network error");
    });
  });

  describe("updatePaymentStatusRequest", () => {
    it("should successfully update payment status to paid", async () => {
      const mockResponse = {
        data: {
          id: 1,
          order_id: 1,
          amount: 47000,
          status: "paid",
          transaction_id: "txn-123",
          created_at: "2026-04-05T10:00:00Z",
          paid_at: "2026-04-05T10:02:00Z",
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await updatePaymentStatusRequest(1, "paid");

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/1`,
        expect.objectContaining({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: "paid" }),
        })
      );
    });

    it("should successfully update payment status to failed", async () => {
      const mockResponse = {
        data: {
          id: 1,
          order_id: 1,
          amount: 47000,
          status: "failed",
          transaction_id: "txn-123",
          created_at: "2026-04-05T10:00:00Z",
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await updatePaymentStatusRequest(1, "failed");

      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error on 401 response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(updatePaymentStatusRequest(1, "paid")).rejects.toThrow(
        "Non authentifié"
      );
    });

    it("should throw error on non-OK response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(updatePaymentStatusRequest(1, "paid")).rejects.toThrow(
        "Failed to update payment status"
      );
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(updatePaymentStatusRequest(1, "paid")).rejects.toThrow(
        "Network error"
      );
    });
  });
});
