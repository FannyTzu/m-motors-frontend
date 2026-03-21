"use client";
import s from "./styles.module.css";
import {
  CalendarDays,
  Fuel,
  Gauge,
  Settings,
  Brush,
  UserPlus,
  DoorOpen,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getVehicleById } from "@/@features/Vehicles/service/vehicle.service";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";

import { createFolderRequest } from "../Folders/service/folder.service";
import { useRouter } from "next/navigation";
import { useAuth } from "../Auth/hook/useAuth";
import Modal from "@/@Component/Modal/Modal";

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
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"login" | "incomplete">("login");
  const router = useRouter();
  const { user } = useAuth();

  const isUserInfoComplete =
    user?.firstName && user?.lastName && user?.phone && user?.address;

  const handleSubmitFolder = async () => {
    if (!user?.id) {
      setModalType("login");
      setShowModal(true);
      return;
    }

    if (!isUserInfoComplete) {
      setModalType("incomplete");
      setShowModal(true);
      return;
    }

    try {
      const response = await createFolderRequest({
        vehicleId,
        userId: user.id,
      });
      console.log("Réponse de la création du dossier :", response);
      router.push("/user-space");
    } catch (err) {
      console.error("Erreur lors de la création du dossier :", err);
      if (err instanceof Error && err.message.includes("Non authentifié")) {
        setModalType("login");
        setShowModal(true);
      }
    }
  };

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
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

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

  const handleConfirmLogin = () => {
    router.push("/login");
  };

  const handleCompleteInfo = () => {
    router.push("/user-space/contact-details");
  };

  return (
    <>
      {showModal && modalType === "login" && (
        <Modal
          title="Vous n'êtes pas connecté"
          description={`Vous devez être connecté pour créer un dossier pour ce véhicule.`}
          onConfirm={handleConfirmLogin}
          onClose={() => setShowModal(false)}
          confirmText={"Se connecter"}
          cancelText="Annuler"
        />
      )}
      {showModal && modalType === "incomplete" && (
        <Modal
          title="Oups ! Il manque des informations sur votre profil"
          description={`Merci de compléter vos informations personnelles avant de déposer votre dossier.`}
          onConfirm={handleCompleteInfo}
          onClose={() => setShowModal(false)}
          confirmText={"Oui, je le fais !"}
          cancelText="Annuler"
        />
      )}
      <ArrowBack />

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
        <div className={s.financementSection}>
          <h2 className={s.sectionPriceTitle}>Financement</h2>
          {isRental ? (
            <div className={s.sectionPrice}>
              <div className={s.priceLabel}>Location longue durée</div>
              <div className={s.priceAmount}>
                {price.toLocaleString("fr-FR")} €
                <span className={s.priceUnit}> / mois</span>
              </div>
            </div>
          ) : (
            <div className={s.sectionPrice}>
              <div className={s.priceLabel}>Paiement comptant</div>
              <div className={s.priceAmount}>
                {price.toLocaleString("fr-FR")} €
              </div>
            </div>
          )}
        </div>
        <button onClick={handleSubmitFolder}>
          Déposer mon dossier pour ce véhicule
        </button>
      </div>
    </>
  );
}

export default DetailsViewContent;
