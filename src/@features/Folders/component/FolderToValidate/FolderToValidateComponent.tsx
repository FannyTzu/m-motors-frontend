"use client";
import React, { useEffect, useState } from "react";
import FolderToValidateCard from "../FolderCardToValidate/FolderToValidateCard";
import s from "./styles.module.css";
import { getAllFoldersRequest } from "../../service/folder.service";

type Vehicle = {
  id: number;
  brand: string;
  model: string;
  type: string;
};

type User = {
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
};

type FolderWithRelations = {
  id: number;
  user_id: number;
  vehicle_id: number;
  status: string;
  created_at: string;
  user: User;
  vehicle: Vehicle;
};

function FolderToValidateComponent() {
  const [folders, setFolders] = useState<FolderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const foldersData: FolderWithRelations[] = await getAllFoldersRequest();
        setFolders(foldersData);
      } catch (err) {
        console.error("Error fetching folders:", err);
        setError("Erreur lors du chargement des dossiers");
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  if (loading) {
    return <div className={s.loading}>Chargement des dossiers...</div>;
  }

  if (error) {
    return <div className={s.error}>{error}</div>;
  }

  return (
    <div className={s.container}>
      <h1 className={s.title}>Dossiers clients</h1>
      {folders.length === 0 ? (
        <div className={s.empty}>Aucun dossier à valider</div>
      ) : (
        <div className={s.foldersGrid}>
          {folders.map((folder) => (
            <FolderToValidateCard
              key={folder.id}
              folder={folder}
              user={folder.user}
              vehicle={folder.vehicle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FolderToValidateComponent;
