import React, { useEffect, useState } from "react";
import SetupForm from "./SetupForm";
import LoadingPage from "../utils/LoadingPage";
import MyNav from "../utils/MyNav";
import PasswordVerificationInput from "../utils/PasswordVerificationInput";
import LogoutButton from "../utils/LogoutButton";

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
      <h4 className="pt-5 text-center">Disclaimer</h4>
      <p className="text-center mb-5">
        In order to continue, you need to have a Unix-based server running
        either in your home network (then you can use Home Setup with address
        range 192.168.0.1 - 254, Home Setup will trigger scan of your network,
        this may take up to 2 minutes) or elsewhere (then use Manual Setup). You
        will be prompted to enter username and password
      </p>
      <div className="landing-page__setup d-flex justify-content-around mb-5">
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
    <div className="landing-page__success vh-100">
      {authorized && <MyNav />}

      {!authorized && (
        <div className="d-flex align-items-center flex-column justify-content-center vh-100">
          <PasswordVerificationInput
            setResult={setAuthorized}
            headingMsg={"Enter password for confirmation"}
          />
          <LogoutButton />
        </div>
      )}
    </div>
  );

  return loading ? (
    <LoadingPage />
  ) : (
    <div className="container landing-page">
      {doSetup ? setupScreen() : successScreen()}
    </div>
  );
}

export default LandingPage;
