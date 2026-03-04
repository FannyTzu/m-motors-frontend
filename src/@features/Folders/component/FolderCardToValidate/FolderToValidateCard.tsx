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
      <div className={s.section}>
        <div className={s.userName}>
          {user.first_name} {user.last_name}
        </div>
        {/* todo: component status to add */}
        <div>Status à venir</div>
      </div>
      <div className={s.section}>
        <div className={s.contactInfo}>{user.mail}</div>
        <div className={s.contactInfo}>{user.phone_number}</div>
      </div>
      <div className={s.section}>
        <div className={s.vehicleInfo}>
          {vehicle.brand} {vehicle.model}
        </div>
        <div className={s.vehicleType}>{vehicle.type}</div>
        <div className={s.date}>{formatDate(folder.created_at)}</div>
      </div>
      <button className={s.button}>Consulter le dossier</button>
    </div>
  );
}

export default FolderToValidateCard;
