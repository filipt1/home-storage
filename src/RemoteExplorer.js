import React, { useState, useEffect } from "react";
import FilesViewer from "./FilesViewer";

const pathModule = window.require("path");

const { ipcRenderer } = window.require("electron");

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
  const [files, setFiles] = useState([]);

  const handleClick = () => {
    console.log("clicked");
  };

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

  return (
    <div>
      <h1>RemoteExplorer</h1>
      {path}
      <button onClick={handleClick}>Click</button>
      <FilesViewer
        files={files}
        onOpen={onOpen}
        onBack={onBack}
        homeLocal={homeLocal}
        path={path}
      />
    </div>
  );
}

export default RemoteExplorer;
