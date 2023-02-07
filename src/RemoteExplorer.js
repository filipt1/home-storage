import React, { useState, useEffect } from "react";
import FilesViewer from "./FilesViewer";
import MyNav from "./MyNav";

function RemoteExplorer({ config }) {
  const [path, setPath] = useState(config.homeRemote);
  const [searchString, setSearchString] = useState("");
  const [files, setFiles] = useState([]);
  const [newDir, setNewDir] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [refreshFiles, setRefreshFiles] = useState(false);

  useEffect(() => {
    async function fetchFiles() {
      const res = await window.api.listFiles(path);

      const filesRaw = res.map((file) => {
        return { name: file.name, directory: file.type === "d" };
      });

      setFiles(filesRaw);
      setRefreshFiles(false);
    }

    fetchFiles();
  }, [path, refreshFiles]);

  const onOpen = (file) => {
    setPath(path + "/" + file);
  };

  const onBack = async (e) => {
    const dirnamePath = await window.api.pathModuleDirname(path);
    if (e.detail === 2) setPath(dirnamePath);
  };

  const uploadFileDialog = async () => {
    await window.api.showUploadFileDialog(path);
  };

  const uploadDirectoryDialog = async () => {
    await window.api.showUploadDirDialog(path);
  };

  const createDirectoryInput = () => {
    return (
      <div className="remote-explorer__directory-input">
        <input
          value={newDir}
          onChange={(e) => setNewDir(e.target.value)}
          placeholder="New directory name"
        />
        <span className="remote__explorer__directory-input__buttons">
          <i
            className="material-icons clickable"
            onClick={() => createNewDir()}
          >
            done
          </i>
          <i
            className="material-icons clickable"
            onClick={() => setIsCreating(false)}
          >
            clear
          </i>
        </span>
      </div>
    );
  };

  const createNewDir = () => {
    window.api.createDirectory(path, newDir);

    setRefreshFiles(true);
    setIsCreating(false);
  };

  const filteredFiles = files.filter((s) =>
    s.name.toLowerCase().includes(searchString.toLowerCase())
  );

  return (
    <div className="container bg-light explorer">
      <MyNav active="explorer" />
      {/* <main className="explorer"> */}
      <h3 className="explorer__path">{path}</h3>
      <div className="explorer__action-bar mx-auto w-25 d-flex justify-content-around py-2">
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

      <div className="explorer__file-search mx-auto w-50">
        <input
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className="explorer__file-search-input form-control"
          placeholder="File search"
        />
      </div>

      <FilesViewer
        files={filteredFiles}
        onOpen={onOpen}
        onBack={onBack}
        path={path}
        setRefreshFiles={setRefreshFiles}
      />
      {/* </main> */}
    </div>
  );
}

export default RemoteExplorer;
