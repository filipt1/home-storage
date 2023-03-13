import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { IconFile, IconFolder } from "../utils/Icons";

function DraggableFile({ file, path, onOpen, setRefreshFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef(null);

  const onStart = (e) => {
    setIsDragging(true);
    file.directory && e.detail === 2 && onOpen(file.name);
  };

  const onStop = (e, data) => {
    if (e.target.classList.contains("draggable-dropzone")) {
      window.api.moveFile(path, e.target.id, file.name, false);
      setRefreshFiles(true);
    } else if (e.target.classList.contains("draggable-go-back")) {
      window.api.moveFile(path, null, file.name, true);
      setRefreshFiles(true);
    } else {
      data.node.style.transform = "translate(0,0)";
      setIsDragging(false);
    }
  };

  const onDropAreaMouseEnter = (e) => {
    if (isDragging) e.target.classList.add("hovered");
    // console.log(e.target.classList);
    // console.log("entered");
  };

  const onDropAreaMouseLeave = (e) => {
    e.target.classList.remove("hovered");
  };

  const onContextMenu = async (e) => {
    const x = await window.api.showRemoteContextMenu(path, file);

    if (x) {
      setRefreshFiles(true);
    }
  };

  return (
    <Draggable onStart={onStart} onStop={onStop} nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className={`files-table__file-row ${
          file.directory ? "clickable draggable-dropzone" : ""
        } ${
          isDragging ? "no-pointer-events" : ""
        } col-sm-4 col-md-3 col-lg-2 overflow-auto`}
        id={file.name}
        onContextMenu={onContextMenu}
        onMouseEnter={onDropAreaMouseEnter}
        onMouseLeave={onDropAreaMouseLeave}
      >
        <div className="card draggable-dropzone p-3" id={file.name}>
          {file.directory ? <IconFolder /> : <IconFile />}
          {file.name}
        </div>
      </div>
    </Draggable>
  );
}

export default DraggableFile;
