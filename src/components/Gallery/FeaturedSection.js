import React from "react";
import { FaGithub } from "react-icons/fa";
import { BsCpu, BsEye, BsStars } from "react-icons/bs";
import { FiArrowUpRight, FiSmartphone } from "react-icons/fi";
import huggingFaceLogo from "../../Assets/huggingface-logo.svg";

const featureIconMap = {
  "visual-perception": BsEye,
  llm: BsCpu,
  aigc: BsStars,
};

function isVideoWork(work) {
  return work.mediaType === "video" || /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(work.image || "");
}

function FeaturedCard({ work }) {
  const action = work.action || (work.link?.includes("github.com") ? "github" : "default");
  const type = work.type || "default";
  const FeatureIcon = featureIconMap[work.iconType];
  const hasLink = Boolean(work.link && work.link !== "#");
  const ActionElement = hasLink ? "a" : "span";
  const playPreview = (event) => {
    const video = event.currentTarget.querySelector("video");
    if (video) {
      video.play().catch(() => {});
    }
  };
  const resetPreview = (event) => {
    const video = event.currentTarget.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <article
      className="portfolio-feature-card"
      onMouseEnter={playPreview}
      onMouseLeave={resetPreview}
    >
      <div className={`portfolio-feature-image${isVideoWork(work) ? " is-video" : ""}`}>
        {isVideoWork(work) ? (
          <video
            src={work.image}
            poster={work.poster || undefined}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noremoteplayback"
            aria-label={`${work.title} demo video`}
          />
        ) : (
          <img src={work.image} alt={work.title} />
        )}
      </div>
      <div className="portfolio-feature-body">
        <span className={`portfolio-feature-badge type-${type}`}>
          {FeatureIcon && <FeatureIcon aria-hidden="true" />}
          <span>{work.badge}</span>
        </span>
        <h3>{work.title}</h3>
        <p>{work.description}</p>
        {work.tip && (
          <div className={`portfolio-feature-tip type-${type}`}>
            <span>{work.tip}</span>
          </div>
        )}
        <ActionElement
          className={`portfolio-feature-action ${hasLink ? "" : "is-static"}`}
          {...(hasLink ? { href: work.link, target: "_blank", rel: "noreferrer" } : {})}
        >
          {action === "github" ? (
            <FaGithub aria-hidden="true" />
          ) : action === "demo" ? (
            <img className="portfolio-feature-hf-icon" src={huggingFaceLogo} alt="" aria-hidden="true" />
          ) : action === "app" ? (
            <FiSmartphone aria-hidden="true" />
          ) : (
            <FiArrowUpRight aria-hidden="true" />
          )}
          {action === "github" ? "GitHub" : action === "demo" ? "Demo" : action === "app" ? "App" : "View"}
        </ActionElement>
      </div>
    </article>
  );
}

function FeaturedSection({ works }) {
  return (
    <section className="portfolio-grid-section" id="portfolio-projects">
      <div className="portfolio-section-head">
        <span>Featured</span>
      </div>
      <div className="portfolio-feature-masonry">
        {works.map((work) => (
          <FeaturedCard work={work} key={work.title} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedSection;
