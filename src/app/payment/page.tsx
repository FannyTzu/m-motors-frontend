"use client";
import React from "react";
import s from "./styles.module.css";
import PaymentComponent from "@/@features/Payment/paymentComponent";

function PaymentPage() {
  //todo: fetch real data from api
  const mockPaymentData = {
    vehicleName: "Tohauta 2026",
    vehiclePrice: 410,
    totalAmount: 455,
    financeMode: "location" as const,
    options: [
      { name: "Assurances tous risques", price: 40 },
      { name: "Contrôle technique", price: 5 },
    ],
  };

  const handlePaymentComplete = (success: boolean) => {
    console.log("Paiement complété:", success);
    //todo: add logic
  };

  return (
    <div className={s.container}>
      <PaymentComponent
        vehicleName={mockPaymentData.vehicleName}
        vehiclePrice={mockPaymentData.vehiclePrice}
        totalAmount={mockPaymentData.totalAmount}
        financeMode={mockPaymentData.financeMode}
        options={mockPaymentData.options}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

export default PaymentPage;
