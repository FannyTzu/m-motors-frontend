import React from "react";
import s from "./styles.module.css";

function CardFolder() {
  return (
    <div>
      <div className={s.card}>
        <div className={s.sectionFolder}>
          <div className={s.label}>Nom du vehicule</div>
          <div className={s.label}>Date de depot du dossier</div>
          <div className={s.value}>-</div>
          <div className={s.value}>-</div>
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
