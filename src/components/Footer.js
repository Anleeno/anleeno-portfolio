import React from "react";
import { Container} from "react-bootstrap";


function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <Container fluid className="footer">
      <div className="footer-copyright">
        <h2>🍁 Let life be beautiful like summer flowers and death like autumn leaves.</h2>
          <h3>🌟 Copyright © Anleeno Xu {year} 🌟️</h3>
      </div>
    </Container>
  );
}

export default Footer;
