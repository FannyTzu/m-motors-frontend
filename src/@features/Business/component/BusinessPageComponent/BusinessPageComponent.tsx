import React, { useState } from "react";
import s from "./styles.module.css";
import VehicleCatalogComponent from "../VehicleCatalogComponent/VehicleCatalogComponent";

function BusinessPageComponent() {
  const [activeTab, setActiveTab] = useState<"vehicles" | "clients">(
    "vehicles"
  );
  return (
    <div>
      <div className={s.container}>
        <div className={s.containerTitle}>
          <h1 className={s.title}>Espace professionnel</h1>
          <h4 className={s.subtitle}>
            Gérez vos véhicules et les dossiers clients
          </h4>
          <div className={s.containerButton}>
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`${s.tabButton} ${activeTab === "vehicles" ? s.tabButtonActive : ""}`}
            >
              Véhicules
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`${s.tabButton} ${activeTab === "clients" ? s.tabButtonActive : ""}`}
            >
              Dossiers clients
            </button>
          </div>
        </div>
        <div>
          {activeTab === "vehicles" && (
            <div>
              <VehicleCatalogComponent />
            </div>
          )}
          {activeTab === "clients" && (
            <div>
              <h3>COMPOSANT Dossiers clients à mettre ici</h3>
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
}

export default BusinessPageComponent;
