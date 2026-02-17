import { useRouter } from "next/navigation";
import s from "./styles.module.css";
import { Plus } from "lucide-react";
import DisplayCardVehicle from "../DisplayCardVehicle/DisplayCardVehicle";

function VehicleCatalogComponent() {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/business-space/create");
  };

  return (
    <div>
      <button onClick={handleCreate} className={s.button}>
        <Plus size={18} /> Ajouter un véhicule
      </button>
      <DisplayCardVehicle />
    </div>
  );
}

export default VehicleCatalogComponent;
