import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/pm2.png";
import ResumePreview from "./ResumePreview";
import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";

function About() {
  const [showResume, setShowResume] = useState(false);

  const toggleResume = (event) => {
    const willCollapse = showResume;
    setShowResume((visible) => !visible);

    if (willCollapse) {
      event.currentTarget.blur();
    }
  };

  return (
      <Container fluid className="about-section">
        <Container>
          <section className="about-profile-layout" aria-label="About profile">
          <div className="about-profile-copy">
            <h1 className="about-hero-title">
              About <strong>Me</strong>
            </h1>
            <Aboutcard />
          </div>
          <figure className="about-profile-visual">
            <div className="about-image-shell">
              <span className="about-image-index">AN / CV</span>
              <img
                src={laptopImg}
                alt="about"
                className="img-fluid about-main-image"
              />
              <div className="about-image-caption">
                <span>Researcher / Builder</span>
                <strong>Vision Intelligence</strong>
              </div>
            </div>
          </figure>
          </section>
          <div className="about-resume-action">
            <a
              className="about-contact-mail"
              href="mailto:xushubo0805@gmail.com"
              aria-label="Contact me by email"
              title="Contact me by email"
            >
              <FiMail aria-hidden="true" />
            </a>
            <button
              className="about-resume-button"
              type="button"
              onClick={toggleResume}
              aria-expanded={showResume}
              aria-controls="about-resume-preview"
            >
              <span className="about-resume-icon" aria-hidden="true">PDF</span>
              <span>Preview Resume</span>
              <span className="about-resume-arrow" aria-hidden="true">
                {showResume ? <FiEyeOff /> : <FiEye />}
              </span>
            </button>
          </div>
          {showResume && (
            <ResumePreview id="about-resume-preview" />
          )}
        </Container>
      </Container>
  );
}

export default About;
