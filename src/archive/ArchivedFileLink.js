import React from "react";
import { Link } from "react-router-dom";

function ArchivedFileLink({ file }) {
  return (
    <li
      className="list-group-item"
      onContextMenu={() => window.api.showArchiveMenu(file.id)}
    >
      <Link to={`/archived-file/${file.id}`}>{file.filename}</Link>
    </li>
  );
}

export default ArchivedFileLink;
