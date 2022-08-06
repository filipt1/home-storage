import React, { useState, useEffect } from "react";
import FilesViewer from "./FilesViewer";
import { createDirectory, uploadDirectory, uploadFile } from "./ipcController";

const pathModule = window.require("path");

const { ipcRenderer } = window.require("electron");
const { dialog, app } = window.require("@electron/remote");

const formatSize = (size) => {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
};

function RemoteExplorer({ homeLocal, homeRemote }) {
  const [path, setPath] = useState(homeRemote);
  const [searchString, setSearchString] = useState("");
  const [files, setFiles] = useState([]);
  const [newDir, setNewDir] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    ipcRenderer.send("list-files", path);
    ipcRenderer.on("list-files-reply", (event, res) => {
      const filesRaw = res.map((file) => {
        return {
          name: file.name,
          directory: file.type === "d",
        };
      });

      setFiles(filesRaw);
    });

    return () => {
      setFiles([]);
    };
  }, [path]);

  const onOpen = (file) => {
    setPath(path + "/" + file);
  };

  const onBack = () => {
    setPath(pathModule.dirname(path));
  };

  const uploadFileDialog = () => {
    dialog
      .showOpenDialog({
        defaultPath: app.getPath("documents"),
        properties: ["openFile"],
      })
      .then((res) => {
        for (const file of res.filePaths) {
          uploadFile(pathModule.basename(file), pathModule.dirname(file), path);
        }
      });
  };

  const uploadDirectoryDialog = () => {
    dialog
      .showOpenDialog({
        defaultPath: app.getPath("documents"),
        properties: ["openDirectory"],
      })
      .then((res) => {
        for (const file of res.filePaths) {
          uploadDirectory(
            pathModule.basename(file),
            pathModule.dirname(file),
            path
          );
        }
      });
  };

  const createDirectoryInput = () => {
    return (
      <span>
        <input value={newDir} onChange={(e) => setNewDir(e.target.value)} />
        <i className="material-icons clickable" onClick={() => createNewDir()}>
          done
        </i>
        <i
          className="material-icons clickable"
          onClick={() => setIsCreating(false)}
        >
          clear
        </i>
      </span>
    );
  };

  const createNewDir = () => {
    createDirectory(pathModule.join(path, newDir));
    setIsCreating(false);
  };

  const filteredFiles = files.filter((s) => s.name.includes(searchString));

  return (
    <div>
      <button onClick={uploadFileDialog}>Upload File</button>
      <button onClick={uploadDirectoryDialog}>Upload Directory</button>
      <button onClick={() => setIsCreating(true)} disabled={isCreating}>
        Create Directory
      </button>
      {isCreating ? createDirectoryInput() : ""}
      <h4>{path}</h4>
      <input
        value={searchString}
        onChange={(event) => setSearchString(event.target.value)}
        className="form-control form-control-sm"
        placeholder="File search"
      />
      <FilesViewer
        files={filteredFiles}
        onOpen={onOpen}
        onBack={onBack}
        homeLocal={homeLocal}
        path={path}
      />
    </div>
  );
}

export default RemoteExplorer;
