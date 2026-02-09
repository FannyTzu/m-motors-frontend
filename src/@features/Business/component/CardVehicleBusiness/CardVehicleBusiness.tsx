"use client";
import { CalendarDays, Fuel, Gauge, Settings } from "lucide-react";
import Image from "next/image";
import s from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteVehicleById } from "@/@features/Vehicles/service/vehicle.service";
import Modal from "@/@Component/Modal/Modal";

interface CardVehicleProps {
  id: number;
  image: string;
  status: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  energy: string;
  transmission: string;
  price: number;
  onDelete?: () => void;
  type: string;
}

function CardVehicleBusiness({
  id,
  image,
  status,
  brand,
  model,
  year,
  km,
  energy,
  transmission,
  price,
  onDelete,
  type,
}: CardVehicleProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/business-space/update/${id}`);
  };

  const handleDelete = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteVehicleById(id);
      console.log("Véhicule supprimé avec succès");
      onDelete?.();
      setShowModal(false);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du véhicule"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isRental = type === "rental";

  return (
    <>
      {showModal && (
        <Modal
          title="Supprimer le véhicule ?"
          description={`Êtes-vous sûr de vouloir supprimer ${brand} ${model} ?\nCette action est définitive.`}
          onConfirm={handleConfirmDelete}
          onClose={() => !isDeleting && setShowModal(false)}
          confirmText={isDeleting ? "Suppression..." : "Supprimer"}
          cancelText="Annuler"
        />
      )}
      <div className={s.card}>
        <div className={s.imageSection}>
          <Image
            src={image}
            alt={`${brand} ${model}`}
            fill
            className={s.image}
          />
        </div>
        <div className={s.centerContent}>
          <div className={s.titleSection}>
            <h3 className={s.title}>
              {brand} {model}
            </h3>
          </div>
          <div className={s.statusSection}>
            <span className={s.status}>{status}</span>
          </div>
          <div className={s.detailsSection}>
            <div className={s.infoItem}>
              <CalendarDays size={18} />
              <span>{year}</span>
            </div>
            <div className={s.infoItem}>
              <Gauge size={18} />
              <span>{km} km</span>
            </div>
            <div className={s.infoItem}>
              <Fuel size={18} />
              <span>{energy}</span>
            </div>
            <div className={s.infoItem}>
              <Settings size={18} />
              <span>{transmission}</span>
            </div>
            <div className={s.buttonSection}>
              <button
                className={s.updateButton}
                onClick={handleEdit}
                disabled={isDeleting}
              >
                Modifier
              </button>
              <button
                className={s.deleteButton}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
        <div className={s.priceSection}>
          {price.toLocaleString("fr-FR")} €{isRental && <span> / mois</span>}
        </div>
      </div>
    </>
  );
}

export default CardVehicleBusiness;
