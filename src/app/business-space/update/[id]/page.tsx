"use client";
import FormEditVehicle from "@/@features/Business/component/FormVehicle/FormEditVehicle";
import ProtectedRoute from "@/@utils/ProtectedRoute";
import { useParams } from "next/navigation";

function EditPage() {
  const params = useParams();
  const vehicleId = parseInt(params.id as string, 10);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <FormEditVehicle vehicleId={vehicleId} />
    </ProtectedRoute>
  );
}

export default EditPage;
