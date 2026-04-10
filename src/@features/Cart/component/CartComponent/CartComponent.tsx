"use client";
import { ShoppingCart, Check } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrderRequest } from "../../service/order.service";
import { fetchOptionsRequest } from "../../service/option.service";
import s from "./styles.module.css";

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

function CartComponent({
  brand,
  model,
  price,
  type,
  folderId,
  vehicleId,
}: CartComponentProps) {
  const router = useRouter();
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const priceAsNumber = typeof price === "string" ? parseFloat(price) : price;

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const fetchedOptions = await fetchOptionsRequest();
        setOptions(fetchedOptions);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des options";
        setError(errorMessage);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const selectedOptionsList = useMemo(() => {
    return options.filter((option) => selectedOptions.has(option.id));
  }, [selectedOptions, options]);

  const optionsTotal = selectedOptionsList.reduce(
    (sum, option) => sum + option.price,
    0
  );
  const amontTotal = priceAsNumber + optionsTotal;

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
      const optionIds = Array.from(selectedOptions)
        .map((optionId) => parseInt(optionId, 10))
        .filter((id) => !isNaN(id));

      const order = await createOrderRequest({
        folder_id: folderId,
        vehicle_id: vehicleId,
        optionIds,
      });

      router.push(`/payment/${order.id}`);
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
          {isLoadingOptions ? (
            <p>Chargement des options...</p>
          ) : (
            <>
              <div className={s.optionsContainer}>
                {options.map((option) => (
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
            </>
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
          <span className={s.finalAmount}>{amontTotal.toFixed(2)} €</span>
        </div>
      </div>

      <button
        className={s.validateButton}
        onClick={handleValidateCart}
        disabled={isLoading || isLoadingOptions}
      >
        {isLoading ? "En cours..." : "Valider le panier"}
      </button>
    </div>
  );
}

export default CartComponent;
