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
  const [refreshFiles, setRefreshFiles] = useState(false);

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
      setRefreshFiles(false);
    });

    return () => {
      setFiles([]);
    };
  }, [path, refreshFiles]);

  const onOpen = (file) => {
    setPath(path + "/" + file);
  };

  const onBack = (e) => {
    if (e.detail === 2) setPath(pathModule.dirname(path));
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
      <span className="remote-explorer__directory-input">
        <input
          value={newDir}
          onChange={(e) => setNewDir(e.target.value)}
          placeholder="New directory name"
        />
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
    <main className="explorer">
      <h2 className="explorer__path">{path}</h2>
      <div className="explorer__action-bar">
        <span
          className="material-symbols-outlined clickable"
          onClick={uploadFileDialog}
        >
          upload_file
        </span>
        <span
          className="material-symbols-outlined clickable"
          onClick={uploadDirectoryDialog}
        >
          drive_folder_upload
        </span>
        <span
          className="material-symbols-outlined clickable"
          onClick={() => setIsCreating(true)}
        >
          create_new_folder
        </span>
        {isCreating ? createDirectoryInput() : ""}
      </div>

      <div className="explorer__file-search">
        <input
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className="explorer__file-search-input"
          placeholder="File search"
        />
      </div>

      <FilesViewer
        files={filteredFiles}
        onOpen={onOpen}
        onBack={onBack}
        homeLocal={homeLocal}
        path={path}
        setRefreshFiles={setRefreshFiles}
      />
    </main>
  );
}

export default RemoteExplorer;
