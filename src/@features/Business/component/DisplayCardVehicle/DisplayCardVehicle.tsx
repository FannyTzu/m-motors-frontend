"use client";
import React, { useEffect, useState } from "react";
import CardVehicleBusiness from "../CardVehicleBusiness/CardVehicleBusiness";
import { getVehicles } from "@/@features/Business/service/vehicle.service";

interface Vehicle {
  id: number;
  image: string;
  status: string;
  brand: string;
  model: string;
  year: number;
  kms: number;
  energy: string;
  transmission: string;
  price: number;
}

function DisplayCardVehicle() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {vehicles.map((vehicle) => (
        <CardVehicleBusiness
          key={vehicle.id}
          image={vehicle.image || "/carpix.png"}
          status={vehicle.status}
          brand={vehicle.brand}
          model={vehicle.model}
          year={vehicle.year}
          km={vehicle.kms}
          energy={vehicle.energy}
          transmission={vehicle.transmission}
          price={vehicle.price}
        />
      ))}
    </div>
  );
}

export default DisplayCardVehicle;
