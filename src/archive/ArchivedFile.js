import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MyNav from "../utils/MyNav";

function ArchivedFile({ config }) {
  const { id } = useParams();

  const [versions, setVersions] = useState([]);

  useEffect(() => {
    async function getArchivedFile() {
      const res = await window.api.getArchivedFile(id);

      // sort podle data
      res.sort((a, b) => parseInt(b.split("-")[1]) - parseInt(a.split("-")[1]));

      setVersions(res);
    }

    getArchivedFile();
  }, [id]);

  const FILENAME = config.archivedFiles.find((el) => el.id === parseInt(id))
    .filename;

  return (
    <div className="container bg-light">
      <MyNav />
      <ul className="list-group my-3">
        {versions.map((file) => (
          <li
            className="list-group-item"
            key={file}
            onContextMenu={() =>
              window.api.showArchivedFileMenu(id, file.split("-")[1])
            }
          >
            <div>
              <div className="fw-bold">{FILENAME}</div>
              <div className="text-muted">
                {new Date(parseInt(file.split("-")[1])).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArchivedFile;
