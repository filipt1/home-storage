import React, { useState } from "react";

function PasswordVerificationInput({ setResult, headingMsg }) {
  const [password, setPassword] = useState("");

  const verifyPassword = async () => {
    const isValid = await window.api.verifyPassword(password);

    if (isValid) setResult(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") verifyPassword();
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column pt-3">
      <h4>{headingMsg}</h4>
      <label htmlFor="password" className="form-label w-50 mx-auto">
        Password
      </label>
      <input
        type="password"
        className="form-control mb-3 w-50 mx-auto"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="btn btn-primary mb-3" onClick={() => verifyPassword()}>
        Submit
      </button>
    </div>
  );
}

export default PasswordVerificationInput;
