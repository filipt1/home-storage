import { IconFolder, IconFile, IconFolderOpen } from "./Icons";

import displayLocalContextMenu from "./menus/LocalContextMenu";
import displayRemoteContextMenu from "./menus/RemoteContextMenu";

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
            <tr
              className={file.directory ? "clickable" : ""}
              onClick={() => file.directory && onOpen(file.name)}
              key={file.name}
              onContextMenu={(e) =>
                homeRemote
                  ? displayLocalContextMenu(e, file, path, homeRemote)
                  : displayRemoteContextMenu(e, file, path, homeLocal)
              }
            >
              <td className="icon-row">
                {file.directory ? <IconFolder /> : <IconFile />}
              </td>
              <td>{file.name}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default FilesViewer;
