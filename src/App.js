import React, { useEffect, useState } from "react";
import { Link, HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";

import RemoteExplorer from "./RemoteExplorer";
import Settings from "./Settings";

function App() {
  // pridani initializeApp do dependency array useEffectu a na submit config v landingPage spustit initializeApp
  const [initApp, setInitApp] = useState(false);
  const [doSetup, setDoSetup] = useState(false);
  const [config, setConfig] = useState({});
  const [homeLocal, setHomeLocal] = useState("");
  const [homeRemote, setHomeRemote] = useState("");

  useEffect(() => {
    async function start() {
      const res1 = await window.api.initializeApp();
      let res2;

      if (res1) {
        res2 = await window.api.initializeConnection();
        setConfig(res1);
        setHomeLocal(res2.homeLocal);
        setHomeRemote(res2.homeRemote);
      } else {
        setDoSetup(true);
      }
    }

    start();
  }, [initApp]);

  const createConfig = (config) => {
    window.api.createConfig(config);
    setInitApp(true);
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
            <li>
              <Link to="/setup-test">SetupTest</Link>
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
            element={
              <RemoteExplorer homeLocal={homeLocal} homeRemote={homeRemote} />
            }
          />
          <Route
            exact
            path="/settings"
            element={<Settings homeLocal={homeLocal} homeRemote={homeRemote} />}
          />
          <Route exact path="/setup-test" element={<LandingPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
