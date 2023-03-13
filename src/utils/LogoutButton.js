import React from "react";

function LogoutButton() {
  const handleLogout = () => {
    window.api.logout();
  };

  return (
    <button
      className="btn btn-danger mx-auto d-block"
      onClick={() => handleLogout()}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
