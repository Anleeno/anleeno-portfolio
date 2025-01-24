import React from "react";
import { Col, Row } from "react-bootstrap";
import { CgCPlusPlus } from "react-icons/cg";
import {
  DiPython,
  DiGit,
  DiJava,
  DiAndroid,
} from "react-icons/di";
import {
  SiPytorch,
  SiTensorflow,
  SiDocker,
  SiApple
} from "react-icons/si";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={3} md={1} className="tech-icons">
        <DiPython />
      </Col>
      <Col xs={3} md={1} className="tech-icons">
        <DiJava />
      </Col>
      <Col xs={3} md={1} className="tech-icons">
        <CgCPlusPlus />
      </Col>
      <Col xs={3} md={1} className="tech-icons">
        <SiPytorch />
      </Col>
      <Col xs={3} md={1} className="tech-icons">
        <SiTensorflow />
      </Col>
      <Col xs={3} md={1} className="tech-icons">
        <SiDocker />
      </Col>
      <Col xs={3} md={1} className="tech-icons">
        <DiGit />
      </Col>
      <Col xs={3} md={1} className="tech-icons">
        <SiApple />
      </Col>
      <Col xs={3} md={1} className="tech-icons">
        <DiAndroid />
      </Col>
    </Row>
  );
}

export default Techstack;
