import { useRouter } from "next/navigation";
import s from "./styles.module.css";
import React from "react";
import { Plus } from "lucide-react";

function BusinessComponent() {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/business-space/create");
  };

  return (
    <div>
      <button onClick={handleCreate} className={s.button}>
        <Plus size={18} /> Ajouter un véhicule
      </button>
    </div>
  );
}

export default BusinessComponent;
