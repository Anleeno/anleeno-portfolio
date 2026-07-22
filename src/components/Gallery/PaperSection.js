import React from "react";
import {
  AiOutlineCheck,
  AiOutlineCode,
  AiOutlineCopy,
  AiOutlineFileText,
  AiOutlineLink
} from "react-icons/ai";

const CCF_LEVEL_RULES = [
  { level: "A", pattern: /\b(cvpr|iccv|eccv|neurips|nips|iclr|icml|acl|siggraph|tpami|ijcv)\b/i },
  { level: "B", pattern: /\b(emnlp|aaai|acm\s*mm)\b/i },
  { level: "C", pattern: /\b(coling|wacv|icpr)\b/i }
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderHighlightedAuthors(authors, highlightAuthors = []) {
  if (!authors) {
    return null;
  }
  const names = highlightAuthors.filter(Boolean);
  if (!names.length) {
    return authors;
  }
  const matcher = new RegExp(`(${names.map((name) => escapeRegExp(name)).join("|")})`, "gi");
  const nameSet = new Set(names.map((name) => name.toLowerCase()));
  return authors.split(matcher).map((part, index) => {
    if (nameSet.has(part.toLowerCase())) {
      return (
        <strong className="portfolio-author-highlight" key={`${part}-${index}`}>
          {part}
        </strong>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function resolveAuthorTag(tag) {
  if (!tag) {
    return null;
  }
  if (typeof tag === "string") {
    return {
      type: "",
      text: tag
    };
  }
  const text =
    tag.text || [tag.label, tag.value].filter(Boolean).join(tag.label && tag.value ? ": " : "");
  if (!text) {
    return null;
  }
  return {
    type: tag.type ? `is-${tag.type}` : "",
    text
  };
}

function resolveCcfLevel(paper) {
  const manual = typeof paper?.ccfLevel === "string" ? paper.ccfLevel.trim().toUpperCase() : "";
  if (manual === "A" || manual === "B" || manual === "C" || manual === "N") {
    return manual;
  }
  const venue = paper?.venue || "";
  const inferred = CCF_LEVEL_RULES.find((rule) => rule.pattern.test(venue));
  return inferred ? inferred.level : "N";
}

function resolveVenueClasses() {
  return "portfolio-paper-venue";
}

function resolveVenueLevel(paper) {
  return resolveCcfLevel(paper);
}

function resolvePaperLinkIcon(label = "") {
  if (/paper|pdf|arxiv/i.test(label)) {
    return <AiOutlineFileText aria-hidden="true" />;
  }
  if (/code|github/i.test(label)) {
    return <AiOutlineCode aria-hidden="true" />;
  }
  return <AiOutlineLink aria-hidden="true" />;
}

function PaperSection({ papers, copiedPaper, onCopyCitation }) {
  return (
    <section className="portfolio-paper-section" id="portfolio-papers">
      <div className="portfolio-section-head align-left">
        <span>Publications</span>
      </div>
      <div className="portfolio-paper-list">
        {papers.map((paper) => {
          const venueLevel = resolveVenueLevel(paper);
          return (
            <article
              className={`portfolio-paper-row is-ccf-${venueLevel.toLowerCase()}`}
              key={paper.title}
            >
              <div className="portfolio-paper-cover">
                <img src={paper.image} alt={paper.title} />
              </div>
              <div className="portfolio-paper-body">
                <div className="portfolio-paper-meta">
                  <span className="portfolio-paper-year">{paper.year}</span>
                  <span className={resolveVenueClasses()}>
                    <span className="portfolio-paper-venue-text">{paper.venue}</span>
                    <span className={`portfolio-paper-venue-level is-ccf-${venueLevel.toLowerCase()}`}>
                      CCF {venueLevel}
                    </span>
                  </span>
                </div>
                <h3>{paper.title}</h3>
                <div className="portfolio-paper-author-row">
                  <h4>{renderHighlightedAuthors(paper.authors, paper.highlightAuthors)}</h4>
                  {Array.isArray(paper.authorTags) && paper.authorTags.length > 0 ? (
                    <div className="portfolio-paper-author-tags">
                      {paper.authorTags.map((tag, index) => {
                        const resolvedTag = resolveAuthorTag(tag);
                        if (!resolvedTag) {
                          return null;
                        }
                        return (
                          <span
                            className={`portfolio-paper-author-tag ${resolvedTag.type}`.trim()}
                            key={`${resolvedTag.text}-${index}`}
                          >
                            {resolvedTag.text}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
                <p className="portfolio-paper-note">{paper.note}</p>
                {Array.isArray(paper.keywords) && paper.keywords.length > 0 ? (
                  <div className="portfolio-paper-keywords" aria-label="Paper keywords">
                    {paper.keywords.map((keyword) => (
                      <span key={keyword}>{keyword}</span>
                    ))}
                  </div>
                ) : null}
                <div className="portfolio-paper-links">
                  {paper.links.map((link) => (
                    <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
                      {resolvePaperLinkIcon(link.label)}
                      {link.label}
                    </a>
                  ))}
                  <button
                    type="button"
                    className={`portfolio-paper-cite ${copiedPaper === paper.title ? "is-copied" : ""}`}
                    onClick={(event) => onCopyCitation(paper.title, paper.cite, event)}
                  >
                    {copiedPaper === paper.title ? (
                      <AiOutlineCheck aria-hidden="true" />
                    ) : (
                      <AiOutlineCopy aria-hidden="true" />
                    )}
                    {copiedPaper === paper.title ? "Copied" : "Cite"}
                  </button>
                  <span className="portfolio-cite-preview">{paper.cite}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PaperSection;
