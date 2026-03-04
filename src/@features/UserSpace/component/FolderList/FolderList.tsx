import { getFolderByUserIdRequest } from "@/@features/Folders/service/folder.service";
import React, { useEffect, useState } from "react";
import CardFolder from "../CardFolder/CardFolder";
import { useAuth } from "@/@features/Auth/hook/useAuth";
import s from "./styles.module.css";

type Vehicle = {
  id: number;
  brand: string;
  model: string;
};

type User = {
  id: number;
  mail: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

type FolderWithRelations = {
  id: number;
  user_id: number;
  vehicle_id: number;
  status: string;
  created_at: string;
  user: User;
  vehicle: Vehicle;
};

function FolderList() {
  const [folders, setFolders] = useState<FolderWithRelations[]>([]);

  const user = useAuth();

  useEffect(() => {
    const fetchFolders = async () => {
      if (user.user?.id !== undefined) {
        const foldersData: FolderWithRelations[] =
          await getFolderByUserIdRequest(user.user.id);
        setFolders(foldersData);
      }
    };
    fetchFolders();
  }, [user?.user?.id]);

  return (
    <div className={s.card}>
      {folders.map((folder) => (
        <CardFolder
          key={folder.id}
          folderId={folder.id}
          brand={folder.vehicle?.brand || "-"}
          model={folder.vehicle?.model || "-"}
          dateSubmitted={folder.created_at}
        />
      ))}
    </div>
  );
}

export default FolderList;
