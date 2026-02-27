"use client";
import React, { useEffect, useRef, useState } from "react";
import s from "./styles.module.css";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";
import {
  CheckCircle,
  Eye,
  IdCard,
  IdCardLanyard,
  Landmark,
  Upload,
} from "lucide-react";
import {
  uploadDocumentRequest,
  getDocumentsByIdRequest,
} from "../service/folder.service";
import { useRouter } from "next/navigation";

interface FolderToCompleteComponentProps {
  folderId: number;
}

function FolderToCompleteComponent({
  folderId,
}: FolderToCompleteComponentProps) {
  const router = useRouter();
  const [files, setFiles] = useState<{
    idCard: File | null;
    drivingLicense: File | null;
    rib: File | null;
  }>({
    idCard: null,
    drivingLicense: null,
    rib: null,
  });

  const [existingDocuments, setExistingDocuments] = useState<{
    idCard: { id: number; url: string; name: string } | null;
    drivingLicense: { id: number; url: string; name: string } | null;
    rib: { id: number; url: string; name: string } | null;
  }>({
    idCard: null,
    drivingLicense: null,
    rib: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idCardInputRef = useRef<HTMLInputElement>(null);
  const drivingLicenseInputRef = useRef<HTMLInputElement>(null);
  const ribInputRef = useRef<HTMLInputElement>(null);

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
              docsByType[doc.type] = {
                id: doc.id,
                url: doc.url,
                name: doc.name,
              };
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError("Le fichier ne doit pas dépasser 5MB");
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
          return;
        }

        setFiles((prev) => ({ ...prev, [fileType]: file }));
        setError(null);
      }
    };

  const handleButtonClick = (
    ref: React.RefObject<HTMLInputElement | null>,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    ref.current?.click();
  };

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!files.idCard || !files.drivingLicense || !files.rib) {
      setError("Veuillez fournir tous les documents requis");
      return;
    }

    setIsSubmitting(true);

    try {
      await uploadDocumentRequest({
        folderId,
        documentType: "idCard",
        file: files.idCard,
      });

      await uploadDocumentRequest({
        folderId,
        documentType: "drivingLicense",
        file: files.drivingLicense,
      });

      await uploadDocumentRequest({
        folderId,
        documentType: "rib",
        file: files.rib,
      });

      router.push("/user-space");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la soumission du dossier"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ArrowBack />
      <div className={s.container}>
        <div>
          <h1>Dépôt de dossier</h1>
          {/*  TODO : ajouter le composant statut qd il sera créé et fonctionnel */}
          <div>STATUT DU DOSSIER</div>

          <form onSubmit={handleSubmit}>
            <h2>Pièces justificatives</h2>

            <p className={s.explanation}>
              Veuillez télécharger les documents requis avant d&apos;envoyer
              votre dossier, vous pourrez suivre votre dossier en regardant le
              statut ci dessus qui se mettra à jour !{" "}
            </p>

            {error && <div className={s.error}>{error} erreur</div>}

            <ul className={s.documentList}>
              <li className={s.documentItem}>
                <IdCard />
                <span>Pièce d&apos;identité</span>
                <input
                  ref={idCardInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileChange("idCard")}
                  style={{ display: "none" }}
                  aria-label="Télécharger pièce d'identité"
                />
                <div className={s.buttonGroup}>
                  <button
                    type="button"
                    onClick={(e) => handleButtonClick(idCardInputRef, e)}
                    className={s.uploadButton}
                  >
                    {files.idCard ? (
                      <>
                        <CheckCircle size={16} /> {files.idCard.name}
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Télécharger
                      </>
                    )}
                  </button>
                  {existingDocuments.idCard && (
                    <button
                      type="button"
                      onClick={() =>
                        handleViewDocument(existingDocuments.idCard!.url)
                      }
                      className={s.viewButton}
                    >
                      <Eye size={16} /> Voir mon document
                    </button>
                  )}
                </div>
              </li>
              <li className={s.documentItem}>
                <IdCardLanyard />
                <span>Permis de conduire</span>
                <input
                  ref={drivingLicenseInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileChange("drivingLicense")}
                  style={{ display: "none" }}
                  aria-label="Télécharger permis de conduire"
                />
                <div className={s.buttonGroup}>
                  <button
                    type="button"
                    onClick={(e) =>
                      handleButtonClick(drivingLicenseInputRef, e)
                    }
                    className={s.uploadButton}
                  >
                    {files.drivingLicense ? (
                      <>
                        <CheckCircle size={16} /> {files.drivingLicense.name}
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Télécharger
                      </>
                    )}
                  </button>
                  {existingDocuments.drivingLicense && (
                    <button
                      type="button"
                      onClick={() =>
                        handleViewDocument(
                          existingDocuments.drivingLicense!.url
                        )
                      }
                      className={s.viewButton}
                    >
                      <Eye size={16} /> Voir mon document
                    </button>
                  )}
                </div>
              </li>
              <li className={s.documentItem}>
                <Landmark />
                <span>RIB</span>
                <input
                  ref={ribInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileChange("rib")}
                  style={{ display: "none" }}
                  aria-label="Télécharger RIB"
                />
                <div className={s.buttonGroup}>
                  <button
                    type="button"
                    onClick={(e) => handleButtonClick(ribInputRef, e)}
                    className={s.uploadButton}
                  >
                    {files.rib ? (
                      <>
                        <CheckCircle size={16} /> {files.rib.name}
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Télécharger
                      </>
                    )}
                  </button>
                  {existingDocuments.rib && (
                    <button
                      type="button"
                      onClick={() =>
                        handleViewDocument(existingDocuments.rib!.url)
                      }
                      className={s.viewButton}
                    >
                      <Eye size={16} /> Voir mon document
                    </button>
                  )}
                </div>
              </li>
            </ul>

            <button
              type="submit"
              className={s.submitButton}
              disabled={
                isSubmitting ||
                !files.idCard ||
                !files.drivingLicense ||
                !files.rib
              }
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer mon dossier"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FolderToCompleteComponent;
