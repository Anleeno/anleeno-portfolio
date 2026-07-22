import React, { useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import { AiOutlineArrowRight, AiOutlineGithub } from "react-icons/ai";
import { BsMoonStars, BsStars } from "react-icons/bs";
import {
  GiCometSpark,
  GiCoral,
  GiDolphin,
  GiJellyfish,
  GiNautilusShell,
  GiPearlNecklace,
  GiRingedPlanet,
  GiSeaStar,
  GiSeahorse,
  GiSpiralShell,
} from "react-icons/gi";
import { FaMeteor, FaMoon, FaStar } from "react-icons/fa";
import PaperSection from "./PaperSection";
import FeaturedSection from "./FeaturedSection";
import galleryContent from "../../content/galleryContent.json";
import { resolveMedia } from "../../content/mediaLibrary";
import { fetchScholarCitations, resolveCitationCount } from "../../content/scholarCitations";

const resolvedFeaturedWorks = galleryContent.featuredWorks.map((work) => ({
  ...work,
  image: resolveMedia(work.mediaKey || work.imageKey),
  poster: resolveMedia(work.posterKey)
}));

function copyCitation(text) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return Promise.reject(new Error("Clipboard unavailable"));
}

function scrollToPortfolioSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function Gallery() {
  const [copiedPaper, setCopiedPaper] = useState("");
  const [bursts, setBursts] = useState([]);
  const [citationMap, setCitationMap] = useState({});

  useEffect(() => {
    let active = true;
    fetchScholarCitations().then((nextMap) => {
      if (!active || !nextMap || Object.keys(nextMap).length === 0) {
        return;
      }
      setCitationMap(nextMap);
    });
    return () => {
      active = false;
    };
  }, []);

  const resolvedPaperCards = useMemo(
    () =>
      galleryContent.paperCards.map((paper) => {
        const citationCount = resolveCitationCount(paper.title, citationMap);
        const authorTags = Array.isArray(paper.authorTags) ? [...paper.authorTags] : [];
        const hasCitationTag = authorTags.some((tag) => {
          if (typeof tag === "string") {
            return /cited|citation/i.test(tag);
          }
          return tag && tag.type === "citation";
        });
        if (Number.isFinite(citationCount) && !hasCitationTag) {
          authorTags.unshift({
            type: "citation",
            text: `Cited by ${citationCount}`
          });
        }
        return {
          ...paper,
          authorTags,
          image: resolveMedia(paper.imageKey)
        };
      }),
    [citationMap]
  );

  const handleCopyCitation = (title, cite, event) => {
    copyCitation(cite)
      .then(() => {
        setCopiedPaper(title);
        const burstId = `${title}-${Date.now()}`;
        setBursts((current) => [
          ...current,
          {
            id: burstId,
            x: event.clientX,
            y: event.clientY
          }
        ]);
        window.setTimeout(() => {
          setCopiedPaper((current) => (current === title ? "" : current));
        }, 1400);
        window.setTimeout(() => {
          setBursts((current) => current.filter((burst) => burst.id !== burstId));
        }, 900);
      })
      .catch(() => {});
  };

  return (
    <section className="gallery-page-shell">
      <div className="gallery-background-architecture" aria-hidden="true">
        <span className="gallery-element ocean jellyfish-a">
          <GiJellyfish />
        </span>
        <span className="gallery-element ocean coral-a">
          <GiCoral />
        </span>
        <span className="gallery-element ocean starfish-a">
          <GiSeaStar />
        </span>
        <span className="gallery-element ocean nautilus-a">
          <GiNautilusShell />
        </span>
        <span className="gallery-element ocean shell-b">
          <GiSpiralShell />
        </span>
        <span className="gallery-element space star-a">
          <FaStar />
        </span>
        <span className="gallery-element space moon-a">
          <FaMoon />
        </span>
        <span className="gallery-element space saturn-a">
          <GiRingedPlanet />
        </span>
        <span className="gallery-element space meteor-a">
          <FaMeteor />
        </span>
        <span className="gallery-element space sparkle-a">
          <BsStars />
        </span>
        <span className="gallery-element space comet-a">
          <GiCometSpark />
        </span>
        <span className="gallery-element ocean pearl-a">
          <GiPearlNecklace />
        </span>
      </div>
      <div className="gallery-ornament-layer" aria-hidden="true">
        <span className="gallery-ornament ocean coral-b">
          <GiCoral />
        </span>
        <span className="gallery-ornament ocean seahorse-a">
          <GiSeahorse />
        </span>
        <span className="gallery-ornament ocean shell-c">
          <GiNautilusShell />
        </span>
        <span className="gallery-ornament space moon-c">
          <FaMoon />
        </span>
        <span className="gallery-ornament space planet-c">
          <GiRingedPlanet />
        </span>
        <span className="gallery-ornament ocean shell-e">
          <GiSpiralShell />
        </span>
        <span className="gallery-ornament ocean starfish-d">
          <GiSeaStar />
        </span>
      </div>
      <svg className="portfolio-liquid-defs" aria-hidden="true" focusable="false">
        <filter id="portfolio-liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.028"
            numOctaves="2"
            seed="8"
            result="liquidNoise"
          />
          <feGaussianBlur in="liquidNoise" stdDeviation="8" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="34"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="portfolio-liquid-rim" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.024 0.04"
            numOctaves="1"
            seed="14"
            result="rimNoise"
          />
          <feGaussianBlur in="rimNoise" stdDeviation="5" result="softRimNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softRimNoise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </svg>
      <div className="portfolio-fireworks-layer" aria-hidden="true">
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="portfolio-firework"
            style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={`${burst.id}-${index}`}
                className="portfolio-firework-particle"
                style={{ "--particle-angle": `${index * 36}deg` }}
              />
            ))}
          </div>
        ))}
      </div>
      <Container fluid className="gallery-section" id="gallery">
        <Container className="gallery-portfolio">
          <div className="gallery-card-orbit-layer" aria-hidden="true">
            <span className="gallery-orbit ocean orbit-jellyfish-a">
              <GiJellyfish />
            </span>
            <span className="gallery-orbit ocean orbit-shell-a">
              <GiNautilusShell />
            </span>
        <span className="gallery-orbit ocean orbit-starfish-a">
          <GiSeaStar />
        </span>
        <span className="gallery-orbit ocean orbit-dolphin-a">
          <GiDolphin />
        </span>
            <span className="gallery-orbit space orbit-moon-a">
              <FaMoon />
            </span>
            <span className="gallery-orbit space orbit-saturn-a">
              <GiRingedPlanet />
            </span>
            <span className="gallery-orbit space orbit-sparkle-a">
              <BsStars />
            </span>
            <span className="gallery-orbit ocean orbit-coral-a">
              <GiCoral />
            </span>
            <span className="gallery-orbit space orbit-moon-b">
              <BsMoonStars />
            </span>
            <span className="gallery-orbit ocean orbit-pearl-a">
              <GiPearlNecklace />
            </span>
          </div>
          <section className="portfolio-hero">
            <div className="portfolio-hero-glass portfolio-cover-card">
              <div className="portfolio-cover-copy">
                <div className="portfolio-cover-index" aria-label="Portfolio introduction">
                  <span>Portfolio</span>
                  <span>2023—Now</span>
                </div>
                <div className="portfolio-cover-heading">
                  <span className="portfolio-cover-kicker">Selected work &amp; research</span>
                  <h1 className="portfolio-human-ai-title">
                    Human-Centric AI<br />
                    <em>Future Wellbeing.</em>
                  </h1>
                </div>
                <div className="portfolio-cover-actions">
                  <a
                    className="portfolio-cover-link primary"
                    href="https://github.com/anleeno"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AiOutlineGithub aria-hidden="true" />
                    <span>Explore GitHub</span>
                  </a>
                  <button
                    type="button"
                    className="portfolio-cover-link secondary"
                    onClick={() => scrollToPortfolioSection("portfolio-papers")}
                  >
                    <span>View Papers</span>
                    <AiOutlineArrowRight aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="portfolio-cover-link secondary"
                    onClick={() => scrollToPortfolioSection("portfolio-projects")}
                  >
                    <span>View Projects</span>
                    <AiOutlineArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="portfolio-cover-visual portfolio-monogram-board">
                <div className="portfolio-monogram-stage">
                  <span className="portfolio-monogram-plane plane-back" aria-hidden="true" />
                  <span className="portfolio-monogram-plane plane-front" aria-hidden="true" />
                  <div className="portfolio-monogram-mark" aria-label="Anleeno Xu">
                    <span>A</span>
                    <i aria-hidden="true" />
                    <span>X</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <PaperSection
            papers={resolvedPaperCards}
            copiedPaper={copiedPaper}
            onCopyCitation={handleCopyCitation}
          />

          <FeaturedSection works={resolvedFeaturedWorks} />
        </Container>
      </Container>
    </section>
  );
}

export default Gallery;
