import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./landing-page/LandingPage";
import LoadingPage from "./utils/LoadingPage";

import RemoteExplorer from "./explorer/RemoteExplorer";
import Settings from "./settings/Settings";
import ArchivedFiles from "./archive/ArchivedFiles";
import ArchivedFile from "./archive/ArchivedFile";
import LockedFiles from "./locked-files/LockedFiles";

function App() {
  const [initApp, setInitApp] = useState(false);
  const [doSetup, setDoSetup] = useState(true);
  const [loading, setLoading] = useState(true);
  const [initConnection, setInitConnection] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
    async function start() {
      const res = await window.api.initializeApp();

      if (res) {
        setConfig(res);
        setDoSetup(false);
      }
      setLoading(false);
    }

    start();
  }, [initApp]);

  useEffect(() => {
    async function init() {
      const connected = await window.api.initializeConnection();
      if (connected) setInitConnection(false);
    }

    if (!initConnection) return;

    init();
  }, [initConnection]);

  const createConfig = async (config) => {
    if (!config.hostname || !config.username || !config.password) return;

    const res = await window.api.createConfig(config);
    if (res) setInitApp((prev) => !prev);
  };

  return (
    <div className="bg-light">
      <HashRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              !loading ? (
                <LandingPage
                  doSetup={doSetup}
                  config={config}
                  createConfig={createConfig}
                  initConnection={initConnection}
                  setInitConnection={setInitConnection}
                />
              ) : (
                <LoadingPage />
              )
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
          <Route
            exact
            path="/archived-files"
            element={<ArchivedFiles config={config} />}
          />

          <Route
            path="/archived-file/:id"
            element={<ArchivedFile config={config} />}
          />
          <Route
            path="/locked-files"
            element={<LockedFiles config={config} />}
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
