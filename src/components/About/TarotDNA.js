import React, { useRef, useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { TbZodiacLeo } from "react-icons/tb";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiCompass,
  FiMaximize2,
  FiMusic,
  FiZap
} from "react-icons/fi";
import tarotBloom from "../../Assets/Tarot/t1.png";
import tarotBloomGold from "../../Assets/Tarot/t1-gold.png";
import tarotCompass from "../../Assets/Tarot/t2.png";
import tarotCompassGold from "../../Assets/Tarot/t2-gold.png";
import tarotStar from "../../Assets/Tarot/t3.png";
import tarotStarGold from "../../Assets/Tarot/t3-gold.png";
import tarotShell from "../../Assets/Tarot/t4.png";
import tarotShellGold from "../../Assets/Tarot/t4-gold.png";
import teayeonSignature from "../../Assets/Tarot/teayeon-signature.png";

const bloomImageContext = require.context("../../Assets/Tarot/bloom", false, /\.(png|jpe?g|webp)$/i);
const voyageImageContext = require.context("../../Assets/Tarot/voyage", false, /\.(png|jpe?g|webp)$/i);
const beaconImageContext = require.context("../../Assets/Tarot/beacon", false, /\.(png|jpe?g|webp)$/i);
const soundscapeImageContext = require.context("../../Assets/Tarot/soundscape", false, /\.(png|jpe?g|webp)$/i);

const tarotGalleryDimensions = {
  "0805": { width: 2560, height: 3840 },
  "1_jp": { width: 1080, height: 1620 },
  "2_jp": { width: 1290, height: 1922 },
  "3_jp": { width: 1290, height: 1922 },
  "8a00d24a3e839bd60042fecdabcdcd": { width: 1920, height: 1080 },
  the_tense: { width: 3994, height: 2664 }
};

const tarotGalleryRecords = {
  "1_jp": {
    timestamp: "2025.04.30",
    title: "Little Deer in Nara",
    reading: "Some journeys stay with me through a small pause rather than a landmark — a moment when the world slows down and curiosity meets me halfway.",
    notes: [
      "Nara felt gentle and unhurried: old trees, warm light, and a deer wandering through the frame as if it had always belonged there."
    ]
  },
  "2_jp": {
    timestamp: "2025.05.03",
    title: "Mario World at USJ",
    reading: "Travel is also permission to step inside a world that once existed only on a screen and let playfulness lead for a while.",
    notes: [
      "The oversized colors and familiar characters turned an ordinary route into a vivid, slightly surreal detour."
    ]
  },
  "3_jp": {
    timestamp: "2025.05.03",
    title: "Mario World at USJ",
    reading: "I like places that take delight seriously. Humor, color, and tiny visual surprises can make a memory feel unexpectedly alive.",
    notes: [
      "This scene reminds me that exploration does not always need a grand destination; sometimes it just needs a reason to smile."
    ]
  },
  "4_skydiving": {
    timestamp: "2023.08.26",
    title: "Freefall Skydiving",
    reading: "There is a particular clarity in choosing the unknown on purpose — the instant hesitation gives way to motion and the horizon opens beneath you.",
    notes: [
      "Skydiving became a physical version of how I want to approach difficult things: prepare carefully, commit fully, then trust the movement."
    ]
  },
  "the_tense": {
    timestamp: "2025.04.26",
    title: "The Tense in Macau",
    signature: teayeonSignature,
    reading: "Some echoes linger in scent and sound before they settle into words: a gentle fragrance in the air, a shared chorus, and a sea of lights breathing together.",
    notes: [
      "Seventeen years of waiting unfolds through The Tense — turning love across past, present, and future into a collective atmosphere, brief, overwhelming, and impossible to reproduce in quite the same way."
    ]
  },
  "0805": {
    timestamp: "2026.08.05",
    title: "Happy Birthday",
    reading: "This birthday feels like a deep, fearless breath under an open sky — a quiet realization that I am growing, living, and exactly on my own path.",
    notes: [
      "Happy birthday to me: lingering light, a sweet slice of cake, and another year of chasing dreams with a gentle heart.",
    ]
  },
};

const createFolderGallery = (imageContext, captionPrefix) => imageContext
  .keys()
  .sort()
  .map((imagePath, index) => {
    const fileName = imagePath.replace(/^\.\//, "").replace(/\.[^.]+$/, "");
    const readableFileName = fileName
      .split(/[-_]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const hasDescriptiveName = !/^[a-f\d]{20,}$/i.test(fileName)
      && !/^IMG_?\d+$/i.test(fileName)
      && !/^\d+(?:_jp)?$/i.test(fileName);
    const caption = hasDescriptiveName
      ? readableFileName
      : `${captionPrefix} ${String(index + 1).padStart(2, "0")}`;
    const imageModule = imageContext(imagePath);
    const dimensions = tarotGalleryDimensions[fileName] || { width: 1600, height: 1200 };

    return {
      src: imageModule.default || imageModule,
      alt: `${caption} from the ${captionPrefix.toLowerCase()} archive`,
      caption,
      record: tarotGalleryRecords[fileName],
      ...dimensions
    };
  });

const bloomGallery = createFolderGallery(bloomImageContext, "Bloom Archive");
const voyageGallery = createFolderGallery(voyageImageContext, "Open Route");
const beaconGallery = createFolderGallery(beaconImageContext, "Signal Beacon");
const soundscapeGallery = createFolderGallery(soundscapeImageContext, "Inner Soundscape");

export const tarotCards = [
  {
    id: "bloom",
    title: "The Bloom Archive",
    subtitle: "Aesthetic Memory",
    icon: <TbZodiacLeo />,
    image: tarotBloom,
    goldImage: tarotBloomGold,
    imageAlt: "Floral tarot card with camera lens and pearls",
    accent: "#d98c96",
    short: "Beauty, photography, soft rituals, and the habit of saving tiny emotional details.",
    reading:
      "I remember a day through its color, light, song, and texture. Photography turns those small details into a living visual memory.",
    notes: [
      "I collect moments visually first: a photo, a palette, or the feeling of a scene before I can explain why it matters."
    ]
  },
  {
    id: "compass",
    title: "The Wayfarer’s Voyage",
    subtitle: "Explorer Mode",
    icon: <FiCompass />,
    image: tarotCompass,
    goldImage: tarotCompassGold,
    imageAlt: "Compass tarot card with sky, sea, and travel maps",
    accent: "#4d9fc2",
    short: "Movement, travel, decisions, execution, and the call of the open wilds.",
    reading:
      "This card turns curiosity into motion: choosing a route, adapting to change, and making a vague direction real.",
    notes: [
      "I move best when ambition has a map, a reason, and enough open sky to keep the larger horizon in view."
    ]
  },
  {
    id: "star",
    title: "The Cosmic Beacon",
    subtitle: "Research Drive",
    icon: <FiZap />,
    image: tarotStar,
    goldImage: tarotStarGold,
    imageAlt: "Star tarot card with ocean horizon and celestial geometry",
    accent: "#778cd8",
    short: "AI research, long-horizon curiosity, experiments, and quiet technical intensity.",
    reading:
      "This is the slow-burning research self, drawn to difficult questions and the moment an abstract idea becomes testable and useful.",
    notes: [
      "I stay with a problem long enough for its hidden structure to appear: patient, technical, and quietly stubborn."
    ]
  },
  {
    id: "moon",
    title: "The Starlight Encore",
    subtitle: "Inner Soundscape",
    icon: <FiMusic />,
    image: tarotShell,
    goldImage: tarotShellGold,
    imageAlt: "Moonlit tarot card with shell, ocean, crystals, and headphones",
    accent: "#6c73bd",
    short: "Music, live, cherished memories, shared devotion, and the emotional pull of the stage.",
    reading:
      "This card stores an inner archive of songs, scenes, symbols, and emotional echoes — feelings kept as navigation data.",
    notes: [
      "A song or private symbol can stay for years and quietly become part of how I understand myself."
    ]
  }
];

const tarotGallery = {
  bloom: bloomGallery,
  compass: voyageGallery,
  star: beaconGallery,
  moon: soundscapeGallery
};

const cardSlots = [
  { x: "-15.4rem", y: "1.1rem", rotate: "-8deg", delay: "-0.8s", z: 2 },
  { x: "-5.05rem", y: "-0.99rem", rotate: "4deg", delay: "-2s", z: 4 },
  { x: "6.38rem", y: "1.27rem", rotate: "-2deg", delay: "-1.3s", z: 3 },
  { x: "16.5rem", y: "-0.61rem", rotate: "7deg", delay: "-2.8s", z: 1 }
];

function TarotDNA({ onCardChange }) {
  const [activeId, setActiveId] = useState(null);
  const [readingPhase, setReadingPhase] = useState("deck");
  const [draggingId, setDraggingId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const skipNextClickRef = useRef(false);
  const [layout, setLayout] = useState(tarotCards.map((card) => card.id));
  const activeCard = tarotCards.find((card) => card.id === activeId);
  const isReading = readingPhase === "reading" || readingPhase === "returning";

  const swapCards = (sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) {
      return;
    }

    setLayout((currentLayout) => {
      const sourceIndex = currentLayout.indexOf(sourceId);
      const targetIndex = currentLayout.indexOf(targetId);

      if (sourceIndex < 0 || targetIndex < 0) {
        return currentLayout;
      }

      const nextLayout = [...currentLayout];
      [nextLayout[sourceIndex], nextLayout[targetIndex]] = [
        nextLayout[targetIndex],
        nextLayout[sourceIndex]
      ];
      return nextLayout;
    });
  };

  const handleDragStart = (event, cardId) => {
    setDraggingId(cardId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", cardId);

    const dragImage = event.currentTarget.cloneNode(true);
    dragImage.classList.add("about-tarot-drag-preview");
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, dragImage.offsetHeight / 2);
    window.setTimeout(() => {
      dragImage.remove();
    }, 0);
  };

  const handleDragOver = (event, cardId) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (draggingId && draggingId !== cardId) {
      setDropTargetId(cardId);
    }
  };

  const handleDrop = (event, targetId) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData("text/plain") || draggingId;

    swapCards(sourceId, targetId);
    setDraggingId(null);
    setDropTargetId(null);
    skipNextClickRef.current = true;
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTargetId(null);
  };

  const drawCard = (cardId) => {
    if (skipNextClickRef.current) {
      skipNextClickRef.current = false;
      return;
    }

    setActiveId(cardId);
    setActiveGalleryIndex(0);
    setReadingPhase("reading");
    if (onCardChange) onCardChange(cardId);
  };

  const returnToDeck = () => {
    setActiveId(null);
    setActiveGalleryIndex(0);
    setReadingPhase("deck");
    if (onCardChange) onCardChange(null);
  };

  const folderGallery = activeCard ? tarotGallery[activeCard.id] : [];
  const activeGallery = activeCard
    ? folderGallery && folderGallery.length > 0
      ? folderGallery
      : [
          {
            src: activeCard.image,
            alt: activeCard.imageAlt,
            caption: activeCard.subtitle,
            width: 1024,
            height: 1536
          }
        ]
    : [];
  const activeGalleryItem = activeGallery[activeGalleryIndex] || activeGallery[0];
  const activeRecord = {
    title: activeCard ? activeCard.subtitle : "",
    reading: activeCard ? activeCard.reading : "",
    notes: activeCard ? activeCard.notes : [],
    ...(activeGalleryItem && activeGalleryItem.record ? activeGalleryItem.record : {})
  };

  const showGalleryImage = (index) => {
    if (!activeGallery.length) return;
    setActiveGalleryIndex((index + activeGallery.length) % activeGallery.length);
  };

  const attachFilmstrip = (photoswipe) => {
    photoswipe.on("uiRegister", () => {
      photoswipe.ui.registerElement({
        name: "tarot-filmstrip",
        appendTo: "root",
        onInit: (element, instance) => {
          element.classList.add("about-tarot-photoswipe-filmstrip");
          const thumbnails = activeGallery.map((item, index) => {
            const thumbnail = document.createElement("button");
            thumbnail.type = "button";
            thumbnail.className = "about-tarot-photoswipe-thumb";
            thumbnail.setAttribute("aria-label", `Show image ${index + 1}`);

            const image = document.createElement("img");
            image.src = item.src;
            image.alt = item.caption || activeCard.subtitle;
            thumbnail.appendChild(image);
            thumbnail.addEventListener("click", () => instance.goTo(index));
            element.appendChild(thumbnail);
            return thumbnail;
          });

          const updateActiveThumbnail = () => {
            thumbnails.forEach((thumbnail, index) => {
              thumbnail.classList.toggle("is-active", index === instance.currIndex);
            });
          };

          instance.on("change", updateActiveThumbnail);
          updateActiveThumbnail();
        }
      });
    });
  };
  return (
    <>
      <section className={`about-tarot-card is-${readingPhase}`}>
        <div className="about-tarot-bg" aria-hidden="true" />
        <div className="about-tarot-heading">
          <span className="about-tarot-kicker">Personal DNA</span>
          <h2>{isReading && activeCard ? activeCard.title : "DRAW A CARD. SEE WHAT IT CONCEALS."}</h2>
          <p>
            {isReading && activeCard
              ? activeCard.short
              : "Each card reveals a theme shaped by interests, habits, and memories."}
          </p>
        </div>

        {isReading && activeCard ? (
          <div className="about-tarot-reading">
            <Gallery
              id={`tarot-${activeCard.id}`}
              onBeforeOpen={attachFilmstrip}
              options={{
                paddingFn: (viewportSize) => {
                  if (viewportSize.x <= 767) {
                    return { top: 64, bottom: 150, left: 16, right: 16 };
                  }

                  if (viewportSize.x <= 1100) {
                    return { top: 88, bottom: 170, left: 72, right: 72 };
                  }

                  return { top: 110, bottom: 190, left: 180, right: 180 };
                },
                showHideAnimationType: "zoom"
              }}
            >
              <figure className="about-tarot-reading-album" style={{ "--tarot-accent": activeCard.accent }}>
                <div className="about-tarot-album-cover">
                  {activeGallery.map((item, index) => (
                    <Item
                      key={`${item.src}-${index}`}
                      original={item.src}
                      thumbnail={item.src}
                      width={item.width || 1024}
                      height={item.height || 1536}
                      alt={item.alt || activeCard.imageAlt}
                      caption={item.caption || activeCard.subtitle}
                    >
                      {({ ref, open }) => {
                        const isActiveImage = index === activeGalleryIndex;

                        return (
                          <button
                            type="button"
                            ref={ref}
                            className={`about-tarot-photo-tile about-tarot-album-cover-image ${
                              isActiveImage ? "is-active" : "is-inactive"
                            }`}
                            onClick={isActiveImage ? open : undefined}
                            aria-label={isActiveImage ? `Open ${item.caption || activeCard.subtitle}` : undefined}
                            aria-hidden={isActiveImage ? undefined : "true"}
                            tabIndex={isActiveImage ? 0 : -1}
                          >
                            <img
                              src={item.src}
                              alt={isActiveImage ? item.alt || activeCard.imageAlt : ""}
                              loading="eager"
                              decoding="async"
                            />
                            {isActiveImage ? (
                              <>
                                <span><FiMaximize2 /></span>
                                {activeGallery.length > 1 ? (
                                  <small className="about-tarot-album-count">
                                    {`${String(activeGalleryIndex + 1).padStart(2, "0")} / ${String(activeGallery.length).padStart(2, "0")}`}
                                  </small>
                                ) : null}
                              </>
                            ) : null}
                          </button>
                        );
                      }}
                    </Item>
                  ))}
                  {activeGallery.length > 1 ? (
                    <>
                      <div className="about-tarot-album-controls">
                        <button
                          type="button"
                          onClick={() => showGalleryImage(activeGalleryIndex - 1)}
                          aria-label="Previous image"
                        >
                          <FiChevronLeft />
                        </button>
                        <button
                          type="button"
                          onClick={() => showGalleryImage(activeGalleryIndex + 1)}
                          aria-label="Next image"
                        >
                          <FiChevronRight />
                        </button>
                      </div>
                      <div className="about-tarot-album-dots" aria-label="Album pages">
                        {activeGallery.map((item, index) => (
                          <button
                            type="button"
                            key={`dot-${item.src}`}
                            className={index === activeGalleryIndex ? "is-active" : ""}
                            onClick={() => showGalleryImage(index)}
                            aria-label={`Show ${item.caption || `image ${index + 1}`}`}
                            aria-current={index === activeGalleryIndex ? "true" : undefined}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </figure>
            </Gallery>
            <article
              key={`${activeCard.id}-${activeGalleryIndex}`}
              className="about-tarot-reading-copy"
              style={{ "--tarot-accent": activeCard.accent }}
            >
              <div className="about-tarot-reading-mark">
                <span className="about-tarot-reading-type" style={{ "--tarot-accent": activeCard.accent }}>
                  {activeCard.icon}
                  {activeRecord.title}
                </span>
                {activeRecord.signature ? (
                  <span
                    className="about-tarot-reading-signature"
                    style={{ "--signature-image": `url(${activeRecord.signature})` }}
                    role="img"
                    aria-label="Anleeno signature"
                  />
                ) : null}
              </div>
              <p className="about-tarot-reading-text">{activeRecord.reading}</p>
              <div className="about-tarot-note-stack">
                {activeRecord.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
              {activeRecord.timestamp ? (
                <time className="about-tarot-reading-timestamp">
                  <span aria-hidden="true">—</span>
                  {activeRecord.timestamp}
                </time>
              ) : null}
              <button type="button" className="about-tarot-back" onClick={returnToDeck}>
                <FiArrowLeft />
                Back
              </button>
            </article>
          </div>
        ) : (
          <div className="about-tarot-deck" aria-label="Tarot DNA cards">
            {tarotCards.map((card, index) => (
              <button
                type="button"
                draggable
                className={`about-tarot-deck-card ${draggingId === card.id ? "is-dragging" : ""} ${
                  dropTargetId === card.id ? "is-drop-target" : ""
                }`}
                key={card.id}
                onClick={() => drawCard(card.id)}
                onDragStart={(event) => handleDragStart(event, card.id)}
                onDragOver={(event) => handleDragOver(event, card.id)}
                onDragLeave={() => setDropTargetId(null)}
                onDrop={(event) => handleDrop(event, card.id)}
                onDragEnd={handleDragEnd}
                style={{
                  "--card-index": index,
                  "--tarot-accent": card.accent,
                  "--float-x": cardSlots[layout.indexOf(card.id)]?.x,
                  "--float-y": cardSlots[layout.indexOf(card.id)]?.y,
                  "--float-rotate": cardSlots[layout.indexOf(card.id)]?.rotate,
                  "--float-delay": cardSlots[layout.indexOf(card.id)]?.delay,
                  zIndex: cardSlots[layout.indexOf(card.id)]?.z
                }}
              >
                <span className="about-tarot-image-crop">
                  <img src={card.image} alt={card.imageAlt} />
                  <img className="about-tarot-gold-layer" src={card.goldImage} alt="" aria-hidden="true" />
                </span>
                <span className="about-tarot-card-label">
                  <span>{card.subtitle}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default TarotDNA;
