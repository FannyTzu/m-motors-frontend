"use client";
import CardVehicle from "@/@features/Vehicles/component/CardVehicle/CardVehicle";
import { getVehiclesByType } from "@/@features/Vehicles/service/vehicle.service";
import { useEffect, useState } from "react";
import s from "./styles.module.css";

interface Vehicle {
  id: number;
  image: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  energy: string;
  price: number;
}

function SalePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehiclesByType("sale");
        setVehicles(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
        console.error("Error fetching vehicles by type:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className={s.grid}>
      {vehicles.map((vehicle) => (
        <CardVehicle
          key={vehicle.id}
          id={vehicle.id}
          image={vehicle.image || "/carpix.png"}
          type={vehicle.type}
          brand={vehicle.brand}
          model={vehicle.model}
          year={vehicle.year}
          km={vehicle.km}
          energy={vehicle.energy}
          price={vehicle.price}
        />
      ))}
    </div>
  );
}

export default SalePage;
