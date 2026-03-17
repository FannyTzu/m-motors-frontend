import React, { useState } from "react";
import s from "./styles.module.css";
import { X } from "lucide-react";

interface ModalToogleRentSaleProps {
  title: string;
  description: string;
  price: number;
  onConfirm: (newPrice: number) => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}

function ModalToogleRentSale({
  title,
  description,
  price,
  onConfirm,
  onClose,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}: ModalToogleRentSaleProps) {
  const [newPrice, setNewPrice] = useState<number>(price);

  const handleConfirm = () => {
    onConfirm(newPrice);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={s.overlay} onClick={handleOverlayClick}>
      <div className={s.modal}>
        <button className={s.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className={s.title}>{title}</h2>
        <p className={s.description}>{description}</p>
        <div className={s.inputGroup}>
          <label htmlFor="newPrice">Indiquez le nouveau prix : </label>
          <input
            id="newPrice"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(parseFloat(e.target.value))}
            min="0"
            step="0.01"
          />
        </div>
        <div className={s.buttonGroup}>
          <button className={s.cancelButton} onClick={onClose}>
            {cancelText}
          </button>
          <button className={s.confirmButton} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalToogleRentSale;
