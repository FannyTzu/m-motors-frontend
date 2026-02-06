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
import { mockVehicleDetailedView } from "@/@mocks/mockVehicleDetailedView";

// interface VehicleProps {
//   image: string;
//   brand: string;
//   model: string;
//   year: number;
//   kms: number;
//   energy: string;
//   transmission: string;
//   color: string;
//   door: number;
//   places: number;
//   description: string;
//   price: number;
// }

function DetailsViewPage() {
  const {
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
  } = mockVehicleDetailedView;
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
            <div className={s.textIcon}>{kms}</div>
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
            <div className={s.textIcon}>{transmission}</div>
          </div>
        </div>
        <div>
          <h2>Description</h2>
          <div>{description}</div>
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
            <div className={s.textIcon}>{places}</div>
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
