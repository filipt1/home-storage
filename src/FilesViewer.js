import { IconFolder, IconFile, IconFolderOpen } from "./Icons";

import displayLocalContextMenu from "./menus/LocalContextMenu";
import displayRemoteContextMenu from "./menus/RemoteContextMenu";

function FilesViewer({ files, onBack, onOpen, homeRemote, homeLocal, path }) {
  return (
    <table className="table">
      <tbody>
        <tr className="clickable" onClick={onBack}>
          <td className="icon-row">
            <IconFolderOpen />
          </td>
          <td>...</td>
          <td></td>
          <td></td>
        </tr>

        {files.map((file) => {
          return (
            <tr
              className="clickable"
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
              <td>
                {homeRemote ? (
                  <i className="material-icons">file_upload</i>
                ) : (
                  <i className="material-icons">file_download</i>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default FilesViewer;
