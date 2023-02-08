import React, { useState } from "react";

function PasswordPrompt({ setPasswordPrompt, path, setPath, lockedFile }) {
  const [password, setPassword] = useState("");

  const verifyPassword = async () => {
    const isValid = await window.api.verifyPassword(password);

    if (isValid && setPath) setPath(`${path}/${lockedFile}`);
    if (isValid) setPasswordPrompt(false);
  };

  return (
    <div className="position-absolute w-50 bg-light h-25 z-3">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="form-control w-75 mx-auto"
      />
      <div className="d-flex justify-content-center">
        <i
          className="material-icons clickable"
          onClick={() => verifyPassword()}
        >
          done
        </i>
        <i
          className="material-icons clickable"
          onClick={() => setPasswordPrompt(false)}
        >
          clear
        </i>
      </div>
    </div>
  );
}

export default PasswordPrompt;
