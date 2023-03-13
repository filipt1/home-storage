import React, { useState } from "react";
import LogoutButton from "../utils/LogoutButton";
import MyNav from "../utils/MyNav";

function Settings({ cfg, createConfig }) {
  const [config, setConfig] = useState(cfg);

  const handleChange = (e) => {
    setConfig((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="container bg-light">
      <MyNav active="settings" />
      <div className="settings__content-wrapper d-sm-flex justify-content-around">
        <section className="settings__connection">
          <h3>Connection</h3>
          <div className="mb-3 setting__input">
            <label htmlFor="hostname" className="form-label">
              Hostname
            </label>
            <input
              type="text"
              className="form-control"
              id="hostname"
              value={config.hostname}
              onChange={handleChange}
            />
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
        </section>
        <section className="settings__directories">
          <h3>Home directories</h3>
          <div className="mb-3 setting__input">
            <label htmlFor="homeLocal" className="form-label">
              Local Home Directory
            </label>

            <input
              type="text"
              onChange={handleChange}
              value={config.homeLocal}
              className="form-control"
              id="homeLocal"
            />
          </div>
          <div className="mb-3 setting__input">
            <label htmlFor="homeRemote" className="form-label">
              Remote Home Directory
            </label>

            <input
              type="text"
              onChange={handleChange}
              value={config.homeRemote}
              className="form-control"
              id="homeRemote"
            />
          </div>
        </section>
      </div>
      <button
        className="btn btn-primary mb-3 mx-auto d-block"
        onClick={() => createConfig(config)}
      >
        Submit
      </button>
      <LogoutButton />
    </div>
  );
}

export default Settings;
