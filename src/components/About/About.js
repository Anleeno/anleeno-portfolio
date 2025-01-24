import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/pm2.png";
import Github from "./Github";

function About() {
  return (
    <Container fluid className="about-section">
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={6}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "40px",
            }}
          >
            <h1 style={{ fontSize: "3.2em", paddingBottom: "10px" ,color:"rgb(31,31,31)"}}>
              About <strong className="orange">Me</strong>
            </h1>
            <Aboutcard />
          </Col>
          <Col
            md={6}
            style={{paddingTop: "50px", paddingBottom: "40px"}}
            className="about-img"
          >
            <img src={laptopImg} alt="about" className="img-fluid" style={{
    borderRadius: "2em", 
    transform: "scale(0.8)",
    transformOrigin: "center"
  }} />
          </Col>
        </Row>
        <h1 className="project-heading">
          Professional <strong className="orange">Skillset </strong>
        </h1>
        <Techstack />
        <Github/>
      </Container>
    </Container>
  );
}

export default About;
