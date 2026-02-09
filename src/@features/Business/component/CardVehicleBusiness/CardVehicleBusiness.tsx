"use client";
import { CalendarDays, Fuel, Gauge, Settings } from "lucide-react";
import Image from "next/image";
import s from "./styles.module.css";
import { useRouter } from "next/navigation";

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
}: CardVehicleProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/business-space/update/${id}`);
  };

  const handleDelete = () => {
    // TODO: Implémenter la suppression de véhicule
  };

  return (
    <div className={s.card}>
      <div className={s.imageSection}>
        <Image src={image} alt={`${brand} ${model}`} fill className={s.image} />
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
            <button className={s.updateButton} onClick={handleEdit}>
              Modifier
            </button>
            <button className={s.deleteButton} onClick={handleDelete}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
      <div className={s.priceSection}>
        <p className={s.price}>{price.toLocaleString("fr-FR")} €</p>
      </div>
    </div>
  );
}

export default CardVehicleBusiness;
