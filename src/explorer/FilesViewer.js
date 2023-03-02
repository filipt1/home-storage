import { IconFolderOpen } from "../utils/Icons";
import DraggableFile from "./DraggableFile";

function FilesViewer({ files, onBack, onOpen, path, setRefreshFiles }) {
  return (
    <ul className="list-group my-3 files-table z-0">
      <li
        className="clickable files-table__back-btn draggable-go-back list-group-item"
        onClick={onBack}
      >
        <IconFolderOpen />
        <span>...</span>
      </li>

      {files.map((file) => {
        return (
          <DraggableFile
            file={file}
            path={path}
            onOpen={onOpen}
            key={file.name}
            setRefreshFiles={setRefreshFiles}
          />
        );
      })}
    </ul>
  );
}

export default FilesViewer;
