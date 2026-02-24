"use client";

import s from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/@features/Auth/hook/useAuth";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";
import FolderList from "../FolderList/FolderList";
import { deleteUserAccountRequest } from "@/@features/Auth/service/auth.service";
import { useState } from "react";
import Modal from "@/@Component/Modal/Modal";

function UserSpaceComponent() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  if (isLoading) {
    return <div className={s.loading}>Chargement...</div>;
  }

  const handleClickUpdateDetails = () => {
    router.push("/user-space/contact-details");
  };

  const handleClickDelete = async () => {
    {
      try {
        await deleteUserAccountRequest();
        router.push("/login");
      } catch (error) {
        console.error("Erreur lors de la suppression du compte:", error);
      }
    }
  };

  return (
    <div>
      {openModal && (
        <Modal
          title="Supprimer mon compte ?"
          description={`Êtes-vous sûr de vouloir supprimer votre compte ?\nCette action est définitive.`}
          onConfirm={handleClickDelete}
          onClose={() => setOpenModal(false)}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      )}
      <ArrowBack />
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
                  {user?.lastName || "Ajouter votre nom"}{" "}
                  {user?.firstName || "et prénom"}
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
              <button className={s.button} onClick={handleClickUpdateDetails}>
                Modifier mes informations
              </button>
              <button
                onClick={() => setOpenModal(true)}
                className={s.buttonDelete}
              >
                Supprimer mon compte
              </button>
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.sectionTitle}>Mes dossiers</div>
          <FolderList />
        </section>
      </div>
    </div>
  );
}

export default UserSpaceComponent;
