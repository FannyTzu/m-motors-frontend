import React from "react";
import { formatDate } from "@/@utils/formatDate";
import s from "./styles.module.css";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  type: string;
}

interface Folder {
  id: number;
  user_id: number;
  vehicle_id: number;
  status: string;
  created_at: string;
}

interface User {
  id: number;
  mail: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address?: string;
  city?: string;
  zip_code?: string;
  country?: string;
  role: string;
}

interface FolderToValidateCardProps {
  folder: Folder;
  user: User;
  vehicle: Vehicle;
}

function FolderToValidateCard({
  folder,
  user,
  vehicle,
}: FolderToValidateCardProps) {
  return (
    <div className={s.card}>
      {" "}
      {/* todo: component status to add */}
      <div>Status à venir</div>
      <div className={s.section}>
        <div className={s.label}>
          Véhicule :
          <span className={s.span}>
            {vehicle.brand} {vehicle.model}
          </span>
        </div>
        <div className={s.label}>
          Type :
          <span className={s.span}>
            {vehicle.type === "sale" ? "Vente" : "Location"}
          </span>
        </div>
        <div className={s.label}>
          Dossier du
          <span className={s.span}>{formatDate(folder.created_at)}</span>
        </div>
      </div>
      <div className={s.section}>
        <div className={s.label}>
          Nom et prénom :
          <span className={s.span}>
            {user.first_name} {user.last_name}
          </span>
        </div>
      </div>
      <div className={s.section}>
        <div className={s.label}>
          Email : <span className={s.span}>{user.mail}</span>
        </div>
        <div className={s.label}>
          Téléphone : <span className={s.span}>{user.phone_number}</span>
        </div>
      </div>
      <button className={s.button}>Consulter le dossier</button>
    </div>
  );
}

export default FolderToValidateCard;
