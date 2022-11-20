import React, { useState } from "react";
import SetupForm from "./SetupForm";
import LoadingPage from "./LoadingPage";
import MyNav from "./MyNav";

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

  const setupScreen = () => (
    <div className="flex-column landing-page__content-wrapper">
      <h4 className="mt-5">Disclaimer</h4>
      <p className="text-center mb-5">
        In order to continue, you need to have a Unix-based server running
        either in your home network (then you can use Home Setup with address
        range 192.168.0.1-254) or elsewhere (then use Manual Setup). You will be
        prompted to enter username and password
      </p>
      <div className="landing-page__setup w-50 mx-auto d-flex justify-content-around align-self-center">
        <button className="btn btn-primary" onClick={handleHomeSetup}>
          Run Home Setup
        </button>
        <button className="btn btn-primary" onClick={handleManualSetup}>
          Run Manual Setup
        </button>
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
    </div>
  );

  const successScreen = () => (
    <div className="landing-page__success">
      <h3>You've been successfully connected to {config.hostname}</h3>
      <h3>Home directory for your local machine is {config.homeLocal}</h3>
      <h3>Home directory for your cloud storage is {config.homeRemote}</h3>
      <h3>Change this anytime in the Setting section</h3>
    </div>
  );

  return (
    <div className="container landing-page">
      {!doSetup ? <MyNav /> : ""}
      <h3 className="pt-3">Home Cloud Storage</h3>
      {doSetup ? setupScreen() : successScreen()}
      {loading ? <LoadingPage /> : ""}
    </div>
  );
}

export default LandingPage;
