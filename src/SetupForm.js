import React, { useState } from "react";

function SetupForm({ addresses, manualSetup, createConfig }) {
  const [config, setConfig] = useState({
    hostname: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getAddressInput = () => {
    return manualSetup ? (
      <input
        name="hostname"
        type="text"
        onChange={handleChange}
        value={config.hostname}
      />
    ) : (
      <select value={config.hostname} onChange={handleChange} name="hostname">
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
    <div className="landing-page__setup-form">
      <div className="setting__input">
        <label htmlFor="hostname">hostname</label>
        {getAddressInput()}
      </div>
      <div className="setting__input">
        <label htmlFor="username">username</label>
        <input
          name="username"
          type="text"
          onChange={handleChange}
          value={config.username}
        />
      </div>
      <div className="setting__input">
        <label htmlFor="password">password</label>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={config.password}
        />
      </div>
      <button onClick={() => createConfig(config)}>Submit</button>
    </div>
  );
}

export default SetupForm;
