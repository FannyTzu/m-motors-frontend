import FolderToCompleteComponent from "@/@features/Folders/component/FolderToCompleteComponent";
import s from "./styles.module.css";

function FolderToCompletePage() {
  return (
    <div className={s.page}>
      <FolderToCompleteComponent folderId={1} />
    </div>
  );
}

export default FolderToCompletePage;
