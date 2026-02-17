"use client";
import ProtectedRoute from "@/@utils/ProtectedRoute";
import BusinessPageComponent from "@/@features/Business/component/BusinessPageComponent/BusinessPageComponent";

function BusinessPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <BusinessPageComponent />
    </ProtectedRoute>
  );
}

export default BusinessPage;
