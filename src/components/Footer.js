import React from "react";
import { Container} from "react-bootstrap";
import { useLocation } from "react-router-dom";


function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  const location = useLocation();

  const footerThemeMap = {
    "/": "footer-theme-home",
    "/about": "footer-theme-about",
    "/gallery": "footer-theme-gallery",
    "/to-x": "footer-theme-tox",
    "/music": "footer-theme-music"
  };

  const footerTheme = footerThemeMap[location.pathname] || "footer-theme-home";

  return (
    <Container fluid className={`footer ${footerTheme}`}>
      <div className="footer-copyright">
        <h2>🍁 Let life be beautiful like summer flowers and death like autumn leaves.</h2>
          <h3>🌟 Copyright © Anleeno Xu {year} 🌟️</h3>
      </div>
    </Container>
  );
}

export default Footer;
