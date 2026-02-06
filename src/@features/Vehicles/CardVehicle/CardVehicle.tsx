"use client";
import { ArrowBigRight, CalendarDays, Fuel, Gauge } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import s from "./styles.module.css";

interface CardVehicleProps {
  image: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  energy: string;
  price: number;
}

function CardVehicle({
  image,
  type,
  brand,
  model,
  year,
  km,
  energy,
  price,
}: CardVehicleProps) {
  const router = useRouter();

  //  todo add vehicle id to the route
  const handleDetails = () => {
    router.replace("/detailed-view");
  };

  const typeLabel =
    type === "rental" ? "Location LLD" : type === "sale" ? "Vente" : type;

  const isRental = type === "rental" || typeLabel === "Location LLD";

  return (
    <div className={s.container}>
      <div className={s.imageContainer}>
        <Image src={image} alt={`${brand} ${model}`} fill className={s.image} />

        {typeLabel && (
          <div className={isRental ? s.statusRental : s.statusSale}>
            {typeLabel}
          </div>
        )}
      </div>

      <h3 className={s.title}>
        {brand} {model}
      </h3>

      <div className={s.infosContainer}>
        <div className={s.infoItem}>
          <CalendarDays size={20} color="#0ea5e9" />
          <span>{year}</span>
        </div>
        <div className={s.infoItem}>
          <Gauge size={20} color="#0ea5e9" />
          <span> {km} km</span>
        </div>
        <div className={s.infoItem}>
          <Fuel size={20} color="#0ea5e9" />
          <span>{energy}</span>
        </div>
      </div>

      <div className={s.priceSection}>
        <div>
          <p className={s.priceLabel}>À partir de</p>
          <p className={s.price}>
            {price.toLocaleString("fr-FR")} €{isRental && <span> / mois</span>}
          </p>
        </div>
        <button className={s.button} onClick={handleDetails}>
          {" "}
          <ArrowBigRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default CardVehicle;
