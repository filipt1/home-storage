import React, { useState } from "react";
import SetupForm from "./SetupForm";
import LoadingPage from "./LoadingPage";
import ReactLoading from "react-loading";

function LandingPage({ doSetup, config, createConfig }) {
  const [addresses, setAddresses] = useState([]);
  const [manual, setManual] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleHomeSetup = async () => {
    setLoading(true);
    if (manual) setManual(false);
    const res = await window.api.runAutoSetup();
    res.unshift("");
    setAddresses(res);
    setLoading(false);
  };

  const handleManualSetup = () => {
    setManual((prev) => !prev);
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
      {manual || addresses.length ? (
        <SetupForm
          addresses={addresses}
          manualSetup={manual}
          createConfig={createConfig}
        />
      ) : (
        ""
      )}
      {loading ? <ReactLoading type="spin" color="#FFF" /> : "not loading"}
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
