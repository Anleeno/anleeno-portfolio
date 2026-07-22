import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import tracks from "../content/musicTracks";

const AudioPlayerContext = createContext(null);
const TRACK_SWITCH_DELAY_MS = 420;

const audioElement = typeof Audio !== "undefined" ? new Audio() : null;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function AudioPlayerProvider({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    if (typeof window === "undefined") {
      return 0.75;
    }
    const stored = window.localStorage.getItem("portfolio-player-volume");
    return stored ? Number(stored) : 0.75;
  });

  const resumeAfterLoadRef = useRef(false);
  const trackSwitchTimerRef = useRef(null);

  const applyVolume = useCallback(
    (value) => {
      const normalized = clamp(value, 0, 1);
      setVolumeState(normalized);
      if (audioElement) {
        audioElement.volume = normalized;
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem("portfolio-player-volume", normalized.toString());
      }
    },
    []
  );

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume]);

  useEffect(
    () => () => {
      if (trackSwitchTimerRef.current) {
        clearTimeout(trackSwitchTimerRef.current);
      }
    },
    []
  );

  const handleNextInternal = useCallback(
    (autoplay) => {
      resumeAfterLoadRef.current = autoplay;
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
    },
    []
  );

  useEffect(() => {
    if (!audioElement) {
      return undefined;
    }

    const handleLoaded = () => {
      setDuration(audioElement.duration || 0);
      setIsLoading(false);
      if (resumeAfterLoadRef.current) {
        audioElement
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
      resumeAfterLoadRef.current = false;
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime || 0);
      setDuration(audioElement.duration || 0);
    };

    const handleEnded = () => {
      setCurrentTime(0);
      handleNextInternal(true);
    };

    audioElement.addEventListener("loadedmetadata", handleLoaded);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoaded);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [handleNextInternal]);

  useEffect(() => {
    if (!audioElement) {
      return;
    }
    const track = tracks[currentIndex];
    if (!track) {
      return;
    }

    setIsLoading(true);
    setCurrentTime((prev) => (audioElement.src === track.audio ? prev : 0));

    if (audioElement.src !== track.audio) {
      audioElement.src = track.audio;
    }
    audioElement.load();
  }, [currentIndex]);

  const play = useCallback(() => {
    if (!audioElement) {
      return;
    }
    audioElement
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  const pause = useCallback(() => {
    if (!audioElement) {
      return;
    }
    audioElement.pause();
    setIsPlaying(false);
  }, []);

  const queueTrackSwitch = useCallback(
    (nextIndex, autoplay, withDelay = true) => {
      if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= tracks.length) {
        return;
      }
      if (trackSwitchTimerRef.current) {
        clearTimeout(trackSwitchTimerRef.current);
        trackSwitchTimerRef.current = null;
      }

      const shouldDelay = withDelay && autoplay && isPlaying && !!audioElement;
      if (shouldDelay) {
        audioElement.pause();
        trackSwitchTimerRef.current = setTimeout(() => {
          resumeAfterLoadRef.current = true;
          setCurrentIndex(nextIndex);
          trackSwitchTimerRef.current = null;
        }, TRACK_SWITCH_DELAY_MS);
        return;
      }

      resumeAfterLoadRef.current = autoplay;
      setCurrentIndex(nextIndex);
    },
    [isPlaying]
  );

  const togglePlay = useCallback(() => {
    if (!audioElement) {
      return;
    }
    if (audioElement.paused) {
      play();
    } else {
      pause();
    }
  }, [pause, play]);

  const playTrack = useCallback(
    (index) => {
      if (!Number.isInteger(index) || index < 0 || index >= tracks.length) {
        return;
      }
      if (index === currentIndex) {
        if (!isPlaying) {
          play();
        }
        return;
      }
      queueTrackSwitch(index, true, true);
    },
    [currentIndex, isPlaying, play, queueTrackSwitch]
  );

  const playNext = useCallback(() => {
    const autoplay = !audioElement?.paused;
    const nextIndex = (currentIndex + 1) % tracks.length;
    queueTrackSwitch(nextIndex, autoplay, true);
  }, [currentIndex, queueTrackSwitch]);

  const playPrevious = useCallback(() => {
    const autoplay = !audioElement?.paused;
    const nextIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    queueTrackSwitch(nextIndex, autoplay, true);
  }, [currentIndex, queueTrackSwitch]);

  const seekTo = useCallback((ratio) => {
    if (!audioElement || !Number.isFinite(ratio) || duration === 0) {
      return;
    }
    audioElement.currentTime = clamp(ratio, 0, 1) * duration;
    setCurrentTime(audioElement.currentTime);
  }, [duration]);

  const seekToSeconds = useCallback((seconds) => {
    if (!audioElement || duration === 0) {
      return;
    }
    const nextTime = clamp(seconds, 0, duration);
    audioElement.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, [duration]);

  const contextValue = useMemo(
    () => ({
      tracks,
      currentIndex,
      currentTrack: tracks[currentIndex],
      isPlaying,
      isLoading,
      duration,
      currentTime,
      progress: duration ? currentTime / duration : 0,
      audioElement,
      volume,
      setVolume: applyVolume,
      togglePlay,
      playTrack,
      playNext,
      playPrevious,
      seekTo,
      seekToSeconds
    }),
    [
      currentIndex,
      currentTime,
      duration,
      isLoading,
      isPlaying,
      volume,
      applyVolume,
      togglePlay,
      playTrack,
      playNext,
      playPrevious,
      seekTo,
      seekToSeconds
    ]
  );

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
}
