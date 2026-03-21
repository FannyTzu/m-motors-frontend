"use client";
import ProtectedRoute from "@/@utils/ProtectedRoute";
import BusinessPageComponent from "@/@features/Business/component/BusinessPageComponent/BusinessPageComponent";
import s from "./styles.module.css";

function BusinessPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className={s.container}>
        <BusinessPageComponent />
      </div>
    </ProtectedRoute>
  );
}

export default BusinessPage;
