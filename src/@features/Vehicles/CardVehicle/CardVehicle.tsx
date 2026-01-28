'use client'
import { ArrowBigRight, CalendarDays, Fuel, Gauge } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import s from "./styles.module.css";

interface CardVehicleProps {
  image: string;
  status: string;
  brand: string;
  model: string;
  location: string;
  year: number;
  km: number;
  energy: string;
  price: number;
}

function CardVehicle({
  image,
  status,
  brand,
  model,
  location,
  year,
  km,
  energy,
  price,
}: CardVehicleProps) {

  const router = useRouter();

  //  todo add vehicle id to the route
  const handleDetails = () => {
    router.replace('/details');
  }

  const statusLabel =
    status === "rental"
      ? "Location LLD"
      : status === "sale"
        ? "Vente"
        : status;

  const isRental = status === "rental" || statusLabel === "Location LLD";

  return (
    <div className={s.container}>

      <div className={s.imageContainer}>
        <Image
          src={image}
          alt={`${brand} ${model}`}
          fill
          className={s.image}
        />

        {statusLabel && <div className={isRental ? s.statusRental : s.statusSale}>{statusLabel}</div>}
      </div>

      <h3 className={s.title}>
        {brand} {model}
      </h3>

      <p className={s.location}>{location}</p>

      <div className={s.infosContainer}>
        <div className={s.infoItem}>
          <CalendarDays size={20} color="#0ea5e9" /><span>{year}</span>
        </div>
        <div className={s.infoItem}>
          <Gauge size={20} color="#0ea5e9" /><span> {km} km</span>
        </div>
        <div className={s.infoItem}>
          <Fuel size={20} color="#0ea5e9" /><span>{energy}</span>
        </div>
      </div>

      <div className={s.priceSection}>
        <div>
          <p className={s.priceLabel}>À partir de</p>
          <p className={s.price}>
            {price.toLocaleString("fr-FR")} €
            {isRental && <span> / mois</span>}
          </p>
        </div>
        <button className={s.button} onClick={handleDetails}>  <ArrowBigRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default CardVehicle;
