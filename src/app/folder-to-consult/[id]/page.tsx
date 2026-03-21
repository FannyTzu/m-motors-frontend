import ProtectedRoute from "@/@utils/ProtectedRoute";
import s from "./styles.module.css";
import FolderToConsultComponent from "@/@features/Folders/component/FolderToConsult/FolderToConsultComponent";

interface FolderToConsultPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function FolderToConsultPage({ params }: FolderToConsultPageProps) {
  const { id } = await params;
  const folderId = Number(id);

  return (
    <div className={s.container}>
      <ProtectedRoute allowedRoles={["admin"]}>
        <FolderToConsultComponent folderId={folderId} />
      </ProtectedRoute>
    </div>
  );
}

export default FolderToConsultPage;
