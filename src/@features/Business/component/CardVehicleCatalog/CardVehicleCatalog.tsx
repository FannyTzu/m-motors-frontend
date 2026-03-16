"use client";
import { CalendarDays, Fuel, Gauge, Settings } from "lucide-react";
import Image from "next/image";
import s from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteVehicleById,
  updateVehicle,
  getVehicleById,
} from "@/@features/Vehicles/service/vehicle.service";
import Modal from "@/@Component/Modal/Modal";
import ModalToogleRentSale from "@/@features/Business/component/ModalToogleRentSale/ModalToogleRentSale";

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

function CardVehicleCatalog({
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
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleEdit = () => {
    router.push(`/business-space/update/${id}`);
  };

  const handleDelete = () => {
    setShowModal(true);
  };

  const handleToogleType = () => {
    setShowToggleModal(true);
  };

  const handleConfirmToggle = async (newPrice: number) => {
    try {
      setIsToggling(true);
      const newType = type === "rental" ? "sale" : "rental";

      const currentVehicle = await getVehicleById(id);

      await updateVehicle(id, {
        ...currentVehicle,
        type: newType,
        price: newPrice,
      });

      console.log(`Véhicule basculé de ${type} à ${newType}`);
      setShowToggleModal(false);

      router.refresh();
    } catch (err) {
      console.error("Erreur lors du basculement:", err);
      alert(
        err instanceof Error ? err.message : "Erreur lors du changement de type"
      );
    } finally {
      setIsToggling(false);
    }
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

  const transmissionLabels: Record<string, string> = {
    automatic: "Automatique",
    manual: "Manuelle",
  };

  const statusLabels: Record<string, string> = {
    available: "Disponible",
    reserved: "Réservé",
    sold: "Vendu",
  };

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
      {showToggleModal && (
        <ModalToogleRentSale
          title={`Basculer vers ${type === "rental" ? "Vente" : "Location"} ?`}
          description={`Basculer le véhicule ${brand} ${model} de "${
            type === "rental" ? "Location LLD" : "Vente"
          }" à "${type === "rental" ? "Vente" : "Location LLD"}".`}
          price={price}
          onConfirm={(newPrice) => handleConfirmToggle(newPrice)}
          onClose={() => !isToggling && setShowToggleModal(false)}
          confirmText={isToggling ? "Basculement..." : "Confirmer"}
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
            <span className={s.status}>{statusLabels[status] || status}</span>
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
              <span>{transmissionLabels[transmission] || transmission}</span>
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
              <button onClick={handleToogleType}>Basculer</button>
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

export default CardVehicleCatalog;
