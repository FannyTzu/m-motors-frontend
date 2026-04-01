"use client";
import { ShoppingCart, Check } from "lucide-react";
import { useState, useMemo } from "react";
import s from "./styles.module.css";
import { createOrderRequest } from "../../order.service";

interface CartComponentProps {
  brand: string;
  model: string;
  price: number;
  type: "rent" | "sale";
  folderId: number;
  vehicleId: number;
}

interface Option {
  id: string;
  label: string;
  price: number;
}

const OPTIONS: Option[] = [
  { id: "1", label: "Assurance", price: 50 },
  { id: "2", label: "Contrôle technique", price: 5 },
  { id: "3", label: "Entretien", price: 30 },
  { id: "4", label: "Assistance dépannage", price: 15 },
];

function CartComponent({
  brand,
  model,
  price,
  type,
  folderId,
  vehicleId,
}: CartComponentProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceAsNumber = typeof price === "string" ? parseFloat(price) : price;

  const selectedOptionsList = useMemo(() => {
    return OPTIONS.filter((option) => selectedOptions.has(option.id));
  }, [selectedOptions]);

  const optionsTotal = useMemo(() => {
    return selectedOptionsList.reduce((sum, option) => sum + option.price, 0);
  }, [selectedOptionsList]);

  const grandTotal = useMemo(() => {
    return priceAsNumber + optionsTotal;
  }, [priceAsNumber, optionsTotal]);

  const toggleOption = (id: string) => {
    const newSelection = new Set(selectedOptions);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedOptions(newSelection);
  };

  const handleValidateCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const optionsPayload = Array.from(selectedOptions)
        .map((optionId) => ({
          option_id: parseInt(optionId, 10),
        }))
        .filter((opt) => !isNaN(opt.option_id));

      const order = await createOrderRequest({
        folder_id: folderId,
        vehicle_id: vehicleId,
        options: optionsPayload,
      });

      //todo ajouter le param après payment qd page sera dispo

      window.location.href = "/payment";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2 className={s.title}>
          <ShoppingCart size={24} /> Panier
        </h2>
        <p className={s.subtitle}>
          Vérifiez votre panier avant de procéder au paiement
        </p>
      </div>

      {error && <div className={s.error}>{error}</div>}

      <div className={s.section}>
        <h3 className={s.sectionTitle}>Véhicule</h3>
        <div className={s.vehicleCard}>
          <div className={s.vehicleInfo}>
            <div className={s.vehicleDetails}>
              <span className={s.label}>{brand}</span>
              <span className={s.model}>{model}</span>
            </div>
            <div className={s.vehicleType}>
              {type === "rent" ? "Location" : "Achat"}
            </div>
          </div>
          <div className={s.vehiclePrice}>
            <div className={s.price}>
              {priceAsNumber.toFixed(2)} €{type === "rent" ? " /mois" : ""}
            </div>
            <div className={s.paymentType}>
              {type === "rent" ? "48 mois" : "Comptant"}
            </div>
          </div>
        </div>
      </div>
      {/* Options => only for rent */}
      {type === "rent" && (
        <div className={s.section}>
          <h3 className={s.sectionTitle}>Options disponibles</h3>
          <div className={s.optionsContainer}>
            {OPTIONS.map((option) => (
              <label key={option.id} className={s.optionItem}>
                <input
                  type="checkbox"
                  checked={selectedOptions.has(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className={s.checkbox}
                />
                <span className={s.optionLabel}>{option.label}</span>
                <span className={s.optionPrice}>
                  +{option.price.toFixed(2)} €
                </span>
              </label>
            ))}
          </div>

          {selectedOptionsList.length > 0 && (
            <div className={s.selectedOptions}>
              <h4>Récapitulatif des options</h4>
              {selectedOptionsList.map((opt) => (
                <div key={opt.id} className={s.selectedItem}>
                  <Check size={18} color="#4CAF50" />
                  <span>{opt.label}</span>
                  <span className={s.price}>+{opt.price.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={s.totalSection}>
        <div className={s.totalRow}>
          <span>Prix du véhicule</span>
          <span className={s.amount}>{priceAsNumber.toFixed(2)} €</span>
        </div>
        {optionsTotal > 0 && (
          <div className={s.totalRow}>
            <span>Options</span>
            <span className={s.amount}>+{optionsTotal.toFixed(2)} €</span>
          </div>
        )}
        <div className={s.totalFinal}>
          <div>
            <span className={s.finalLabel}>Total</span>
            <span className={s.paymentTypeLabel}>
              {type === "rent" ? "Total mensuel" : "Prix comptant"}
            </span>
          </div>
          <span className={s.finalAmount}>{grandTotal.toFixed(2)} €</span>
        </div>
      </div>

      <button
        className={s.validateButton}
        onClick={handleValidateCart}
        disabled={isLoading}
      >
        {isLoading ? "En cours..." : "Valider le panier"}
      </button>
    </div>
  );
}

export default CartComponent;
