"use client";
import React, { useEffect, useState } from "react";
import s from "./styles.module.css";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";
import { Eye, CheckCircle, Circle } from "lucide-react";
import {
  getFolderByIdRequest,
  updateFolderStatusRequest,
} from "../../service/folder.service";
import { getDocumentsByIdRequest } from "../../service/document.service";
import { formatDate } from "@/@utils/formatDate";
import StatusComponent from "@/@Component/Status/StatusComponent";

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
};

type Folder = {
  id: number;
  user_id: number;
  vehicle_id: number;
  status: string;
  created_at: string;
  user: User;
  vehicle: Vehicle;
};

type Document = {
  id: number;
  type: string;
  url: string;
  name: string;
};

type FolderToConsultComponentProps = {
  folderId: number;
};

function FolderToConsultComponent({ folderId }: FolderToConsultComponentProps) {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        setLoading(true);
        const [folderData, documentsData] = await Promise.all([
          getFolderByIdRequest(folderId),
          getDocumentsByIdRequest(folderId),
        ]);

        setFolder(folderData);
        setDocuments(documentsData);
      } catch (err) {
        console.error("Error fetching folder data:", err);
        setError("Erreur lors du chargement du dossier");
      } finally {
        setLoading(false);
      }
    };

    fetchFolderData();
  }, [folderId]);

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, "_blank");
  };

  const handleValidateFolder = async () => {
    try {
      setLoading(true);
      await updateFolderStatusRequest({ folderId, status: "accepted" });
      setFolder((prev) => (prev ? { ...prev, status: "accepted" } : prev));
      console.log("Dossier validé avec succès");
    } catch (err) {
      console.error("Error validating folder:", err);
      setError("Erreur lors de la validation du dossier");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectFolder = async () => {
    try {
      setLoading(true);
      await updateFolderStatusRequest({ folderId, status: "rejected" });
      setFolder((prev) => (prev ? { ...prev, status: "rejected" } : prev));
      console.log("Dossier refusé avec succès");
    } catch (err) {
      console.error("Error rejecting folder:", err);
      setError("Erreur lors du refus du dossier");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={s.container}>
        <div className={s.loading}>Chargement du dossier...</div>
      </div>
    );
  }

  if (error && !folder) {
    return (
      <div className={s.container}>
        <div className={s.error}>{error}</div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className={s.container}>
        <div className={s.error}>Dossier introuvable</div>
      </div>
    );
  }

  const idCard = documents.find((doc) => doc.type === "idCard");
  const drivingLicense = documents.find((doc) => doc.type === "drivingLicense");
  const rib = documents.find((doc) => doc.type === "rib");

  return (
    <div>
      {" "}
      <ArrowBack />
      <div className={s.container}>
        <h1 className={s.title}>Détail du dossier</h1>

        {error && <div className={s.error}>{error}</div>}

        <div>
          <StatusComponent folderId={folderId} />
        </div>

        <div className={s.section}>
          <h2 className={s.sectionTitle}>Informations véhicule</h2>
          <div className={s.infoGrid}>
            <div className={s.infoItem}>
              <span className={s.label}>Véhicule :</span>
              <span className={s.value}>
                {folder.vehicle.brand} {folder.vehicle.model}
              </span>
            </div>
            <div className={s.infoItem}>
              <span className={s.label}>Type :</span>
              <span className={s.value}>
                {folder.vehicle.type === "sale" ? "Vente" : "Location"}
              </span>
            </div>
          </div>
        </div>

        <div className={s.section}>
          <h2 className={s.sectionTitle}>Informations client</h2>
          <div className={s.infoGrid}>
            <div className={s.infoItem}>
              <span className={s.label}>Nom :</span>
              <span className={s.value}>
                {folder.user.first_name} {folder.user.last_name}
              </span>
            </div>
            <div className={s.infoItem}>
              <span className={s.label}>Email :</span>
              <span className={s.value}>{folder.user.mail}</span>
            </div>
            <div className={s.infoItem}>
              <span className={s.label}>Téléphone :</span>
              <span className={s.value}>{folder.user.phone_number}</span>
            </div>
            <div className={s.infoItem}>
              <span className={s.label}>Date de dépôt du dossier :</span>
              <span className={s.value}>{formatDate(folder.created_at)}</span>
            </div>
          </div>
        </div>

        <div className={s.section}>
          <h2 className={s.sectionTitle}>Documents fournis</h2>
          <div className={s.documentsList}>
            <div className={s.documentItem}>
              <span className={s.documentLabel}>
                {idCard ? (
                  <CheckCircle size={18} color="green" />
                ) : (
                  <Circle size={18} color="red" />
                )}
                Carte d&apos;identité
              </span>
              {idCard ? (
                <button
                  type="button"
                  onClick={() => handleViewDocument(idCard.url)}
                  className={s.viewButton}
                >
                  <Eye size={16} /> Voir
                </button>
              ) : (
                <span className={s.noDocument}>Non fourni</span>
              )}
            </div>
            <div className={s.documentItem}>
              <span className={s.documentLabel}>
                {drivingLicense ? (
                  <CheckCircle size={18} color="green" />
                ) : (
                  <Circle size={18} color="red" />
                )}
                Permis de conduire
              </span>
              {drivingLicense ? (
                <button
                  type="button"
                  onClick={() => handleViewDocument(drivingLicense.url)}
                  className={s.viewButton}
                >
                  <Eye size={16} /> Voir
                </button>
              ) : (
                <span className={s.noDocument}>Non fourni</span>
              )}
            </div>
            <div className={s.documentItem}>
              <span className={s.documentLabel}>
                {rib ? (
                  <CheckCircle size={18} color="green" />
                ) : (
                  <Circle size={18} color="red" />
                )}
                RIB
              </span>
              {rib ? (
                <button
                  type="button"
                  onClick={() => handleViewDocument(rib.url)}
                  className={s.viewButton}
                >
                  <Eye size={16} /> Voir
                </button>
              ) : (
                <span className={s.noDocument}>Non fourni</span>
              )}
            </div>
          </div>
        </div>

        <div className={s.actionsSection}>
          <button onClick={handleValidateFolder} className={s.validateButton}>
            Valider le dossier
          </button>
          <button onClick={handleRejectFolder} className={s.rejectButton}>
            Refuser le dossier
          </button>
        </div>
      </div>
    </div>
  );
}

export default FolderToConsultComponent;
