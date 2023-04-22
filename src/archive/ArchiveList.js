import React from "react";
import ArchivedFileLink from "./ArchivedFileLink";

function ArchiveList({ config }) {
  return (
    <ul className="list-group my-3">
      {config.archivedFiles.length ? (
        config.archivedFiles.map((file) => (
          <ArchivedFileLink key={file.id} file={file} />
        ))
      ) : (
        <li className="list-group-item">No files have been archived so far</li>
      )}
    </ul>
  );
}

export default ArchiveList;
