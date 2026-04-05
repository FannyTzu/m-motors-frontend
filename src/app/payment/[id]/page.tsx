"use client";
import s from "./styles.module.css";
import PaymentComponent from "@/@features/Payment/paymentComponent";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";
import { useEffect, useState } from "react";
import { getOrderByIdRequest } from "@/@features/Cart/service/order.service";

interface OrderDetail {
  id: number;
  folder_id: number;
  vehicle_id: number;
  user_id: number;
  status: string;
  created_at: string;
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
  payments: Array<{
    id: number;
    order_id: number;
    amount: number;
    status: string;
    created_at: string;
  }>;
}

interface PaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { id } = await params;
        const orderIdNum = Number(id);

        const orderData = await getOrderByIdRequest(orderIdNum);
        setOrder(orderData);
      } catch (err) {
        setError("Erreur lors de la récupération de la commande");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params]);

  if (loading) return <div style={{ padding: "20px" }}>Chargement...</div>;
  if (error)
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  if (!order)
    return <div style={{ padding: "20px" }}>Commande non trouvée</div>;

  const vehicleName = `${order.vehicle.brand} ${order.vehicle.model}`;
  const financeMode =
    order.vehicle.type === "rental" ? "location" : "comptant";

  const selectedOptions = order.options.map((orderOption) => ({
    name: orderOption.option.name,
    price: Number(orderOption.option.price),
  }));

  const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const totalAmount = Number(order.vehicle.price) + optionsTotal;

  const handlePaymentComplete = (success: boolean) => {
    console.log("Paiement complété:", success, "Commande ID:", order.id);
    //todo : add logic
  };

  return (
    <div>
      <ArrowBack />
      <div className={s.container}>
        <PaymentComponent
          vehicleName={vehicleName}
          vehiclePrice={order.vehicle.price}
          totalAmount={totalAmount}
          financeMode={financeMode}
          options={selectedOptions}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </div>
  );
}
