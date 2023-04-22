import React, { useState } from "react";
import LogoutButton from "../utils/LogoutButton";
import MyNav from "../utils/MyNav";

function Settings({ cfg, createConfig }) {
  const [config, setConfig] = useState(cfg);

  const handleChange = (e) => {
    setConfig((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createConfig(config);
  };

  return (
    <div className="container bg-light">
      <MyNav active="settings" />
      <form
        className="settings__content-wrapper d-sm-flex justify-content-around"
        onSubmit={handleSubmit}
      >
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
          <button
            className="btn btn-primary mb-3 mx-auto d-block"
            type="submit"
          >
            Submit
          </button>
          <LogoutButton />
        </section>
      </form>
    </div>
  );
}

export default Settings;
