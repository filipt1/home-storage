import React, { useState } from "react";

function Settings() {
  const [hostname, setHostname] = useState("127.0.0.1");
  const [port, setPort] = useState("22");

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
              onChange={(e) => {
                setHostname(e.target.value);
              }}
              value={hostname}
            />
          </div>
          <div className="setting__input">
            <label htmlFor="port">Port</label>
            <input
              name="port"
              type="text"
              onChange={(e) => {
                setPort(e.target.value);
              }}
              value={port}
            />
          </div>
        </section>
        <section className="settings__directories">
          <h3>Home directories</h3>
        </section>
      </div>
    </main>
  );
}

export default Settings;
