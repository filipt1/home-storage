import React, { useState } from "react";

function DirectoryInput({ createNewDir, setIsCreating }) {
  const [newDir, setNewDir] = useState("");

  return (
    <div className="remote-explorer__directory-input position-absolute w-50 bg-light h-25">
      <input
        value={newDir}
        onChange={(e) => setNewDir(e.target.value)}
        placeholder="New directory name"
        className="form-control w-75 mx-auto"
      />
      <div className="remote-explorer__directory-input__buttons d-flex justify-content-center">
        <i
          className="material-icons clickable"
          onClick={() => createNewDir(newDir)}
        >
          done
        </i>
        <i
          className="material-icons clickable"
          onClick={() => setIsCreating(false)}
        >
          clear
        </i>
      </div>
    </div>
  );
}

export default DirectoryInput;
