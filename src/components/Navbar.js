import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import logo from "../Assets/Anleeno.svg";
import { Link } from "react-router-dom";
import {HiOutlineMusicNote, HiOutlineTag } from "react-icons/hi";
import {BiUser} from "react-icons/bi";
import {
  AiOutlineHome,
} from "react-icons/ai";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);

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
        <Navbar.Brand href="/" className="d-flex">
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
              <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/music"
                onClick={() => updateExpanded(false)}
              >
                <HiOutlineMusicNote style={{ marginBottom: "2px" }} /> Music
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                  as={Link}
                  to="/gallery"
                  onClick={() => updateExpanded(false)}
              >
                <HiOutlineTag style={{ marginBottom: "2px" }} /> Gallery
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
