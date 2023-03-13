import React, { useState } from "react";

function SetupForm({ addresses, manualSetup, createConfig }) {
  const [config, setConfig] = useState({
    hostname: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setConfig((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const getAddressInput = () => {
    return manualSetup ? (
      <input
        type="text"
        className="form-control"
        id="hostname"
        value={config.hostname}
        onChange={handleChange}
      />
    ) : (
      <select
        value={config.hostname}
        onChange={handleChange}
        id="hostname"
        className="form-select"
      >
        {addresses.map((el) => {
          return (
            <option value={el} key={el}>
              {el}
            </option>
          );
        })}
      </select>
    );
  };

  return (
    <div className="landing-page__setup-form w-50 mx-auto">
      <div className="mb-3 setting__input">
        <label htmlFor="hostname" className="form-label">
          Hostname
        </label>

        {getAddressInput()}
      </div>
      <div className="mb-3 setting__input">
        <label htmlFor="username" className="form-label">
          Username
        </label>

        <input
          type="text"
          onChange={handleChange}
          value={config.username}
          className="form-control"
          id="username"
        />
      </div>
      <div className="mb-3 setting__input">
        <label htmlFor="password" className="form-label">
          Password
        </label>

        <input
          type="password"
          onChange={handleChange}
          value={config.password}
          className="form-control"
          id="password"
        />
      </div>
      <button
        className="btn btn-primary mb-3"
        onClick={() => createConfig(config)}
      >
        Submit
      </button>
    </div>
  );
}

export default SetupForm;
