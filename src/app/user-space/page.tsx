import UserSpaceComponent from "@/@features/UserSpace/component/UserSpaceComponent/UserSpaceComponent";
import ProtectedRoute from "@/@utils/ProtectedRoute";

function UserPage() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <UserSpaceComponent />
    </ProtectedRoute>
  );
}

export default UserPage;
