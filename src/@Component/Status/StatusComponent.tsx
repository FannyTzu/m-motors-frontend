"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import s from "./styles.module.css";
import { getFolderByIdRequest } from "@/@features/Folders/service/folder.service";

interface StatusComponentProps {
  folderId: number;
}

type FolderStatus =
  | "active" // folder create
  | "submitted" // folder submitted by user
  | "rejected" // folder rejected by admin
  | "accepted" // folder accepted by admin - awaiting payment
  | "closed" // payment completed and folder closed
  | "cancelled"; // payment cancelled by user

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

function StatusComponent({ folderId }: StatusComponentProps) {
  const [status, setStatus] = useState<FolderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const folder = await getFolderByIdRequest(folderId);
        setStatus(folder.status as FolderStatus);
      } catch (err) {
        console.error("Error fetching folder status:", err);
        setError("Erreur lors du chargement du statut");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [folderId]);

  const statusConfig: Record<string, StatusConfig> = {
    active: {
      label: "En attente",
      color: "#e0c25f",
      bgColor: "#fff3cd",
      icon: <Clock size={20} />,
    },
    submitted: {
      label: "Envoyé",
      color: "#007bff",
      bgColor: "#cce5ff",
      icon: <Clock size={20} />,
    },
    accepted: {
      label: "Validé",
      color: "#28a745",
      bgColor: "#d4edda",
      icon: <CheckCircle size={20} />,
    },
    rejected: {
      label: "Refusé",
      color: "#dc3545",
      bgColor: "#f8d7da",
      icon: <XCircle size={20} />,
    },
  };

  if (loading) {
    return <div className={s.loading}>Chargement...</div>;
  }

  if (error || !status) {
    return <div className={s.error}>Statut indisponible</div>;
  }

  const config = statusConfig[status];

  if (!config) {
    console.warn(`Statut inconnu: ${status}`);
    return <div className={s.error}>Statut non reconnu</div>;
  }

  return (
    <div
      className={s.container}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.color,
      }}
    >
      <div className={s.content}>
        <div style={{ color: config.color }}>{config.icon}</div>
        <div className={s.text}>
          <span className={s.label}>Statut :</span>
          <span className={s.status} style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatusComponent;
