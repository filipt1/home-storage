import React from "react";
import { Link } from "react-router-dom";

function MyNav({ active }) {
  return (
    <nav className="nav nav-pills nav-justified sticky-top pt-3 pb-3 bg-light">
      <Link
        to="/remote-explorer"
        className={
          "nav-link nav-item" + (active === "explorer" ? " active" : "")
        }
      >
        Remote explorer
      </Link>
      <Link
        to="/archived-files"
        className={
          "nav-link nav-item" + (active === "archived-files" ? " active" : "")
        }
      >
        Archived Files
      </Link>
      <Link
        to="/locked-files"
        className={
          "nav-link nav-item" + (active === "locked-files" ? " active" : "")
        }
      >
        Locked Files
      </Link>
      <Link
        to="/settings"
        className={
          "nav-link nav-item" + (active === "settings" ? " active" : "")
        }
      >
        Settings
      </Link>
    </nav>
  );
}

export default MyNav;
