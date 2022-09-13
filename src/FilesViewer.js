import DraggableFile from "./DraggableFile";
import { IconFolderOpen } from "./Icons";

function FilesViewer({
  files,
  onBack,
  onOpen,
  homeRemote,
  homeLocal,
  path,
  setRefreshFiles,
}) {
  return (
    <div className="files-table">
      <span className="clickable files-table__back-btn" onClick={onBack}>
        <IconFolderOpen />
        ...
      </span>

      {files.map((file) => {
        return (
          <DraggableFile
            file={file}
            homeLocal={homeLocal}
            homeRemote={homeRemote}
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
