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

interface VehicleProps {
  image: string;
  brand: string;
  model: string;
  year: number;
  kms: number;
  energy: string;
  transmission: string;
  color: string;
  door: number;
  places: number;
  description: string;
  price: number;
}
function DetailsViewPage({
  image,
  brand,
  model,
  year,
  kms,
  energy,
  transmission,
  color,
  door,
  places,
  description,
  price,
}: VehicleProps) {
  return (
    <>
      <button className={s.backButton}>
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
            src={image}
            alt={`${brand} ${model}`}
            fill
            className={s.image}
          />
        </div>
        <div className={s.sectionDetails}>
          <div className={s.details}>
            <div>
              <CalendarDays /> Année
            </div>
            <div>{year}</div>
          </div>
          <div className={s.details}>
            <div>
              {" "}
              <Gauge /> Kilométrage
            </div>
            <div>{kms}</div>
          </div>
          <div className={s.details}>
            <div>
              <Fuel /> Carburant
            </div>
            <div>{energy}</div>
          </div>
          <div className={s.details}>
            <div>
              {" "}
              <Settings /> Transmission
            </div>
            <div>{transmission}</div>
          </div>
        </div>
        <div className={s.sectionDescription}>
          <h2>Description</h2>
          <div>{description}</div>
        </div>
        <div className={s.sectionDetails}>
          <div className={s.details}>
            <div>
              {" "}
              <Brush /> Couleur
            </div>
            <div>{color}</div>
          </div>
          <div className={s.details}>
            <div>
              <DoorOpen /> Portes
            </div>
            <div>{door}</div>
          </div>
          <div className={s.details}>
            <div>
              <UserPlus />
              Places
            </div>
            <div>{places}</div>
          </div>
        </div>
        <div className={s.sectionPrice}>
          <h2>Financement</h2>
          <div>paiement comptant ou location longue duréee {price}</div>
        </div>
        <button>Déposer mon dossier pour ce véhicule</button>
      </div>
    </>
  );
}

export default DetailsViewPage;
