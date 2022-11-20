import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function MyNav() {
  return (
    // <Nav className="sidebar w-25">
    //   <Container className="sidebar-sticky">
    //     <Link to="/remote-explorer" className="nav-link">
    //       Remote explorer
    //     </Link>
    //     <Link to="/settings" className="nav-link">
    //       Settings
    //     </Link>

    //     {/* <Nav.Link href="/remote-explorer">Remote Explorer</Nav.Link> */}
    //     {/* <Nav.Link href="/settings">Settings</Nav.Link> */}
    //   </Container>
    // </Nav>
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/remote-explorer">Remote explorer</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
}

export default MyNav;
