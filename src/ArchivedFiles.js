import React from "react";
import ArchivedFileLink from "./ArchivedFileLink";
import MyNav from "./MyNav";

function ArchivedFiles({ config }) {
  console.log(window.location.href);
  return (
    <div className="container bg-light">
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
