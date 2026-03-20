import React, { useState } from "react";
import s from "./styles.module.css";
import { formatDate } from "@/@utils/formatDate";
import { useRouter } from "next/navigation";
import { deleteFolderRequest } from "@/@features/Folders/service/folder.service";
import Modal from "@/@Component/Modal/Modal";

interface CardFolderProps {
  folderId: number;
  brand: string;
  model: string;
  dateSubmitted: string;
  onDelete?: (folderId: number) => void;
}

function CardFolder({
  folderId,
  brand,
  model,
  dateSubmitted,
  onDelete,
}: CardFolderProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const handleRedirect = () => {
    router.push(`/folder-to-complete/${folderId}`);
  };

  const handleDeleteFolder = async () => {
    try {
      await deleteFolderRequest(folderId);
      setOpenModal(false);
      if (onDelete) {
        onDelete(folderId);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du dossier:", error);
    }
  };
  return (
    <div>
      {openModal && (
        <Modal
          title="Supprimer le dossier ?"
          description={`Êtes-vous sûr de vouloir supprimer le dossier ${brand} ${model} ?
Cette action est définitive.`}
          onConfirm={handleDeleteFolder}
          onClose={() => setOpenModal(false)}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      )}
      <div className={s.card}>
        <div className={s.sectionFolder}>
          <div className={s.label}>
            Véhicule selectionné : {brand} {model}
          </div>
          <div className={s.label}>
            Dossier déposé le {formatDate(dateSubmitted)}
          </div>
        </div>
        <div className={s.actions}>
          <button className={s.button} onClick={handleRedirect}>
            Voir mon dossier
          </button>
          {/*todo: desactiver le bouton si dossier non valide */}
          <button className={s.buttonPaid}>Payer</button>
          <button className={s.buttonDelete} onClick={() => setOpenModal(true)}>
            Supprimer mon dossier
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardFolder;
