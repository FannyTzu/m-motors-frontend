import ProtectedRoute from "@/@utils/ProtectedRoute";

function UserPage() {
  return <ProtectedRoute allowedRoles={["user"]}>UserPage</ProtectedRoute>;
}

export default UserPage;
