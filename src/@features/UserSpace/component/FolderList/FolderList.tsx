import { getFolderByUserIdRequest } from "@/@features/Folders/service/folder.service";
import React, { useEffect, useState } from "react";
import CardFolder from "../CardFolder/CardFolder";
import { useAuth } from "@/@features/Auth/hook/useAuth";
import { getVehicleById } from "@/@features/Vehicles/service/vehicle.service";
import s from "./styles.module.css";

type Folder = {
  id: number;
  user_id: number;
  vehicle_id: number;
  status: string;
  created_at: string;
};

type Vehicle = {
  id: number;
  brand: string;
  model: string;
};

type FolderWithVehicle = Folder & {
  vehicle?: Vehicle;
};

function FolderList() {
  const [folders, setFolders] = useState<FolderWithVehicle[]>([]);

  const user = useAuth();

  useEffect(() => {
    const fetchFoldersWithVehicles = async () => {
      if (user.user?.id !== undefined) {
        const foldersData: Folder[] = await getFolderByUserIdRequest(
          user.user.id
        );
        const foldersWithVehicles: FolderWithVehicle[] = await Promise.all(
          foldersData.map(async (folder) => {
            try {
              const vehicle: Vehicle = await getVehicleById(folder.vehicle_id);
              return { ...folder, vehicle };
            } catch {
              return { ...folder };
            }
          })
        );
        setFolders(foldersWithVehicles);
      }
    };
    fetchFoldersWithVehicles();
  }, [user?.user?.id]);

  return (
    <div className={s.card}>
      {folders.map((folder) => (
        <CardFolder
          key={folder.id}
          brand={folder.vehicle?.brand || "-"}
          model={folder.vehicle?.model || "-"}
          dateSubmitted={folder.created_at}
        />
      ))}
    </div>
  );
}

export default FolderList;
