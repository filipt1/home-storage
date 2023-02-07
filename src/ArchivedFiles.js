import React from "react";
import ArchivedFileLink from "./ArchivedFileLink";
import MyNav from "./MyNav";

function ArchivedFiles({ config }) {
  return (
    <div className="container bg-light w-75">
      <MyNav active="archived-files" />
      <ul className="list-group my-3">
        {config.archivedFiles.map((file) => (
          <ArchivedFileLink key={file.id} file={file} />
        ))}
      </ul>
    </div>
  );
}

export default ArchivedFiles;
