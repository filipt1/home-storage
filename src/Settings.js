import React, { useState } from "react";

function Settings({ cfg, createConfig }) {
  const [config, setConfig] = useState(cfg);

  const handleChange = (e) => {
    setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="settings">
      <div className="settings__content-wrapper">
        <h2 className="settings__main-heading">Settings</h2>
        <section className="settings__connection">
          <h3>Connection</h3>
          <div className="setting__input">
            <label htmlFor="hostname">Hostname</label>
            <input
              name="hostname"
              type="text"
              onChange={handleChange}
              value={config.hostname}
            />
          </div>
          <div className="setting__input">
            <label htmlFor="port">Username</label>
            <input
              name="username"
              type="text"
              onChange={handleChange}
              value={config.username}
            />
          </div>
          <div className="setting__input">
            <label htmlFor="port">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              value={config.password}
            />
          </div>
        </section>
        <section className="settings__directories">
          <h3>Home directories</h3>
          <div className="setting__input">
            <label htmlFor="port">homeLocal</label>
            <input
              name="homeLocal"
              type="text"
              onChange={handleChange}
              value={config.homeLocal}
            />
          </div>
          <div className="setting__input">
            <label htmlFor="port">homeRemote</label>
            <input
              name="homeRemote"
              type="text"
              onChange={handleChange}
              value={config.homeRemote}
            />
          </div>
        </section>

        <button onClick={() => createConfig(config)}>Submit</button>
      </div>
    </main>
  );
}

export default Settings;
