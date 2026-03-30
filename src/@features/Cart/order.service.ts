interface CreateOrderRequest {
  folder_id: number;
  vehicle_id: number;
  options: Array<{
    option_id: number;
  }>;
}

interface Order {
  id: number;
  folder_id: number;
  vehicle_id: number;
  user_id: number;
  status: string;
  created_at: string;
}

export const createOrderRequest = async (
  data: CreateOrderRequest
): Promise<Order> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Erreur lors de la création de la commande"
    );
  }

  return response.json();
};
