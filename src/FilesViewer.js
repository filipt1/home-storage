import DraggableFile from "./DraggableFile";
import { IconFolderOpen } from "./Icons";

function FilesViewer({ files, onBack, onOpen, path, setRefreshFiles }) {
  return (
    <ul className="list-group my-3 files-table">
      <li
        className="clickable files-table__back-btn draggable-go-back list-group-item"
        onClick={onBack}
      >
        <span className="material-symbols-outlined inline-icon-m">
          folder_open
        </span>
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
    // <div className="files-table">
    // <span
    //   className="clickable files-table__back-btn draggable-go-back"
    //   onClick={onBack}
    // >
    //   <IconFolderOpen />
    //   ...
    // </span>

    // {files.map((file) => {
    //   return (
    //     <DraggableFile
    //       file={file}
    //       path={path}
    //       onOpen={onOpen}
    //       key={file.name}
    //       setRefreshFiles={setRefreshFiles}
    //     />
    //   );
    // })}
    // </div>
  );
}

export default FilesViewer;
