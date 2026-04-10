"use client";
import s from "./styles.module.css";
import CartComponent from "@/@features/Cart/component/CartComponent/CartComponent";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";
import { useEffect, useState } from "react";
import { getFolderByIdRequest } from "@/@features/Folders/service/folder.service";
import ProtectedRoute from "@/@utils/ProtectedRoute";

interface Folder {
  id: number;
  user_id: number;
  vehicle_id: number;
  status: string;
  vehicle: {
    id: number;
    brand: string;
    model: string;
    type: string;
    price: number;
  };
}

interface CartPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CartPage({ params }: CartPageProps) {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFolder = async () => {
      try {
        const { id } = await params;
        const folderIdNum = Number(id);

        const data = await getFolderByIdRequest(folderIdNum);
        setFolder(data);
      } catch (err) {
        setError("Erreur lors de la récupération du dossier");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFolder();
  }, [params]);

  if (loading) return <div style={{ padding: "20px" }}>Chargement...</div>;
  if (error)
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  if (!folder) return <div style={{ padding: "20px" }}>Dossier non trouvé</div>;

  return (
    <div>
      <ArrowBack />
      <div className={s.container}>
        <ProtectedRoute allowedRoles={["user"]}>
          <CartComponent
            brand={folder.vehicle.brand}
            model={folder.vehicle.model}
            price={folder.vehicle.price}
            type={folder.vehicle.type === "sale" ? "sale" : "rent"}
            folderId={folder.id}
            vehicleId={folder.vehicle_id}
          />
        </ProtectedRoute>
      </div>
    </div>
  );
}
