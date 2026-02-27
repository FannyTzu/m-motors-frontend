import FolderToCompleteComponent from "@/@features/Folders/component/FolderToCompleteComponent";

interface FolderToCompletePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function FolderToCompletePage({ params }: FolderToCompletePageProps) {
  const { id } = await params;
  const folderId = Number(id);

  return <FolderToCompleteComponent folderId={folderId} />;
}

export default FolderToCompletePage;
