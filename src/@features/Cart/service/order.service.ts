import { catchAsync } from "@/@utils/catchAsync";

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

interface Payment {
  id: number;
  order_id: number;
  amount: number;
  status: string;
  created_at: string;
}

interface OrderDetail extends Order {
  folder: {
    id: number;
    user_id: number;
    vehicle_id: number;
    status: string;
    financing_type: string;
    created_at: string;
  };
  vehicle: {
    id: number;
    brand: string;
    model: string;
    type: string;
    price: number;
  };
  options: Array<{
    id: number;
    option_id: number;
    option: {
      id: number;
      name: string;
      price: number;
    };
  }>;
  payments: Payment[];
}

export const createOrderRequest = (data: CreateOrderRequest): Promise<Order> =>
  catchAsync(
    async () => {
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
    },
    { tags: { feature: "order", action: "createOrder" } }
  );

export const getOrderByIdRequest = (orderId: number): Promise<OrderDetail> =>
  catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la récupération de la commande"
        );
      }

      return response.json();
    },
    { tags: { feature: "order", action: "getOrderById" } }
  );
