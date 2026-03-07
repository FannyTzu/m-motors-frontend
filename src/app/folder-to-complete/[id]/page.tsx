import FolderToCompleteComponent from "@/@features/Folders/component/FolderToComplete/FolderToCompleteComponent";
import s from "./styles.module.css";
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
      <FolderToCompleteComponent folderId={folderId} />
    </div>
  );
}

export default FolderToCompletePage;
