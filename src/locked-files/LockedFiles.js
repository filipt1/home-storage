import React, { useState } from "react";
import MyNav from "../utils/MyNav";
import PasswordVerificationInput from "../utils/PasswordVerificationInput";

function LockedFiles({ config }) {
  const [authorized, setAuthorized] = useState(false);

  const unauthorizedScreen = () => (
    <PasswordVerificationInput
      setResult={setAuthorized}
      headingMsg={
        "Enter password to browse and perform operations on locked files."
      }
    />
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
