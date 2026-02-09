import React from "react";
import s from "./styles.module.css";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}

function Modal({
  title,
  description,
  onConfirm,
  onClose,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}: ModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
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

export default Modal;
