"use client";
import { ShoppingCart, Check } from "lucide-react";
import React, { useState, useMemo } from "react";
import s from "./styles.module.css";

interface CartComponentProps {
  brand: string;
  model: string;
  price: number;
  type: "rent" | "sale";
}

interface Option {
  id: string;
  label: string;
  price: number;
}

const OPTIONS: Option[] = [
  { id: "insurance", label: "Assurance", price: 50 },
  { id: "technical_check", label: "Contrôle technique", price: 5 },
  { id: "maintenance", label: "Entretien", price: 30 },
  { id: "assistance", label: "Assistance dépannage", price: 15 },
];

function CartComponent({
  brand = "Marque",
  model = "Modèle",
  price = 0,
  type = "rent",
}: CartComponentProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set()
  );

  const selectedOptionsList = useMemo(() => {
    return OPTIONS.filter((option) => selectedOptions.has(option.id));
  }, [selectedOptions]);

  const optionsTotal = useMemo(() => {
    return selectedOptionsList.reduce((sum, option) => sum + option.price, 0);
  }, [selectedOptionsList]);

  const grandTotal = useMemo(() => {
    return price + optionsTotal;
  }, [price, optionsTotal]);

  const toggleOption = (id: string) => {
    const newSelection = new Set(selectedOptions);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedOptions(newSelection);
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
              {price.toFixed(2)} €{type === "rent" ? " /mois" : ""}
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
          <span className={s.amount}>{price.toFixed(2)} €</span>
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

      <button className={s.validateButton}>Valider le panier</button>
    </div>
  );
}

export default CartComponent;
