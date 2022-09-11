import React, { useState } from "react";
import Draggable from "react-draggable";

import { IconFolder, IconFile } from "./Icons";
import { renamePath } from "./ipcController";

import displayLocalContextMenu from "./menus/LocalContextMenu";
import displayRemoteContextMenu from "./menus/RemoteContextMenu";

function DraggableFile({ file, homeLocal, homeRemote, path, onOpen }) {
  const [isDragging, setIsDragging] = useState(false);

  const onStart = (e) => {
    setIsDragging(true);
    file.directory && e.detail === 2 && onOpen(file.name);
  };

  const onStop = (e) => {
    if (e.target.classList.contains("draggable-dropzone")) {
      renamePath(path, file.name, e.target.id);
    }
    setIsDragging(false);
  };

  const onDropAreaMouseEnter = (e) => {
    if (isDragging) e.target.classList.add("hovered");
  };

  const onDropAreaMouseLeave = (e) => {
    e.target.classList.remove("hovered");
  };

  return (
    <Draggable onStart={onStart} onStop={onStop}>
      <div
        className={`${file.directory ? "clickable draggable-dropzone" : ""} ${
          isDragging ? "no-pointer-events" : ""
        }`}
        id={file.name}
        onContextMenu={(e) =>
          homeRemote
            ? displayLocalContextMenu(e, file, path, homeRemote)
            : displayRemoteContextMenu(e, file, path, homeLocal)
        }
      >
        {file.directory ? <IconFolder /> : <IconFile />}
        {file.name}
      </div>
    </Draggable>
  );
}

export default DraggableFile;
