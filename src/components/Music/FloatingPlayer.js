import React, { useEffect, useRef, useState } from "react";
import {
  FaMusic,
  FaPause,
  FaPlay,
  FaTimes,
  FaStepBackward,
  FaStepForward
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";

const COVER_RESET_DURATION_MS = 420;
const COLLAPSE_STAGE_TIMINGS = {
  stage2: 666,
  stage3: 1006,
  stage4: 2024,
  finish: 3184
};

function FloatingPlayer() {
  const { audioElement, currentIndex, currentTrack, isPlaying, playNext, playPrevious, playTrack, togglePlay, tracks } =
    useAudioPlayer();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [collapsing, setCollapsing] = useState(false);
  const [collapsePhase, setCollapsePhase] = useState("idle");
  const [miniCoverTrack, setMiniCoverTrack] = useState(null);
  const [miniCoverResetting, setMiniCoverResetting] = useState(false);
  const [miniCoverResetAngle, setMiniCoverResetAngle] = useState("0deg");
  const [motion, setMotion] = useState({
    bars: [0, 0, 0, 0, 0, 0]
  });
  const previousPlayingRef = useRef(false);
  const collapseTimerRef = useRef(null);
  const collapsePhaseTimersRef = useRef([]);
  const miniCoverResetTimerRef = useRef(null);
  const miniCoverImgRef = useRef(null);
  const rafRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const smoothBarsRef = useRef([0, 0, 0, 0, 0, 0]);
  const previousRmsRef = useRef(0);
  const previousBandsRef = useRef([0, 0, 0, 0, 0, 0]);
  const previousVocalRef = useRef(0);
  const noiseFloorRef = useRef([0, 0, 0, 0, 0, 0]);
  const miniTitleRef = useRef(null);
  const miniArtistRef = useRef(null);
  const [miniMarqueeDistance, setMiniMarqueeDistance] = useState({
    title: 0,
    artist: 0
  });

  useEffect(() => {
    if (!isPlaying) {
      smoothBarsRef.current = [0, 0, 0, 0, 0, 0];
      previousBandsRef.current = [0, 0, 0, 0, 0, 0];
      noiseFloorRef.current = [0, 0, 0, 0, 0, 0];
      previousRmsRef.current = 0;
      previousVocalRef.current = 0;
      setMotion({ bars: [0, 0, 0, 0, 0, 0] });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!expanded) {
      setPlaylistOpen(false);
    }
  }, [expanded]);

  useEffect(() => {
    const clearCollapseTimers = () => {
      if (collapseTimerRef.current) {
        window.clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = null;
      }
      collapsePhaseTimersRef.current.forEach((timer) => {
        window.clearTimeout(timer);
      });
      collapsePhaseTimersRef.current = [];
    };

    if (isPlaying) {
      clearCollapseTimers();
      setCollapsing(false);
      setCollapsePhase("idle");
      setExpanded(true);
    } else if (previousPlayingRef.current) {
      clearCollapseTimers();
      setCollapsing(true);
      setCollapsePhase("stage1");
      collapsePhaseTimersRef.current.push(
        window.setTimeout(() => {
          setCollapsePhase("stage2");
        }, COLLAPSE_STAGE_TIMINGS.stage2)
      );
      collapsePhaseTimersRef.current.push(
        window.setTimeout(() => {
          setCollapsePhase("stage3");
        }, COLLAPSE_STAGE_TIMINGS.stage3)
      );
      collapsePhaseTimersRef.current.push(
        window.setTimeout(() => {
          setCollapsePhase("stage4");
        }, COLLAPSE_STAGE_TIMINGS.stage4)
      );
      collapseTimerRef.current = window.setTimeout(() => {
        setExpanded(false);
        setCollapsing(false);
        setCollapsePhase("idle");
      }, COLLAPSE_STAGE_TIMINGS.finish);
    }
    previousPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(
    () => () => {
      if (collapseTimerRef.current) {
        window.clearTimeout(collapseTimerRef.current);
      }
      collapsePhaseTimersRef.current.forEach((timer) => {
        window.clearTimeout(timer);
      });
      if (miniCoverResetTimerRef.current) {
        window.clearTimeout(miniCoverResetTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const readRotation = () => {
      if (!miniCoverImgRef.current) {
        return 0;
      }
      const transformValue = window.getComputedStyle(miniCoverImgRef.current).transform;
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

    if (miniCoverResetTimerRef.current) {
      window.clearTimeout(miniCoverResetTimerRef.current);
      miniCoverResetTimerRef.current = null;
    }

    if (!currentTrack) {
      return;
    }
    if (!isPlaying) {
      setMiniCoverTrack(currentTrack);
      setMiniCoverResetting(false);
      setMiniCoverResetAngle("0deg");
      return;
    }
    if (!miniCoverTrack || miniCoverTrack.id === currentTrack.id) {
      if (!miniCoverTrack) {
        setMiniCoverTrack(currentTrack);
      }
      return;
    }

    const currentAngle = readRotation();
    setMiniCoverResetting(true);
    setMiniCoverResetAngle(`${currentAngle}deg`);
    window.requestAnimationFrame(() => {
      setMiniCoverResetAngle("0deg");
    });
    miniCoverResetTimerRef.current = window.setTimeout(() => {
      setMiniCoverTrack(currentTrack);
      setMiniCoverResetting(false);
      setMiniCoverResetAngle("0deg");
      miniCoverResetTimerRef.current = null;
    }, COVER_RESET_DURATION_MS);
  }, [currentTrack, isPlaying, miniCoverTrack]);

  useEffect(() => {
    if (!audioElement || !expanded) {
      return undefined;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return undefined;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.18;
    }

    if (!sourceRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }

    const analyser = analyserRef.current;
    const freqValues = new Uint8Array(analyser.frequencyBinCount);
    const timeValues = new Uint8Array(analyser.fftSize);
    const bandRangesHz = [
      [45, 95],
      [95, 180],
      [180, 420],
      [420, 1200],
      [1200, 3200],
      [3200, 7600]
    ];
    const transientWeight = [2.35, 2.0, 1.55, 1.15, 0.86, 0.68];
    const energyWeight = [1.0, 1.04, 1.08, 1.12, 1.04, 0.96];
    const beatMix = [1.45, 1.22, 0.78, 0.42, 0.22, 0.12];
    const voiceMix = [0.04, 0.12, 0.36, 0.82, 1.0, 0.54];
    const releaseRate = [0.34, 0.32, 0.27, 0.23, 0.22, 0.25];
    const attackRate = [0.92, 0.86, 0.74, 0.66, 0.62, 0.58];
    const displayOrder = [0, 2, 4, 1, 3, 5];

    const loop = () => {
      analyser.getByteFrequencyData(freqValues);
      analyser.getByteTimeDomainData(timeValues);

      const hzToBin = (hz) =>
        Math.max(
          1,
          Math.min(freqValues.length - 1, Math.round((hz / audioContextRef.current.sampleRate) * analyser.fftSize))
        );

      const sampleBand = (startHz, endHz) => {
        const start = hzToBin(startHz);
        const end = Math.max(start + 1, hzToBin(endHz));
        let total = 0;
        let weightTotal = 0;
        for (let index = start; index < end; index += 1) {
          const ratio = (index - start) / Math.max(1, end - start - 1);
          const centerBias = 1 - Math.abs(ratio - 0.5) * 0.42;
          const value = freqValues[index] / 255;
          total += value * centerBias;
          weightTotal += centerBias;
        }
        return Math.min(1, total / Math.max(1, weightTotal));
      };

      let rmsAccumulator = 0;
      for (let index = 0; index < timeValues.length; index += 1) {
        const normalized = (timeValues[index] - 128) / 128;
        rmsAccumulator += normalized * normalized;
      }
      const rms = Math.sqrt(rmsAccumulator / timeValues.length);
      const rmsChange = Math.max(0, rms - previousRmsRef.current);
      const kickEnergy = sampleBand(45, 120);
      const bassEnergy = sampleBand(70, 220);
      const snareBody = sampleBand(180, 420);
      const vocalEnergy = sampleBand(700, 3200);
      const vocalRise = Math.max(0, vocalEnergy - previousVocalRef.current);
      const beatPulse = Math.max(0, rmsChange * 42 + kickEnergy * 0.58 + bassEnergy * 0.28);
      previousRmsRef.current = previousRmsRef.current * 0.42 + rms * 0.58;
      previousVocalRef.current = previousVocalRef.current * 0.52 + vocalEnergy * 0.48;
      const vocalPulse = Math.max(0, vocalRise * 5.8 + vocalEnergy * 0.48 + snareBody * 0.16);

      const rawBars = bandRangesHz.map(([startHz, endHz], index) => {
        const bandEnergy = sampleBand(startHz, endHz);
        const previousBand = previousBandsRef.current[index];
        const flux = Math.max(0, bandEnergy - previousBand);
        previousBandsRef.current[index] = previousBand * 0.62 + bandEnergy * 0.38;
        const base = noiseFloorRef.current[index] * 0.985 + bandEnergy * 0.015;
        noiseFloorRef.current[index] = base;
        const adaptiveFloor = Math.min(0.48, base * 1.08);
        const normalizedEnergy = Math.max(
          0,
          (bandEnergy - adaptiveFloor) / Math.max(0.0001, 1 - adaptiveFloor)
        );
        const musicalEnvelope =
          Math.pow(Math.max(0, normalizedEnergy), 0.62) * energyWeight[index] +
          flux * transientWeight[index] +
          beatPulse * beatMix[index] +
          vocalPulse * voiceMix[index];
        const previous = smoothBarsRef.current[index];
        const target = Math.min(1.08, Math.pow(Math.max(0, musicalEnvelope), 0.72));
        const rate = target > previous ? attackRate[index] : releaseRate[index];
        const next = previous + (target - previous) * rate;
        smoothBarsRef.current[index] = next;
        return next;
      });
      setMotion({
        bars: displayOrder.map((index) => Math.max(0, Math.min(1.06, rawBars[index])))
      });

      rafRef.current = window.requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [audioElement, expanded]);

  useEffect(() => {
    const measureOverflow = () => {
      const titleEl = miniTitleRef.current;
      const artistEl = miniArtistRef.current;
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
      setMiniMarqueeDistance((prev) => {
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
  }, [currentTrack, expanded]);

  if (location.pathname === "/music") {
    return null;
  }
  const renderVisualizerBars = (prefix) =>
    motion.bars.map((bar, index) => <i key={`${prefix}-${index}`} style={{ transform: `scaleY(${bar})` }} />);

  return (
    <div
      className={`mini-player-shell ${expanded ? "is-expanded" : "is-collapsed"} ${
        isPlaying ? "is-playing" : ""
      } ${collapsing ? "is-collapsing" : ""} ${collapsing ? `collapse-${collapsePhase}` : ""}`}
    >
      <button
        type="button"
        className="mini-player mini-player--compact"
        aria-label={expanded ? "Collapse background player" : "Expand background player"}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="mini-note-icon">
          <FaMusic />
        </span>
      </button>

      <div
        className={`mini-player mini-player--active ${isPlaying ? "is-playing" : ""}`}
        aria-hidden={!expanded}
      >
        <div
          className={`mini-cover ${isPlaying && !miniCoverResetting ? "mini-cover--spinning" : ""} ${
            miniCoverResetting ? "mini-cover--resetting" : ""
          }`}
          style={{ "--mini-reset-angle": miniCoverResetAngle }}
        >
          {currentTrack ? (
            <img ref={miniCoverImgRef} src={(miniCoverTrack || currentTrack).cover} alt={currentTrack.title} />
          ) : (
            <FaMusic />
          )}
        </div>
        <div className="mini-middle">
          <div className="mini-meta">
            <div className="mini-meta-text">
              <strong
                ref={miniTitleRef}
                className={miniMarqueeDistance.title > 0 ? "is-marquee" : ""}
                style={{ "--mini-marquee-distance": `${miniMarqueeDistance.title}px` }}
              >
                <span>{currentTrack ? currentTrack.title : "Music Player"}</span>
              </strong>
              <span
                ref={miniArtistRef}
                className={miniMarqueeDistance.artist > 0 ? "is-marquee" : ""}
                style={{ "--mini-marquee-distance": `${miniMarqueeDistance.artist}px` }}
              >
                <span>{currentTrack ? currentTrack.artist : "Click to start playing"}</span>
              </span>
            </div>
            <div className={`mini-meta-visualizer ${isPlaying ? "is-active" : "is-idle"}`} aria-hidden="true">
              {renderVisualizerBars("meta")}
            </div>
          </div>
          <div className="mini-side">
            <div className="mini-actions">
              <div className="mini-controls" role="group" aria-label="Background player controls">
                <button type="button" onClick={playPrevious} aria-label="Previous track">
                  <FaStepBackward />
                </button>
                <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button type="button" onClick={playNext} aria-label="Next track">
                  <FaStepForward />
                </button>
              </div>
              <button
                type="button"
                className={`mini-open ${playlistOpen ? "is-active" : ""}`}
                aria-label={playlistOpen ? "Close background playlist" : "Open background playlist"}
                aria-expanded={playlistOpen}
                onClick={() => setPlaylistOpen((value) => !value)}
              >
                <FaMusic />
              </button>
            </div>
          </div>
        </div>
        <div className={`mini-side-visualizer ${isPlaying ? "is-active" : "is-idle"}`} aria-hidden="true">
          {renderVisualizerBars("side")}
        </div>
      </div>
      <aside className={`mini-playlist-panel ${playlistOpen ? "is-open" : ""}`} aria-hidden={!playlistOpen}>
        <div className="playlist-drawer-head">
          <div>
            <span>{tracks.length} tracks</span>
            <p className="music-kicker">Now Playing</p>
          </div>
          <button
            type="button"
            className="playlist-drawer-close"
            aria-label="Close background playlist"
            onClick={() => setPlaylistOpen(false)}
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
                <strong>{track.title}</strong>
                <span>{track.artist}</span>
              </div>
              <div className="playlist-card-album">{track.album}</div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default FloatingPlayer;
