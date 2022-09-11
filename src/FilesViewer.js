import DraggableFile from "./DraggableFile";
import { IconFolderOpen } from "./Icons";

function FilesViewer({ files, onBack, onOpen, homeRemote, homeLocal, path }) {
  return (
    <table className="files-table">
      <tbody>
        <tr className="clickable files-table__back-btn" onClick={onBack}>
          <td className="icon-row">
            <IconFolderOpen />
          </td>
          <td>...</td>
        </tr>

        {files.map((file) => {
          return (
            <DraggableFile
              file={file}
              homeLocal={homeLocal}
              homeRemote={homeRemote}
              path={path}
              onOpen={onOpen}
              key={file.name}
            />
          );
        })}
      </tbody>
    </table>
  );
}

export default FilesViewer;
