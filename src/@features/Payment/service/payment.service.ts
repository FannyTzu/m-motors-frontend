export interface CreatePaymentData {
  order_id: number;
  amount: number;
  transaction_id?: string;
}

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  status: "pending" | "paid" | "failed";
  transaction_id?: string;
  created_at: string;
  paid_at?: string;
  order?: {
    id: number;
    status: string;
    vehicle?: {
      id: number;
      brand: string;
      model: string;
    };
  };
}

export const createPaymentRequest = async (data: CreatePaymentData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Non authentifié");
    }
    throw new Error("Failed to create payment");
  }

  const result = await response.json();
  return result.data as Payment;
};

export const updatePaymentStatusRequest = async (
  paymentId: number,
  status: "pending" | "paid" | "failed"
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Non authentifié");
    }
    throw new Error("Failed to update payment status");
  }

  const result = await response.json();
  return result.data as Payment;
};
