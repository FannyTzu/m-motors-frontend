import UserSpaceComponent from "@/@features/UserSpace/UserSpaceComponent";
import ProtectedRoute from "@/@utils/ProtectedRoute";

function UserPage() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <UserSpaceComponent />
    </ProtectedRoute>
  );
}

export default UserPage;
