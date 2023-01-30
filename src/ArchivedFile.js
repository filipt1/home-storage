import React from "react";
import { useParams } from "react-router-dom";

function ArchivedFile() {
  const { id } = useParams();

  return (
    <div className="container bg-light">
      {id}
      <h1>asd</h1>
    </div>
  );
}

export default ArchivedFile;
