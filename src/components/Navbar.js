import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import logo from "../Assets/Anleeno.svg";
import { Link } from "react-router-dom";
import {BiUser} from "react-icons/bi";
import { IoBonfireOutline } from "react-icons/io5";
import { TbSparkles } from "react-icons/tb";
import {
  AiOutlineHome,
} from "react-icons/ai";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const legacyPagesPath = "/anleeno-portfolio";
  const isLegacyProjectPage = window.location.hostname.toLowerCase() === "anleeno.github.io"
    && (window.location.pathname === legacyPagesPath
      || window.location.pathname.startsWith(`${legacyPagesPath}/`));
  const homeHref = isLegacyProjectPage ? `${legacyPagesPath}/` : "/";

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Container>
        <Navbar.Brand href={homeHref} className="d-flex">
          <img src={logo} className="img-fluid logo" alt="brand" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link href={homeHref} onClick={() => updateExpanded(false)}>
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                  as={Link}
                  to="/to-x"
                  onClick={() => updateExpanded(false)}
              >
                <TbSparkles style={{ marginBottom: "2px" }} /> To.X
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                  as={Link}
                  to="/gallery"
                  onClick={() => updateExpanded(false)}
              >
                <IoBonfireOutline style={{ marginBottom: "2px" }} /> Portfolio
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                  as={Link}
                  to="/about"
                  onClick={() => updateExpanded(false)}
              >
                <BiUser style={{ marginBottom: "2px" }} /> About
              </Nav.Link>
            </Nav.Item>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
