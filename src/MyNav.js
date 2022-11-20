import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function MyNav({ active }) {
  return (
    // <Nav
    //   className="flex-column nav-pills"
    //   role="tablist"
    //   aria-orientation="vertical"
    // >
    // <Link to="/remote-explorer" className="nav-link">
    //   Remote explorer
    // </Link>
    // <Link to="/settings" className="nav-link">
    //   Settings
    // </Link>

    //   {/* <Nav.Link href="/remote-explorer">Remote Explorer</Nav.Link> */}
    //   {/* <Nav.Link href="/settings">Settings</Nav.Link> */}
    // </Nav>
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
