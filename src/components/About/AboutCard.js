import React from "react";
import { TbAtom, TbBriefcase2 } from "react-icons/tb";

const profileLines = [
  {
    icon: <TbAtom />,
    text: (
      <span className="about-bio-interest-copy">
        Interests:{" "}
        <strong>CV, AIGC, MLLM, and AI4Science.</strong>
      </span>
    )
  }
];

const experience = [
  <><strong>ByteDance</strong><span>Senior Algorithm Engineer · MLLM & CV · 2026 ~ Present</span></>,
  <><strong>Baidu</strong><span>Senior Algorithm Engineer · MLLM & CV · 2025 ~ 2026</span></>,
  <><strong>Hello</strong><span>Algorithm Engineer · CV · 2023 ~ 2024</span></>
];

function AboutCard() {
  return (
    <section className="about-bio-panel">
      <div className="about-bio-intro">
        <p className="about-bio-name">
          I'm <span>Anleeno Xu</span>
        </p>
        <ul className="about-bio-lines">
          {profileLines.map((line, index) => (
            <li key={index}>
              <span className="about-bio-line-icon about-bio-line-icon--interest" aria-hidden="true">{line.icon}</span>
              <span>{line.text}</span>
            </li>
          ))}
        </ul>
        <div className="about-bio-experience">
          <p>
            <span className="about-bio-line-icon about-bio-line-icon--experience" aria-hidden="true">
              <TbBriefcase2 />
            </span>
            <span>Experiences</span>
          </p>
          <ul>
            {experience.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      </div>
      <div className="about-bio-tags" aria-label="Personal keywords">
        <span>CV</span>
        <span>MLLM</span>
        <span>AIGC</span>
        <span>AI4Science</span>
        <span>Edge-AI</span>
      </div>
      <blockquote className="about-bio-quote">
        <p>"Let life be beautiful like summer flowers and death like autumn leaves." <cite>-- Rabindranath Tagore</cite></p>
      </blockquote>
    </section>
  );
}

export default AboutCard;
