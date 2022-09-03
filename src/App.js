import React, { useEffect, useState } from "react";
import { Link, HashRouter, Routes, Route } from "react-router-dom";

import LocalExplorer from "./LocalExplorer";
import RemoteExplorer from "./RemoteExplorer";

const { ipcRenderer } = window.require("electron");

function App() {
  const [homeLocal, setHomeLocal] = useState("");
  const [homeRemote, setHomeRemote] = useState("");

  useEffect(() => {
    ipcRenderer.send("initialize-sftp");
    ipcRenderer.on("initialize-sftp-reply", (event, res) => {
      setHomeLocal(res.homeLocal);
      setHomeRemote(res.homeRemote);
    });
  }, []);

  return (
    <div className="main-container">
      <HashRouter>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/local-explorer">Local explorer</Link>
            </li>
            <li>
              <Link to="/remote-explorer">Remote explorer</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            exact
            path="/local-explorer"
            element={
              <LocalExplorer homeLocal={homeLocal} homeRemote={homeRemote} />
            }
          />
          <Route
            exact
            path="/remote-explorer"
            element={
              <RemoteExplorer homeLocal={homeLocal} homeRemote={homeRemote} />
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
