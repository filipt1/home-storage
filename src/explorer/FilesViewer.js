import { IconFolderOpen } from "../utils/Icons";
import DraggableFile from "./DraggableFile";

function FilesViewer({ files, onBack, onOpen, path, setRefreshFiles }) {
  return (
    <div className="row mt-3 g-2">
      <div
        className="clickable files-table__back-btn draggable-go-back col-sm-4 col-md-3 col-lg-2"
        onClick={onBack}
      >
        <div className="card draggable-go-back p-3">
          <IconFolderOpen />
          <span className="draggable-go-back">...</span>
        </div>
      </div>

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
    </div>
  );
}

export default FilesViewer;
