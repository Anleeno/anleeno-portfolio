import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/h1.png";

import FindMe from "./FindMe";
import Type from "./Type";
import Type2 from "./Type2";

function Home() {
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <h2 style={{ paddingBottom: 15 }} className="heading">
                Hi! Welcome here!{" "}
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h2>

              <h1 className="heading-name">
                I'M
                <strong className="main-name"> Anleeno Xu </strong>
              </h1>

              <div style={{ paddingBottom: 20,paddingTop: 30, textAlign: "left" }}>
                <Type />
                <Type2 />
              </div>
              <div style={{ paddingBottom: 0,paddingTop: 20, textAlign: "center" }}>
                <FindMe />
              </div>
            </Col>
            <Col md={5} style={{ paddingBottom: 20 }}>
              <img
                src={homeLogo}
                alt="home pic"
                className="img-fluid"
                style={{ maxHeight: "900px" ,borderRadius:"6rem"}}
              />
            </Col>
          </Row>
        </Container>
      </Container>
    </section>
  );
}

export default Home;
