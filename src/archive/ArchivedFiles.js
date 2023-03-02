import React from "react";
import ArchivedFileLink from "./ArchivedFileLink";
import MyNav from "../utils/MyNav";

function ArchivedFiles({ config }) {
  return (
    <div className="container bg-light w-75">
      <MyNav active="archived-files" />
      <ul className="list-group my-3">
        {config.archivedFiles.length ? (
          config.archivedFiles.map((file) => (
            <ArchivedFileLink key={file.id} file={file} />
          ))
        ) : (
          <li className="list-group-item">
            No files have been archived so far
          </li>
        )}
      </ul>
    </div>
  );
}

export default ArchivedFiles;
