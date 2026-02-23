import React from "react";
import s from "./styles.module.css";
import { formatDate } from "@/@utils/formatDate";

interface CardFolderProps {
  brand: string;
  model: string;
  dateSubmitted: string;
}

function CardFolder({ brand, model, dateSubmitted }: CardFolderProps) {
  return (
    <div>
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
          <button className={s.button}>Voir mon dossier</button>
          {/*todo: desactiver le bouton si dossier non valide */}
          <button className={s.buttonPaid}>Payer</button>
        </div>
      </div>
    </div>
  );
}

export default CardFolder;
