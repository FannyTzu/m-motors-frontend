import ContactDetailsComponent from "@/@features/UserSpace/component/FormContactDetails/FormContactDetails";
import ProtectedRoute from "@/@utils/ProtectedRoute";

function ContactDetailsPage() {
  return (
    <div>
      <ProtectedRoute allowedRoles={["user"]}>
        <ContactDetailsComponent />
      </ProtectedRoute>
    </div>
  );
}

export default ContactDetailsPage;
