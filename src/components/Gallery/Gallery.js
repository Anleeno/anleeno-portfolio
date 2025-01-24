import React from "react";
import Container from "react-bootstrap/Container";
import Slidebar from "./Sildebar";
import {Col, Row} from "react-bootstrap";
import Waterfall from "./waterfall";

function Gallery() {
    return (
        <section>
            <Container fluid className="gallery-section" id="home">
                <Container className="gallery-content">
                    <Row className="gallery-wrap">
                        <h1 >
                            My <strong className="art-color"> Free Spirit Jottings</strong>
                        </h1>
                        <Col md={12} className="gallery-column">
                            <Slidebar />
                        </Col>
                        <Col md={12} className="gallery-column">
                            <Waterfall />
                        </Col>
                    </Row>
                </Container>
            </Container>
        </section>
    );
}

export default Gallery;
