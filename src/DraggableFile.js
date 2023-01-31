import React, { useState, useRef } from "react";
import Draggable from "react-draggable";

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

  return (
    <Draggable onStart={onStart} onStop={onStop} nodeRef={nodeRef}>
      <li
        ref={nodeRef}
        className={`files-table__file-row ${
          file.directory ? "clickable draggable-dropzone" : ""
        } ${isDragging ? "no-pointer-events" : ""} list-group-item `}
        id={file.name}
        onContextMenu={() => window.api.showRemoteContextMenu(path, file)}
        onMouseEnter={onDropAreaMouseEnter}
        onMouseLeave={onDropAreaMouseLeave}
      >
        {file.directory ? (
          <span className="material-symbols-outlined inline-icon-m">
            folder
          </span>
        ) : (
          <span className="material-symbols-outlined inline-icon-m">draft</span>
        )}
        <span>{file.name}</span>
      </li>
    </Draggable>
  );
}

export default DraggableFile;
