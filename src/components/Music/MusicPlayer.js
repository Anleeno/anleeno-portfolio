import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { FaFastBackward, FaFastForward, FaPause, FaPlay, FaTimes } from "react-icons/fa";
import { IoVolumeHigh, IoVolumeLow, IoVolumeMedium, IoVolumeMute } from "react-icons/io5";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const COVER_RESET_DURATION_MS = 420;
const DEFAULT_GLOW = {
  a: "rgba(223, 236, 255, 0.74)",
  b: "rgba(200, 217, 255, 0.56)",
  c: "rgba(186, 236, 255, 0.44)"
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const rgbToHsl = (r, g, b) => {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === nr) {
      hue = ((ng - nb) / delta) % 6;
    } else if (max === ng) {
      hue = (nb - nr) / delta + 2;
    } else {
      hue = (nr - ng) / delta + 4;
    }
  }

  return [(((hue * 60) % 360) + 360) % 360, saturation, lightness];
};

const hslToRgb = (h, s, l) => {
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - chroma / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = chroma;
    g = x;
  } else if (h < 120) {
    r = x;
    g = chroma;
  } else if (h < 180) {
    g = chroma;
    b = x;
  } else if (h < 240) {
    g = x;
    b = chroma;
  } else if (h < 300) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
};

const sampleZone = (pixels, width, height, xStart, xEnd, yStart, yEnd) => {
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let totalWeight = 0;

  for (let y = yStart; y < yEnd; y += 2) {
    for (let x = xStart; x < xEnd; x += 2) {
      const index = (y * width + x) * 4;
      const alpha = pixels[index + 3] / 255;
      if (alpha < 0.08) {
        continue;
      }
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = (max - min) / 255;
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const weight = (0.35 + luminance * 0.65) * (1 + saturation * 0.45) * alpha;
      totalR += r * weight;
      totalG += g * weight;
      totalB += b * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight <= 0) {
    return [214, 158, 194];
  }
  return [totalR / totalWeight, totalG / totalWeight, totalB / totalWeight];
};

const glowTone = (rgb, saturationBoost, lightnessBoost, alpha) => {
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  const [r, g, b] = hslToRgb(h, clamp(s * saturationBoost, 0, 1), clamp(l + lightnessBoost, 0, 1));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const extractCoverGlow = (coverUrl) =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || !coverUrl) {
      resolve(DEFAULT_GLOW);
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 56;
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) {
          resolve(DEFAULT_GLOW);
          return;
        }
        context.drawImage(image, 0, 0, size, size);
        const { data, width, height } = context.getImageData(0, 0, size, size);
        const primary = sampleZone(data, width, height, 0, Math.floor(width * 0.6), 0, Math.floor(height * 0.58));
        const secondary = sampleZone(
          data,
          width,
          height,
          Math.floor(width * 0.4),
          width,
          0,
          Math.floor(height * 0.62)
        );
        const tertiary = sampleZone(
          data,
          width,
          height,
          Math.floor(width * 0.22),
          Math.floor(width * 0.86),
          Math.floor(height * 0.3),
          height
        );

        resolve({
          a: glowTone(primary, 1.08, 0.24, 0.74),
          b: glowTone(secondary, 1.04, 0.21, 0.52),
          c: glowTone(tertiary, 1.02, 0.18, 0.44)
        });
      } catch (error) {
        resolve(DEFAULT_GLOW);
      }
    };
    image.onerror = () => resolve(DEFAULT_GLOW);
    image.src = coverUrl;
  });

function MarqueeText({ as: Tag = "span", className = "", text = "" }) {
  const lineRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(8);

  useEffect(() => {
    const measure = () => {
      const host = lineRef.current;
      if (!host) {
        return;
      }
      const content = host.firstElementChild || host;
      const nextDistance = Math.max(0, Math.round(content.scrollWidth - host.clientWidth));
      setDistance(nextDistance);
      setDuration(Math.min(16, Math.max(6, nextDistance / 20)));
    };

    const rafId = window.requestAnimationFrame(measure);
    const timerId = window.setTimeout(measure, 120);
    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined" && lineRef.current) {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(lineRef.current);
    }
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      window.removeEventListener("resize", measure);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [text]);

  return (
    <Tag
      ref={lineRef}
      className={`${className} ${distance > 0 ? "is-marquee" : ""}`.trim()}
      style={{
        "--playlist-marquee-distance": `${distance}px`,
        "--playlist-marquee-duration": `${duration}s`
      }}
    >
      <span>{text}</span>
    </Tag>
  );
}

function MusicPlayer() {
  const {
    tracks,
    currentIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    togglePlay,
    playPrevious,
    playNext,
    playTrack,
    seekTo,
    volume,
    setVolume
  } = useAudioPlayer();
  const [drawerDismissed, setDrawerDismissed] = useState(false);
  const [coverTrack, setCoverTrack] = useState(null);
  const [coverResetting, setCoverResetting] = useState(false);
  const [coverResetAngle, setCoverResetAngle] = useState("0deg");
  const [coverGlow, setCoverGlow] = useState(DEFAULT_GLOW);
  const coverImgRef = useRef(null);
  const coverResetTimerRef = useRef(null);
  const mainTitleRef = useRef(null);
  const mainArtistRef = useRef(null);
  const [mainMarqueeDistance, setMainMarqueeDistance] = useState({
    title: 0,
    artist: 0
  });

  const handleProgressClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seekTo(ratio);
  };

  useEffect(() => {
    if (isPlaying) {
      setDrawerDismissed(false);
    } else {
      setDrawerDismissed(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    const readRotation = () => {
      if (!coverImgRef.current) {
        return 0;
      }
      const transformValue = window.getComputedStyle(coverImgRef.current).transform;
      if (!transformValue || transformValue === "none") {
        return 0;
      }
      const values = transformValue
        .match(/matrix\(([^)]+)\)/)?.[1]
        ?.split(",")
        .map((value) => Number(value.trim()));
      if (!values || values.length < 2) {
        return 0;
      }
      const angle = Math.atan2(values[1], values[0]) * (180 / Math.PI);
      return angle < 0 ? angle + 360 : angle;
    };

    if (coverResetTimerRef.current) {
      window.clearTimeout(coverResetTimerRef.current);
      coverResetTimerRef.current = null;
    }

    if (!currentTrack) {
      return;
    }
    if (!isPlaying) {
      setCoverTrack(currentTrack);
      setCoverResetting(false);
      setCoverResetAngle("0deg");
      return;
    }
    if (!coverTrack || coverTrack.id === currentTrack.id) {
      if (!coverTrack) {
        setCoverTrack(currentTrack);
      }
      return;
    }
    const currentAngle = readRotation();
    setCoverResetting(true);
    setCoverResetAngle(`${currentAngle}deg`);
    window.requestAnimationFrame(() => {
      setCoverResetAngle("0deg");
    });
    coverResetTimerRef.current = window.setTimeout(() => {
      setCoverTrack(currentTrack);
      setCoverResetting(false);
      setCoverResetAngle("0deg");
      coverResetTimerRef.current = null;
    }, COVER_RESET_DURATION_MS);
  }, [currentTrack, isPlaying, coverTrack]);

  useEffect(
    () => () => {
      if (coverResetTimerRef.current) {
        window.clearTimeout(coverResetTimerRef.current);
      }
    },
    []
  );
  const shownTrack = coverTrack || currentTrack;
  const shownCoverUrl = shownTrack?.cover || "";

  useEffect(() => {
    if (!shownCoverUrl) {
      setCoverGlow(DEFAULT_GLOW);
      return undefined;
    }
    let active = true;
    extractCoverGlow(shownCoverUrl).then((nextGlow) => {
      if (active) {
        setCoverGlow(nextGlow);
      }
    });
    return () => {
      active = false;
    };
  }, [shownCoverUrl]);

  useEffect(() => {
    const measureOverflow = () => {
      const titleEl = mainTitleRef.current;
      const artistEl = mainArtistRef.current;
      const titleDistance = titleEl
        ? Math.max(
            0,
            Math.round(((titleEl.firstElementChild && titleEl.firstElementChild.scrollWidth) || titleEl.scrollWidth) - titleEl.clientWidth)
          )
        : 0;
      const artistDistance = artistEl
        ? Math.max(
            0,
            Math.round(((artistEl.firstElementChild && artistEl.firstElementChild.scrollWidth) || artistEl.scrollWidth) - artistEl.clientWidth)
          )
        : 0;
      setMainMarqueeDistance((prev) => {
        if (prev.title === titleDistance && prev.artist === artistDistance) {
          return prev;
        }
        return {
          title: titleDistance,
          artist: artistDistance
        };
      });
    };

    const rafId = window.requestAnimationFrame(measureOverflow);
    const timerId = window.setTimeout(measureOverflow, 120);
    window.addEventListener("resize", measureOverflow);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      window.removeEventListener("resize", measureOverflow);
    };
  }, [currentTrack]);

  if (!currentTrack) {
    return null;
  }

  const safeProgress = Number.isFinite(progress) ? progress : 0;
  const drawerOpen = isPlaying && tracks.length > 0 && !drawerDismissed;
  const volumeLevel =
    volume === 0 ? "muted" : volume <= 0.35 ? "soft" : volume <= 0.7 ? "medium" : "high";
  const volumeStep = volume === 0 ? 0 : volume <= 0.35 ? 1 : volume <= 0.7 ? 2 : 3;
  const volumeGlyph =
    volumeStep === 0 ? (
      <IoVolumeMute className="play-controls-icon volume-level-icon" />
    ) : volumeStep === 1 ? (
      <IoVolumeLow className="play-controls-icon volume-level-icon" />
    ) : volumeStep === 2 ? (
      <IoVolumeMedium className="play-controls-icon volume-level-icon" />
    ) : (
      <IoVolumeHigh className="play-controls-icon volume-level-icon" />
    );

  const cycleVolume = () => {
    if (volume === 0) {
      setVolume(0.3);
      return;
    }
    if (volume <= 0.35) {
      setVolume(0.65);
      return;
    }
    if (volume <= 0.7) {
      setVolume(1);
      return;
    }
    setVolume(0);
  };

  return (
    <Container fluid className="music-section">
      <Container className="music-content">
        <div className={`music-player ${isPlaying ? "is-playing" : "is-paused"}`}>
          <div className="bg" style={{ backgroundImage: `url(${currentTrack.cover})` }} />
          <div className="bg-mask" />
          <div className="player">
            <div className="player-shell">
              <div className={`player-info-card ${isPlaying ? "active" : ""}`}>
                <div className="player-info-axis">
                  <div
                    ref={mainTitleRef}
                    className={`album-name ${mainMarqueeDistance.title > 0 ? "is-marquee" : ""}`}
                    style={{ "--player-marquee-distance": `${mainMarqueeDistance.title}px` }}
                  >
                    <span>{currentTrack.title}</span>
                  </div>
                  <div
                    ref={mainArtistRef}
                    className={`track-name ${mainMarqueeDistance.artist > 0 ? "is-marquee" : ""}`}
                    style={{ "--player-marquee-distance": `${mainMarqueeDistance.artist}px` }}
                  >
                    <span>{currentTrack.artist}</span>
                  </div>
                  <div className="track-time">
                    <div className="current-time">{formatTime(currentTime)}</div>
                    <div className="total-time">{formatTime(duration)}</div>
                  </div>
                  <div className="progress-box" onClick={handleProgressClick}>
                    <div className="progress-bar" style={{ width: `${Math.min(safeProgress * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
              <div className="player-controls-card">
                <div className="player-controls-axis">
                  <div className="play-controls" role="group" aria-label="Player controls">
                    <button type="button" className="control-button" onClick={() => playPrevious()}>
                      <FaFastBackward className="play-controls-icon" />
                    </button>
                    <button type="button" className="control-button control-button--primary" onClick={togglePlay}>
                      {isPlaying ? <FaPause className="play-controls-icon" /> : <FaPlay className="play-controls-icon" />}
                    </button>
                    <button type="button" className="control-button" onClick={() => playNext()}>
                      <FaFastForward className="play-controls-icon" />
                    </button>
                    <button
                      type="button"
                      className={`control-button control-button--volume control-button--${volumeLevel}`}
                      onClick={cycleVolume}
                      aria-label="Change volume level"
                    >
                      {volumeGlyph}
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`player-cover ${isPlaying ? "is-active" : ""} ${
                  isPlaying && !coverResetting ? "is-spinning" : ""
                } ${
                  coverResetting ? "is-resetting" : ""
                }`}
                style={{
                  "--cover-reset-angle": coverResetAngle,
                  "--cover-glow-a": coverGlow.a,
                  "--cover-glow-b": coverGlow.b,
                  "--cover-glow-c": coverGlow.c
                }}
              >
                <img
                  ref={coverImgRef}
                  src={shownTrack.cover}
                  alt={shownTrack.title}
                />
              </div>
            </div>
          </div>
          <aside className={`playlist-drawer ${drawerOpen ? "playlist-drawer--open" : ""}`}>
            <div className="playlist-drawer-head">
              <div>
                <span>{tracks.length} tracks</span>
              </div>
              <button
                type="button"
                className="playlist-drawer-close"
                aria-label="Close playlist"
                onClick={() => setDrawerDismissed(true)}
              >
                <FaTimes />
              </button>
            </div>
            <ul className="playlist-drawer-list">
              {tracks.map((track, index) => (
                <li
                  key={track.id}
                  className={`playlist-card ${index === currentIndex ? "is-active" : ""}`}
                  onClick={() => playTrack(index)}
                >
                  <div className="playlist-card-order">{String(index + 1).padStart(2, "0")}</div>
                  <div className="playlist-card-cover">
                    <img src={track.cover} alt={track.title} />
                  </div>
                  <div className="playlist-card-meta">
                    <MarqueeText as="strong" text={track.title} />
                    <MarqueeText as="span" text={track.artist} />
                  </div>
                  <MarqueeText as="div" className="playlist-card-album" text={track.album} />
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </Container>
  );
}

export default MusicPlayer;
