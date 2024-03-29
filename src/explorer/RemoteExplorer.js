import React, { useState, useEffect } from "react";
import DirectoryInput from "../utils/DirectoryInput";

import FilesViewer from "./FilesViewer";
import MyNav from "../utils/MyNav";
import PasswordPrompt from "../utils/PasswordPrompt";

function RemoteExplorer({ config }) {
  const [path, setPath] = useState(config.homeRemote);
  const [searchString, setSearchString] = useState("");
  const [files, setFiles] = useState([]);

  const [isCreating, setIsCreating] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [lockedFile, setLockedFile] = useState("");
  const [refreshFiles, setRefreshFiles] = useState(false);

  useEffect(() => {
    async function fetchFiles() {
      const res = await window.api.listFiles(path);

      if (!res) return;

      const filesRaw = res.map((file) => ({
        name: file.name,
        directory: file.type === "d",
        size: file.size,
        modifyTime: file.modifyTime,
      }));

      setFiles(filesRaw);
      setRefreshFiles(false);
    }

    fetchFiles();
  }, [path, refreshFiles]);

  const onOpen = async (file) => {
    if (await window.api.isLocked(path, file)) {
      setLockedFile(file);
      setPasswordPrompt(true);
      return;
    }

    setPath(`${path}/${file}`);
  };

  const onBack = async (e) => {
    const dirnamePath = await window.api.pathModuleDirname(path);
    if (e.detail === 2) setPath(dirnamePath);
  };

  const uploadFileDialog = async () => {
    const res = await window.api.showUploadFileDialog(path);
    if (res) setRefreshFiles(true);
  };

  const uploadDirectoryDialog = async () => {
    const res = await window.api.showUploadDirDialog(path);
    if (res) setRefreshFiles(true);
  };

  const createNewDir = (newDir) => {
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
          title="Upload a file"
        >
          upload_file
        </span>
        <span
          className="material-symbols-outlined clickable"
          onClick={uploadDirectoryDialog}
          title="Upload a folder"
        >
          drive_folder_upload
        </span>
        <span
          className="material-symbols-outlined clickable"
          onClick={() => setIsCreating(true)}
          title="Create a new folder"
        >
          create_new_folder
        </span>
        {isCreating ? (
          <DirectoryInput
            setIsCreating={setIsCreating}
            createNewDir={createNewDir}
          />
        ) : (
          ""
        )}
        {passwordPrompt ? (
          <PasswordPrompt
            setPasswordPrompt={setPasswordPrompt}
            lockedFile={lockedFile}
            path={path}
            setPath={setPath}
          />
        ) : (
          ""
        )}
      </div>

      <div className="explorer__file-search mx-auto w-50">
        <input
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className="explorer__file-search-input form-control"
          placeholder="File search"
        />
      </div>

      <div className="container px-2">
        <FilesViewer
          files={filteredFiles}
          onOpen={onOpen}
          onBack={onBack}
          path={path}
          setRefreshFiles={setRefreshFiles}
        />
      </div>
      {/* </main> */}
    </div>
  );
}

export default RemoteExplorer;
