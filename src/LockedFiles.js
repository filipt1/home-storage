import React, { useState } from "react";
import MyNav from "./MyNav";

function LockedFiles({ config }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const verifyPassword = async () => {
    const isValid = await window.api.verifyPassword(password);

    if (isValid) setAuthorized(true);
  };

  const unauthorizedScreen = () => (
    <div className="d-flex justify-content-center align-items-center flex-column mt-5">
      <h4>Enter password to browse and do operations on locked files.</h4>
      <label htmlFor="password" className="form-label w-50 mx-auto">
        Password
      </label>
      <input
        type="password"
        className="form-control mb-3 w-50 mx-auto"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary mb-3" onClick={() => verifyPassword()}>
        Submit
      </button>
    </div>
  );

  const authorizedScreen = () => (
    <div className="container bg-light">
      <ul className="list-group my-3">
        {!config.lockedFiles.length && (
          <li className="list-group-item">No files have been locked so far</li>
        )}
        {config.lockedFiles.map((el) => (
          <li
            className="list-group-item"
            key={el}
            onContextMenu={() => window.api.showLockedFileMenu(el)}
          >
            {el}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="container bg-light w-75 h-100">
      <MyNav active="locked-files" />
      {authorized ? authorizedScreen() : unauthorizedScreen()}
    </div>
  );
}

export default LockedFiles;
