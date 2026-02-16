"use client";
import React from "react";
import { useAuth } from "../Auth/hook/useAuth";
import { ArrowLeft } from "lucide-react";
import s from "./styles.module.css";
import { useRouter } from "next/navigation";

function UserSpaceComponent() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className={s.loading}>Chargement...</div>;
  }
  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <button className={s.backButton} onClick={handleBack}>
        <ArrowLeft />
        Retour
      </button>
      <div className={s.container}>
        <header className={s.header}>
          <h1 className={s.title}>Mon espace personnel</h1>
          <p className={s.subtitle}>
            Gérez vos informations personnelles et suivez vos dossiers.
          </p>
        </header>

        <section className={s.section}>
          <div className={s.sectionTitle}>Informations personnelles</div>
          <div className={s.card}>
            <div className={s.infoGrid}>
              <div>
                <div className={s.label}>Nom</div>
                <div className={s.value}>
                  {user?.firstName || "Ajouter votre nom"}{" "}
                  {user?.lastName || "et prénom"}
                </div>
              </div>
              <div>
                <div className={s.label}>Mail</div>
                <div className={s.value}>
                  {user?.mail || "Mail non disponible"}
                </div>
              </div>
              <div>
                <div className={s.label}>Telephone</div>
                <div className={s.value}>
                  {user?.phone || "Ajouter votre téléphone"}
                </div>
              </div>
              <div>
                <div className={s.label}>Adresse</div>
                <div className={s.value}>
                  {user?.address || "Ajouter votre adresse"}
                </div>
              </div>
            </div>
            <div className={s.actions}>
              <button className={s.button}>Modifier mes informations</button>
              <button className={s.buttonDelete}>Supprimer mon compte</button>
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.sectionTitle}>Mes dossiers</div>
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
        </section>
      </div>
    </div>
  );
}

export default UserSpaceComponent;
