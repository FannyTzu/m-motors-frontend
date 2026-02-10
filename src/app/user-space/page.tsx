import ProtectedRoute from "@/@lib/ProtectedRoute";

function UserPage() {
  return <ProtectedRoute allowedRoles={["user"]}>UserPage</ProtectedRoute>;
}

export default UserPage;
