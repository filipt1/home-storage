import React, { useEffect, useState } from "react";
import SetupForm from "./SetupForm";
import LoadingPage from "./LoadingPage";
import MyNav from "./MyNav";
import PasswordVerificationInput from "./PasswordVerificationInput";

function LandingPage({ doSetup, createConfig, setInitConnection }) {
  const [addresses, setAddresses] = useState([]);
  const [manual, setManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authorized && setInitConnection(true);
  }, [authorized, setInitConnection]);

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
      <h4 className="pt-5">Disclaimer</h4>
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
      {authorized && <MyNav />}
      {!authorized && (
        <PasswordVerificationInput
          setResult={setAuthorized}
          headingMsg={"Enter password for confirmation"}
        />
      )}
    </div>
  );

  return (
    <div className="container landing-page w-75">
      {doSetup ? setupScreen() : successScreen()}
      {loading ? <LoadingPage /> : ""}
    </div>
  );
}

export default LandingPage;
