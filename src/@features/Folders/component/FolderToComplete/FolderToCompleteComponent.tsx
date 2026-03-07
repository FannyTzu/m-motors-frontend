"use client";
import React, { useEffect, useState } from "react";
import s from "./styles.module.css";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";
import {
  CheckCircle,
  Eye,
  IdCard,
  IdCardLanyard,
  Landmark,
  Upload,
  Trash2,
} from "lucide-react";
import {
  deleteDocumentRequest,
  getDocumentsByIdRequest,
} from "../../service/folder.service";

interface FolderToCompleteComponentProps {
  folderId: number;
}

function FolderToCompleteComponent({
  folderId,
}: FolderToCompleteComponentProps) {
  const [existingDocuments, setExistingDocuments] = useState<{
    idCard: { id: number; url: string; name: string } | null;
    drivingLicense: { id: number; url: string; name: string } | null;
    rib: { id: number; url: string; name: string } | null;
  }>({
    idCard: null,
    drivingLicense: null,
    rib: null,
  });

  const [uploadingState, setUploadingState] = useState<{
    idCard: boolean;
    drivingLicense: boolean;
    rib: boolean;
  }>({
    idCard: false,
    drivingLicense: false,
    rib: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await getDocumentsByIdRequest(folderId);

        const docsByType: {
          idCard: { id: number; url: string; name: string } | null;
          drivingLicense: { id: number; url: string; name: string } | null;
          rib: { id: number; url: string; name: string } | null;
        } = {
          idCard: null,
          drivingLicense: null,
          rib: null,
        };

        documents.forEach(
          (doc: { id: number; type: string; url: string; name: string }) => {
            if (
              doc.type === "idCard" ||
              doc.type === "drivingLicense" ||
              doc.type === "rib"
            ) {
              if (!docsByType[doc.type] || doc.id > docsByType[doc.type]!.id) {
                docsByType[doc.type] = {
                  id: doc.id,
                  url: doc.url,
                  name: doc.name,
                };
              }
            }
          }
        );

        setExistingDocuments(docsByType);
      } catch (err) {
        console.error("Erreur lors du chargement des documents:", err);
      }
    };

    fetchDocuments();
  }, [folderId]);

  const handleFileChange =
    (fileType: "idCard" | "drivingLicense" | "rib") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setError("Le fichier ne doit pas dépasser 5MB");
        setSuccessMessage(null);
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Ce format de fichier n'est pas accepté, utilisez JPG, PNG ou PDF"
        );
        setSuccessMessage(null);
        return;
      }

      setError(null);
      setSuccessMessage(null);
      setUploadingState((prev) => ({ ...prev, [fileType]: true }));

      try {
        const documents = await getDocumentsByIdRequest(folderId);
        const docsByType: {
          idCard: { id: number; url: string; name: string } | null;
          drivingLicense: { id: number; url: string; name: string } | null;
          rib: { id: number; url: string; name: string } | null;
        } = {
          idCard: null,
          drivingLicense: null,
          rib: null,
        };
        documents.forEach(
          (doc: { id: number; type: string; url: string; name: string }) => {
            if (
              doc.type === "idCard" ||
              doc.type === "drivingLicense" ||
              doc.type === "rib"
            ) {
              if (!docsByType[doc.type] || doc.id > docsByType[doc.type]!.id) {
                docsByType[doc.type] = {
                  id: doc.id,
                  url: doc.url,
                  name: doc.name,
                };
              }
            }
          }
        );
        setExistingDocuments(docsByType);
        setSuccessMessage("Document téléchargé avec succès !");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
        e.target.value = "";
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du téléchargement du document"
        );
      } finally {
        setUploadingState((prev) => ({ ...prev, [fileType]: false }));
      }
    };

  const handleDeleteDocument = async (
    fileType: "idCard" | "drivingLicense" | "rib"
  ) => {
    if (!existingDocuments[fileType]) return;
    setUploadingState((prev) => ({ ...prev, [fileType]: true }));
    setError(null);
    setSuccessMessage(null);
    try {
      await deleteDocumentRequest(existingDocuments[fileType]!.id);
      const documents = await getDocumentsByIdRequest(folderId);
      const docsByType: {
        idCard: { id: number; url: string; name: string } | null;
        drivingLicense: { id: number; url: string; name: string } | null;
        rib: { id: number; url: string; name: string } | null;
      } = {
        idCard: null,
        drivingLicense: null,
        rib: null,
      };
      documents.forEach(
        (doc: { id: number; type: string; url: string; name: string }) => {
          if (
            doc.type === "idCard" ||
            doc.type === "drivingLicense" ||
            doc.type === "rib"
          ) {
            if (!docsByType[doc.type] || doc.id > docsByType[doc.type]!.id) {
              docsByType[doc.type] = {
                id: doc.id,
                url: doc.url,
                name: doc.name,
              };
            }
          }
        }
      );
      setExistingDocuments(docsByType);
      setSuccessMessage("Document supprimé avec succès !");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du document"
      );
    } finally {
      setUploadingState((prev) => ({ ...prev, [fileType]: false }));
    }
  };

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, "_blank");
  };

  const allDocumentsUploaded =
    existingDocuments.idCard &&
    existingDocuments.drivingLicense &&
    existingDocuments.rib;

  return (
    <div>
      <ArrowBack />
      <div className={s.container}>
        <div>
          <h1>Dépôt de dossier</h1>
          {/*  TODO : ajouter le composant statut qd il sera créé et fonctionnel */}
          <div>STATUT DU DOSSIER</div>

          <h2>Pièces justificatives</h2>

          <p className={s.explanation}>
            Téléchargez vos documents un par un. Vous pouvez les supprimer à
            tout moment et les remplacer.
          </p>

          {error && <div className={s.error}>{error}</div>}
          {successMessage && <div className={s.success}>{successMessage}</div>}

          <ul className={s.documentList}>
            <li className={s.documentItem}>
              {existingDocuments.idCard ? (
                <span className={s.statusSuccess}>
                  <CheckCircle size={20} />
                </span>
              ) : null}
              <IdCard />
              <span>Pièce d&apos;identité</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={handleFileChange("idCard")}
                style={{ display: "none" }}
                id="idCard-input"
                aria-label="Télécharger pièce d'identité"
                disabled={uploadingState.idCard}
              />
              <div className={s.buttonGroup}>
                {uploadingState.idCard ? (
                  <span className={s.statusText}>⏳ en cours...</span>
                ) : existingDocuments.idCard ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleViewDocument(existingDocuments.idCard!.url)
                      }
                      className={s.viewButton}
                    >
                      <Eye size={16} /> Voir
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDocument("idCard")}
                      className={s.deleteButton}
                      disabled={uploadingState.idCard}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <label htmlFor="idCard-input" className={s.uploadButton}>
                    <Upload size={16} /> Télécharger
                  </label>
                )}
              </div>
            </li>
            <li className={s.documentItem}>
              {existingDocuments.drivingLicense ? (
                <span className={s.statusSuccess}>
                  <CheckCircle size={20} />
                </span>
              ) : null}
              <IdCardLanyard />
              <span>Permis de conduire</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={handleFileChange("drivingLicense")}
                style={{ display: "none" }}
                id="drivingLicense-input"
                aria-label="Télécharger permis de conduire"
                disabled={uploadingState.drivingLicense}
              />
              <div className={s.buttonGroup}>
                {uploadingState.drivingLicense ? (
                  <span className={s.statusText}>⏳ en cours...</span>
                ) : existingDocuments.drivingLicense ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleViewDocument(
                          existingDocuments.drivingLicense!.url
                        )
                      }
                      className={s.viewButton}
                    >
                      <Eye size={16} /> Voir
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => handleDeleteDocument("drivingLicense")}
                      className={s.deleteButton}
                      disabled={uploadingState.drivingLicense}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <label
                    htmlFor="drivingLicense-input"
                    className={s.uploadButton}
                  >
                    <Upload size={16} /> Télécharger
                  </label>
                )}
              </div>
            </li>
            <li className={s.documentItem}>
              {existingDocuments.rib ? (
                <span className={s.statusSuccess}>
                  <CheckCircle size={20} />
                </span>
              ) : null}
              <Landmark />
              <span>RIB</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={handleFileChange("rib")}
                style={{ display: "none" }}
                id="rib-input"
                aria-label="Télécharger RIB"
                disabled={uploadingState.rib}
              />
              <div className={s.buttonGroup}>
                {uploadingState.rib ? (
                  <span className={s.statusText}>⏳ en cours...</span>
                ) : existingDocuments.rib ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleViewDocument(existingDocuments.rib!.url)
                      }
                      className={s.viewButton}
                    >
                      <Eye size={16} /> Voir
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDocument("rib")}
                      className={s.deleteButton}
                      disabled={uploadingState.rib}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <label htmlFor="rib-input" className={s.uploadButton}>
                    <Upload size={16} /> Télécharger
                  </label>
                )}
              </div>
            </li>
          </ul>
          {/* TODO: ajouter logique pour soumettre le dossier */}
          {allDocumentsUploaded && (
            <button className={s.submitButton}>
              ✅ Tous les documents sont prêts ! Envoyer le dossier maintenant
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FolderToCompleteComponent;
