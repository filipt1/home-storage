import React, { useEffect, useState } from "react";
import { Link, HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";

// import LocalExplorer from "./LocalExplorer";
import RemoteExplorer from "./RemoteExplorer";
import Settings from "./Settings";

// const { ipcRenderer } = window.require("electron");

function App() {
  const [homeLocal, setHomeLocal] = useState("");
  const [homeRemote, setHomeRemote] = useState("");

  useEffect(() => {
    async function start() {
      const res = await window.api.initializeConnection();
      setHomeLocal(res.homeLocal);
      setHomeRemote(res.homeRemote);
    }

    start();
  }, []);

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
          <Route exact path="/" element={<LandingPage />} />
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
