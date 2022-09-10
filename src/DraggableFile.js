import React, { useState } from "react";
import Draggable from "react-draggable";

import { IconFolder, IconFile } from "./Icons";

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
      console.log(e);
      alert("Dropped!");
      e.target.classList.remove("hovered");
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
        key={file.name}
        onContextMenu={(e) =>
          homeRemote
            ? displayLocalContextMenu(e, file, path, homeRemote)
            : displayRemoteContextMenu(e, file, path, homeLocal)
        }
        onMouseEnter={onDropAreaMouseEnter}
        onMouseLeave={onDropAreaMouseLeave}
      >
        {file.directory ? <IconFolder /> : <IconFile />}
        {file.name}
      </div>
    </Draggable>
  );
}

export default DraggableFile;
