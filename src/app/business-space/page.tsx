"use client";
import { useState } from "react";

function BusinessPage() {
  const [activeTab, setActiveTab] = useState<"vehicles" | "clients">(
    "vehicles"
  );

  return (
    <div>
      <h1>Espace professionnel</h1>
      <h4>Gérez vos véhicules et les dossiers clients</h4>

      <button onClick={() => setActiveTab("vehicles")}>VEHICULES</button>
      <button onClick={() => setActiveTab("clients")}>Dossiers clients</button>

      <div>
        {activeTab === "vehicles" && (
          <div>
            <h3>COMPOSANT VEHICULES à mettre ici</h3>
          </div>
        )}
        {activeTab === "clients" && (
          <div>
            <h3>COMPOSANT Dossiers clients à mettre ici</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessPage;
