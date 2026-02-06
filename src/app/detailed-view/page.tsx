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
          <div>
            <div className={s.details}>
              <div>
                <CalendarDays />
              </div>
              <div>Année</div>
            </div>
            <div>{year}</div>
          </div>
          <div>
            <div className={s.details}>
              <div>
                <Gauge />
              </div>
              <div>Kilométrage</div>
            </div>
            <div>{kms}</div>
          </div>
          <div>
            <div className={s.details}>
              <div>
                <Fuel />
              </div>
              <div>Carburant</div>
            </div>
            <div>{energy}</div>
          </div>
          <div>
            <div className={s.details}>
              <div>
                <Settings />
              </div>
              <div>Transmission</div>
            </div>
            <div>{transmission}</div>
          </div>
        </div>
        <div className={s.sectionDescription}>
          <h2>Description</h2>
          <div>{description}</div>
        </div>
        <div className={s.sectionDetails}>
          <div>
            <div className={s.details}>
              <div>
                <Brush />
              </div>
              <div>Couleur</div>
            </div>
            <div>{color}</div>
          </div>
          <div>
            <div className={s.details}>
              <div>
                <DoorOpen />
              </div>
              <div>Portes</div>
            </div>
            <div>{door}</div>
          </div>
          <div>
            <div className={s.details}>
              <div>
                <UserPlus />
              </div>
              <div>Places</div>
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
