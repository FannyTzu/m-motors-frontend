"use client";
import React from "react";
import { useAuth } from "../Auth/hook/useAuth";

function UserSpaceComponent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div>back</div>
      <div>
        <h1>Mon espace personnel</h1>
        <p>Gérez vos informations personnelles et suivez vos dossiers.</p>
        <div>
          <div>
            <div>
              <div>Nom</div>
              <div>
                {user?.firstName || "Nom non disponible"}
                {user?.lastName || "Prénom non disponible"}
              </div>
            </div>
            <div>
              <div>Mail</div> <div>{user?.mail || "Mail non disponible"}</div>
            </div>
            <div>
              <div>Téléphone</div>
              <div>{user?.phone || "Téléphone non disponible"}</div>
            </div>
            <div>
              <div>Adresse</div>{" "}
              <div>{user?.address || "Adresse non disponible"}</div>
            </div>
          </div>
          <div>
            <button>Supprimer le compte</button>
            <button>Modifier mes informations</button>
          </div>
        </div>
      </div>
      <div>
        <h3>Mes demandes</h3>
        <div>
          <div>Nom du véhicule</div>
          <div>Date de dépôt du dossier</div>
        </div>
        <button>Voir mon dossier</button>
        <button>Payer (griser si dossier non validé)</button>
      </div>
    </div>
  );
}

export default UserSpaceComponent;
