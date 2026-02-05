import { useRouter } from "next/navigation";
import React from "react";

function BusinessComponent() {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/business-space/create");
  };

  return (
    <div>
      <button onClick={handleCreate}>+ Ajouter un véhicule</button>
    </div>
  );
}

export default BusinessComponent;
