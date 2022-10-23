import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import ReactLoading from "react-loading";

import LandingPage from "./LandingPage";
import LoadingPage from "./LoadingPage";
import Navbar from "./Navbar";

import RemoteExplorer from "./RemoteExplorer";
import Settings from "./Settings";

function App() {
  const [initApp, setInitApp] = useState(false);
  const [doSetup, setDoSetup] = useState(true);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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
        {!doSetup ? <Navbar /> : ""}

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
                />
              ) : (
                <ReactLoading type="spin" color="#FFF" />
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
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
