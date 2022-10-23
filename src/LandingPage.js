import React, { useState } from "react";
import SetupForm from "./SetupForm";

function LandingPage({ doSetup, config, createConfig }) {
  const [addresses, setAddresses] = useState([]);

  const handleDev = () => {
    console.log("dev");
  };

  const handleHomeSetup = async () => {
    const res = await window.api.runAutoSetup();
    res.unshift("");
    setAddresses(res);
  };

  const handleManualSetup = () => {
    console.log("manual setup");
  };

  const handleClick = () => {
    console.log("clicked");
  };

  const setupScreen = () => (
    <div className="landing-page__content-wrapper">
      <div className="landing-page__setup">
        <label>Run Home Setup</label>
        <button onClick={handleHomeSetup}>Home Setup</button>
      </div>
      <div className="landing-page__setup">
        <label>Run</label>
        <button onClick={handleClick}>TEST</button>
      </div>
      <div className="landing-page__setup">
        <label>Manual setup</label>
        <button onClick={handleManualSetup}>Manual setup</button>
      </div>
      {addresses.length ? (
        <SetupForm
          addresses={addresses}
          manualSetup={false}
          createConfig={createConfig}
        />
      ) : (
        ""
      )}
    </div>
  );

  const successScreen = () => (
    <div className="landing-page__content-wrapper">
      <h3>You've been successfully connected to {config.hostname}</h3>
      <h3>Home directory for your local machine is {config.homeLocal}</h3>
      <h3>Home directory for your cloud storage is {config.homeRemote}</h3>
      <h3>Change this anytime in the Setting section</h3>
    </div>
  );

  return (
    <main className="landing-page">
      <h2>LandingPage</h2>
      {doSetup ? setupScreen() : successScreen()}
    </main>
  );
}

export default LandingPage;
