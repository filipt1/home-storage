import React, { useEffect, useState } from "react";
import { Link, HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";

import RemoteExplorer from "./RemoteExplorer";
import Settings from "./Settings";

function App() {
  const [initApp, setInitApp] = useState(false);
  const [doSetup, setDoSetup] = useState(true);
  const [config, setConfig] = useState({});

  useEffect(() => {
    async function start() {
      const res = await window.api.initializeApp();
      let connected;

      if (res) {
        connected = await window.api.initializeConnection();
        if (connected) {
          setConfig(res);
          setDoSetup(false);
        }
      }
    }

    start();
  }, [initApp]);

  const createConfig = (config) => {
    window.api.createConfig(config);
    setInitApp((prev) => !prev);
  };

  return (
    <div className="main-container">
      <HashRouter>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/remote-explorer">Remote explorer</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            exact
            path="/"
            element={
              <LandingPage
                doSetup={doSetup}
                config={config}
                createConfig={createConfig}
              />
            }
          />
          <Route
            exact
            path="/remote-explorer"
            element={<RemoteExplorer config={config} />}
          />
          <Route
            exact
            path="/settings"
            element={<Settings cfg={config} createConfig={createConfig} />}
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
