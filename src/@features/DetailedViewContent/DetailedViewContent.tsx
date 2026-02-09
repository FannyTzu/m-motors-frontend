"use client";
import s from "./styles.module.css";
import {
  ArrowLeft,
  CalendarDays,
  Fuel,
  Gauge,
  Settings,
  Brush,
  UserPlus,
  DoorOpen,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getVehicleById } from "@/@features/Vehicles/service/vehicle.service";

interface Vehicle {
  image: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  energy: string;
  transmission: string;
  color: string;
  door: number;
  place: number;
  description: string;
  price: number;
  type: string;
}

interface DetailsViewContentProps {
  vehicleId: number;
}

function DetailsViewContent({ vehicleId }: DetailsViewContentProps) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await getVehicleById(vehicleId);
        setVehicle(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du véhicule"
        );
        console.error("Error fetching vehicle:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const handleBack = () => {
    router.back();
  };

  const transmissionLabels: Record<string, string> = {
    automatic: "Automatique",
    manual: "Manuelle",
  };

  if (loading) {
    return <div className={s.loading}>Chargement...</div>;
  }

  if (error) {
    return <div className={s.error}>Erreur : {error}</div>;
  }

  if (!vehicle) {
    return <div className={s.error}>Véhicule non trouvé</div>;
  }

  const {
    image,
    brand,
    model,
    year,
    km,
    energy,
    transmission,
    color,
    door,
    place,
    description,
    price,
    type,
  } = vehicle;

  const isRental = type === "rental";

  return (
    <>
      <button className={s.backButton} onClick={handleBack}>
        <ArrowLeft />
        Retour
      </button>

      <div className={s.container}>
        <div>
          <h1>
            {brand} {model}
          </h1>
        </div>
        <div className={s.imageSection}>
          <Image
            src={image || "/carpix.png"}
            alt={`${brand} ${model}`}
            fill
            className={s.image}
          />
        </div>
        <div className={s.sectionDetails}>
          <div className={s.details}>
            <div className={s.icon}>
              <div>
                <CalendarDays size={16} />
              </div>
              <div>Année</div>
            </div>
            <div className={s.textIcon}>{year}</div>
          </div>
          <div className={s.details}>
            <div className={s.icon}>
              <div>
                <Gauge size={16} />
              </div>
              <div>Kilométrage</div>
            </div>
            <div className={s.textIcon}>{km}</div>
          </div>
          <div className={s.details}>
            <div className={s.icon}>
              <div>
                <Fuel size={16} />
              </div>
              <div>Carburant</div>
            </div>
            <div className={s.textIcon}>{energy}</div>
          </div>
          <div className={s.details}>
            <div className={s.icon}>
              <div>
                <Settings size={16} />
              </div>
              <div>Transmission</div>
            </div>
            <div className={s.textIcon}>
              {transmissionLabels[transmission] || transmission}
            </div>
          </div>
        </div>
        <div>
          <h2>Description</h2>
          <div className={s.description}>{description}</div>
        </div>
        <div className={s.sectionDetails}>
          <div className={s.details}>
            <div className={s.icon}>
              <div>
                <Brush size={16} />
              </div>
              <div>Couleur</div>
            </div>
            <div className={s.textIcon}>{color}</div>
          </div>
          <div className={s.details}>
            <div className={s.icon}>
              <div>
                <DoorOpen size={16} />
              </div>
              <div>Portes</div>
            </div>
            <div className={s.textIcon}>{door}</div>
          </div>
          <div className={s.details}>
            <div className={s.icon}>
              <div>
                <UserPlus size={16} />
              </div>
              <div>Places</div>
            </div>
            <div className={s.textIcon}>{place}</div>
          </div>
        </div>
        <div>
          <h2 className={s.sectionPriceTitle}>Financement</h2>
          <div>
            {isRental ? (
              <div className={s.sectionPrice}>
                <p>Location longue durée</p>
                <p>{price} € / mois</p>
              </div>
            ) : (
              <div className={s.sectionPrice}>
                <p>Paiement comptant</p>
                <p>{price} €</p>
              </div>
            )}
          </div>
        </div>
        <button>Déposer mon dossier pour ce véhicule</button>
      </div>
    </>
  );
}

export default DetailsViewContent;
