import FormCreateVehicle from "@/@features/Business/component/FormVehicle/FormCreateVehicle";
import ProtectedRoute from "@/@utils/ProtectedRoute";

function createPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <FormCreateVehicle />
    </ProtectedRoute>
  );
}

export default createPage;
