import React from "react";

import ReactLoading from "react-loading";

function LoadingPage() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        backgroundColor: "#BDD5EA",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ReactLoading type="spin" color="#FFF" />
    </div>
  );
}

export default LoadingPage;
