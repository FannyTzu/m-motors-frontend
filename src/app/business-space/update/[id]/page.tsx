"use client";
import FormEditVehicle from "@/@features/Business/component/FormVehicle/FormEditVehicle";
import { useParams } from "next/navigation";

function EditPage() {
  const params = useParams();
  const vehicleId = parseInt(params.id as string, 10);

  return (
    <div>
      <FormEditVehicle vehicleId={vehicleId} />
    </div>
  );
}

export default EditPage;
