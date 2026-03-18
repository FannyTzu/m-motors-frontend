import FolderToCompleteComponent from "@/@features/Folders/component/FolderToComplete/FolderToCompleteComponent";
import s from "./styles.module.css";
import ProtectedRoute from "@/@utils/ProtectedRoute";
interface FolderToCompletePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function FolderToCompletePage({ params }: FolderToCompletePageProps) {
  const { id } = await params;
  const folderId = Number(id);

  return (
    <div className={s.container}>
      <ProtectedRoute allowedRoles={["user"]}>
        <FolderToCompleteComponent folderId={folderId} />
      </ProtectedRoute>
    </div>
  );
}

export default FolderToCompletePage;
