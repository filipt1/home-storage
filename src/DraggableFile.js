import React, { useState, useRef } from "react";
import Draggable from "react-draggable";

import { IconFolder, IconFile } from "./Icons";
import { renamePath } from "./ipcController";

import displayLocalContextMenu from "./menus/LocalContextMenu";
import displayRemoteContextMenu from "./menus/RemoteContextMenu";

function DraggableFile({
  file,
  homeLocal,
  homeRemote,
  path,
  onOpen,
  setRefreshFiles,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef(null);

  // hrani si s data properties pro resetovani default pozice
  const onStart = (e) => {
    setIsDragging(true);
    file.directory && e.detail === 2 && onOpen(file.name);
  };

  const onStop = (e, data) => {
    if (e.target.classList.contains("draggable-dropzone")) {
      renamePath(path, file.name, e.target.id);
      setRefreshFiles(true);
    } else {
      data.node.style.transform = "translate(0,0)";
      setIsDragging(false);
    }
  };

  const onDropAreaMouseEnter = (e) => {
    if (isDragging) e.target.classList.add("hovered");
  };

  const onDropAreaMouseLeave = (e) => {
    e.target.classList.remove("hovered");
  };

  return (
    <Draggable onStart={onStart} onStop={onStop} nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className={`files-table__file-row ${
          file.directory ? "clickable draggable-dropzone" : ""
        } ${isDragging ? "no-pointer-events" : ""}`}
        id={file.name}
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
