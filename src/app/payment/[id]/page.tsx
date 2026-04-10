"use client";
import s from "./styles.module.css";
import PaymentComponent from "@/@features/Payment/paymentComponent";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";
import { useEffect, useState } from "react";
import { getOrderByIdRequest } from "@/@features/Cart/service/order.service";
import type { OrderDetail } from "@/@features/Cart/service/order.service";
import ProtectedRoute from "@/@utils/ProtectedRoute";

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
  const financeMode = order.vehicle.type === "rental" ? "location" : "comptant";

  const selectedOptions = (order.options || []).map(
    (option: { name: string; price: number; id: number }) => ({
      name: option.name,
      price: Number(option.price),
    })
  );

  const totalAmount = Number(order.total_amount);

  const handlePaymentComplete = (success: boolean) => {
    console.log("Paiement complété:", success, "Commande ID:", order.id);
    //todo : add logic
  };

  return (
    <div>
      <ArrowBack />

      <div className={s.container}>
        <ProtectedRoute allowedRoles={["user"]}>
          <PaymentComponent
            orderId={order.id}
            vehicleName={vehicleName}
            vehiclePrice={order.vehicle.price}
            totalAmount={totalAmount}
            financeMode={financeMode}
            options={selectedOptions}
            onPaymentComplete={handlePaymentComplete}
          />
        </ProtectedRoute>
      </div>
    </div>
  );
}
