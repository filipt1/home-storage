import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./LandingPage";
import LoadingPage from "./LoadingPage";

import RemoteExplorer from "./RemoteExplorer";
import Settings from "./Settings";
import ArchivedFiles from "./ArchivedFiles";
import ArchivedFile from "./ArchivedFile";
import LockedFiles from "./LockedFiles";

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
