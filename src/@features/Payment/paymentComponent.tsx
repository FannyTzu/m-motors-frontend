import React, { useState } from "react";
import s from "./styles.module.css";
import { Lock } from "lucide-react";

interface PaymentComponentProps {
  vehicleName?: string;
  vehiclePrice?: number;
  totalAmount?: number;
  financeMode?: "location" | "comptant";
  options?: Array<{
    name: string;
    price: number;
  }>;
  onPaymentComplete?: (success: boolean) => void;
}

function PaymentComponent({
  vehicleName = "Vehicule",
  vehiclePrice = 0,
  financeMode = "comptant",
  options = [],
  totalAmount = 0,
  onPaymentComplete,
}: PaymentComponentProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "").slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 2) {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      onPaymentComplete?.(true);
    }, 1500);
  };

  if (paymentSuccess) {
    return (
      <div className={s.container}>
        <div className={s.securityBanner}>
          <Lock size={20} />
          <span>Paiement sécurisé</span>
        </div>
        <div className={s.successMessage}>
          <div className={s.successContent}>
            <div className={s.checkmark}>✓</div>
            <h2>Paiement réussi!</h2>
            <p>
              Votre commande a été validée avec succès. <br />
              {financeMode === "location"
                ? "Votre prochain paiement sera débité automatiquement chaque mois jusqu'à la fin de votre contrat."
                : ""}
              <br /> Le garage vous contacte dans les 24 heures pour récupérer
              votre véhicule.
            </p>
            <p className={s.successAmount}>
              {Number(vehiclePrice).toFixed(2)}€
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.securityBanner}>
        <Lock size={20} />
        <span>Paiement sécurisé</span>
      </div>

      <div className={s.mainContent}>
        <div className={s.leftBlock}>
          <div className={s.securityMessage}>
            <Lock size={18} />
            <div>
              <h3>Paiement sécurisé</h3>
              <p>Vos données bancaires sont protégées</p>
            </div>
          </div>

          <form onSubmit={handleSubmitPayment} className={s.paymentForm}>
            <div className={s.formGroup}>
              <label htmlFor="cardNumber">Numéro de carte</label>
              <input
                id="cardNumber"
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
                maxLength={19}
              />
            </div>

            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label htmlFor="expiry">Date d&apos;expiration</label>
                <input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  required
                  maxLength={5}
                />
              </div>

              <div className={s.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  type="text"
                  placeholder="000"
                  value={cvv}
                  onChange={handleCvvChange}
                  required
                  maxLength={3}
                />
              </div>
            </div>

            <button
              type="submit"
              className={s.submitButton}
              disabled={isProcessing}
            >
              {isProcessing ? "Paiement en cours..." : "Valider le paiement"}
            </button>
          </form>
        </div>

        <div className={s.rightBlock}>
          <h3 className={s.recapTitle}>Récapitulatif</h3>

          <div className={s.recapSection}>
            <h4>Véhicule</h4>
            <p className={s.vehicleName}>{vehicleName}</p>
            <p>{Number(vehiclePrice).toFixed(2)}€</p>
          </div>

          {options.length > 0 && (
            <div className={s.recapSection}>
              <h4>Options</h4>
              <ul className={s.optionsList}>
                {options.map((option, index) => (
                  <li key={index}>
                    <span>{option.name}</span>
                    <span>{Number(option.price).toFixed(2)}€</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={s.recapSection}>
            <div className={s.amountRow}>
              <span>Montant total</span>
              <span className={s.amount}>
                {Number(totalAmount).toFixed(2)}{" "}
                {financeMode === "location" ? "€/mois" : "€"}
              </span>
            </div>
          </div>

          <div className={s.recapSection}>
            <h4>Mode de financement</h4>
            <p className={s.financeMode}>
              {financeMode === "location"
                ? "Location Longue Durée"
                : "Comptant"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentComponent;
