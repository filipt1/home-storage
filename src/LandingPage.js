import React from "react";

function LandingPage() {
  const handleDev = () => {
    console.log("dev");
  };

  const handleHomeSetup = async () => {
    const res = await window.api.runAutoSetup();
    console.log(res);
  };

  const handleManualSetup = () => {
    console.log("manual setup");
  };

  return (
    <main className="landing-page">
      <h2>LandingPage</h2>
      <div className="landing-page__content-wrapper">
        <div className="landing-page__setup">
          <label>Run Dev Mode</label>
          <button onClick={handleDev}>IS_DEV</button>
        </div>
        <div className="landing-page__setup">
          <label>Run Home Setup</label>
          <button onClick={handleHomeSetup}>Home Setup</button>
        </div>
        <div className="landing-page__setup">
          <label>Manual setup</label>
          <button onClick={handleManualSetup}>Manual setup</button>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
