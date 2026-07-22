import React, { useEffect, useRef, useState } from "react";
import { LuPause, LuPlay } from "react-icons/lu";

const noteNames = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const keyboardMap = {
  Z: "C3", S: "C♯3", X: "D3", D: "D♯3", C: "E3", V: "F3", G: "F♯3", B: "G3", H: "G♯3", N: "A3", J: "A♯3", M: "B3",
  Q: "C4", "2": "C♯4", W: "D4", "3": "D♯4", E: "E4", R: "F4", "5": "F♯4", T: "G4", "6": "G♯4", Y: "A4", "7": "A♯4", U: "B4",
  I: "C5", "9": "C♯5", O: "D5", "0": "D♯5", P: "E5", "[": "F5", "]": "F♯5"
};

const pianoKeys = Array.from({ length: 36 }, (_, index) => {
  const midi = 48 + index;
  const pitch = noteNames[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  const note = `${pitch}${octave}`;
  const keyboard = Object.keys(keyboardMap).find((key) => keyboardMap[key] === note) || "";
  return {
    note,
    pitch,
    octave,
    keyboard,
    frequency: 440 * Math.pow(2, (midi - 69) / 12),
    black: pitch.includes("♯")
  };
});

const whiteKeys = pianoKeys.filter((key) => !key.black).map((key, index) => ({ ...key, x: ((index + .5) / 21) * 100 }));
let passedWhiteKeys = 0;
const blackKeys = pianoKeys.reduce((result, key) => {
  if (!key.black) {
    passedWhiteKeys += 1;
  } else {
    result.push({ ...key, left: (passedWhiteKeys / 21) * 100 - 1.38, x: (passedWhiteKeys / 21) * 100 });
  }
  return result;
}, []);
const keyByNote = Object.fromEntries(pianoKeys.map((key) => [key.note, key]));

const scores = [
  {
    id: "elise",
    title: "Für Elise",
    composer: "Beethoven · Theme",
    bpm: 118,
    notes: [
      ["E5",.5],["D♯5",.5],["E5",.5],["D♯5",.5],["E5",.5],["B4",.5],["D5",.5],["C5",.5],["A4",1],
      ["C4",.5],["E4",.5],["A4",.5],["B4",1],["E4",.5],["G♯4",.5],["B4",.5],["C5",1],
      ["E4",.5],["E5",.5],["D♯5",.5],["E5",.5],["D♯5",.5],["E5",.5],["B4",.5],["D5",.5],["C5",.5],["A4",1],
      ["C4",.5],["E4",.5],["A4",.5],["B4",1],["E4",.5],["C5",.5],["B4",.5],["A4",1.5]
    ]
  },
  {
    id: "ode",
    title: "Ode to Joy",
    composer: "Beethoven",
    bpm: 112,
    notes: [
      ["E4",1],["E4",1],["F4",1],["G4",1],["G4",1],["F4",1],["E4",1],["D4",1],["C4",1],["C4",1],["D4",1],["E4",1],["E4",1.5],["D4",.5],["D4",2],
      ["E4",1],["E4",1],["F4",1],["G4",1],["G4",1],["F4",1],["E4",1],["D4",1],["C4",1],["C4",1],["D4",1],["E4",1],["D4",1.5],["C4",.5],["C4",2]
    ]
  },
  {
    id: "twinkle",
    title: "Twinkle, Twinkle",
    composer: "Traditional",
    bpm: 108,
    notes: [
      ["C4",1],["C4",1],["G4",1],["G4",1],["A4",1],["A4",1],["G4",2],["F4",1],["F4",1],["E4",1],["E4",1],["D4",1],["D4",1],["C4",2],
      ["G4",1],["G4",1],["F4",1],["F4",1],["E4",1],["E4",1],["D4",2],["G4",1],["G4",1],["F4",1],["F4",1],["E4",1],["E4",1],["D4",2]
    ]
  }
];

function ArcanaPiano() {
  const audioRef = useRef(null);
  const activeVoicesRef = useRef(new Map());
  const playbackTimersRef = useRef([]);
  const playingScoreRef = useRef(null);
  const currentNoteTimerRef = useRef(null);
  const noteSkyRef = useRef(null);
  const keyElementsRef = useRef(new Map());
  const [activeNotes, setActiveNotes] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [playingScore, setPlayingScore] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentNote, setCurrentNote] = useState(null);

  const getAudioContext = () => {
    if (!audioRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioRef.current = new AudioContext();
    }
    if (audioRef.current.state === "suspended") audioRef.current.resume();
    return audioRef.current;
  };

  const stopNote = (note, fast = false) => {
    const voice = activeVoicesRef.current.get(note);
    if (!voice) return;
    if (fast) {
      const now = voice.context.currentTime;
      voice.master.gain.cancelScheduledValues(now);
      voice.master.gain.setValueAtTime(Math.max(voice.master.gain.value, .0001), now);
      voice.master.gain.exponentialRampToValueAtTime(.0001, now + .26);
    }
    activeVoicesRef.current.delete(note);
    setActiveNotes((current) => current.filter((item) => item !== note));
  };

  const playNote = (key, releaseAfter = null) => {
    if (!key) return;
    if (activeVoicesRef.current.has(key.note)) stopNote(key.note, true);
    const context = getAudioContext();
    const now = context.currentTime;
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(5600, now);
    filter.frequency.exponentialRampToValueAtTime(1500, now + 2.2);
    master.gain.setValueAtTime(.0001, now);
    master.gain.exponentialRampToValueAtTime(.3, now + .012);
    master.gain.exponentialRampToValueAtTime(.14, now + .1);
    master.gain.exponentialRampToValueAtTime(.0001, now + 2.7);
    master.connect(filter);
    filter.connect(context.destination);

    const oscillators = [
      { multiple: 1, gain: .82, type: "triangle" },
      { multiple: 2, gain: .18, type: "sine" },
      { multiple: 3, gain: .07, type: "sine" },
      { multiple: 4, gain: .025, type: "sine" }
    ].map((partial) => {
      const oscillator = context.createOscillator();
      const partialGain = context.createGain();
      oscillator.type = partial.type;
      oscillator.frequency.setValueAtTime(key.frequency * partial.multiple, now);
      oscillator.detune.setValueAtTime((Math.random() - .5) * 2.4, now);
      partialGain.gain.setValueAtTime(partial.gain, now);
      oscillator.connect(partialGain);
      partialGain.connect(master);
      oscillator.start(now);
      oscillator.stop(now + 2.8);
      return oscillator;
    });

    activeVoicesRef.current.set(key.note, { master, oscillators, context });
    setActiveNotes((current) => [...new Set([...current, key.note])]);
    setCurrentNote(key.note);
    window.clearTimeout(currentNoteTimerRef.current);
    currentNoteTimerRef.current = window.setTimeout(() => setCurrentNote(null), 1200);
    const keyElement = keyElementsRef.current.get(key.note);
    const noteSky = noteSkyRef.current;
    let burstX = key.x ?? 50;
    if (keyElement && noteSky) {
      const keyRect = keyElement.getBoundingClientRect();
      const skyRect = noteSky.getBoundingClientRect();
      if (skyRect.width) {
        burstX = ((keyRect.left + keyRect.width / 2 - skyRect.left) / skyRect.width) * 100;
      }
    }
    const burst = {
      id: `${key.note}-${Date.now()}-${Math.random()}`,
      note: key.pitch,
      x: Math.max(1.5, Math.min(98.5, burstX))
    };
    setBursts((current) => [...current, burst]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item.id !== burst.id)), 1500);
    window.setTimeout(() => stopNote(key.note), 2700);
    if (releaseAfter) window.setTimeout(() => stopNote(key.note, true), releaseAfter);
  };

  const stopScore = () => {
    playbackTimersRef.current.forEach(window.clearTimeout);
    playbackTimersRef.current = [];
    activeVoicesRef.current.forEach((_, note) => stopNote(note, true));
    playingScoreRef.current = null;
    setPlayingScore(null);
    setProgress(0);
    setCurrentNote(null);
  };

  const playScore = (score) => {
    if (playingScoreRef.current === score.id) {
      stopScore();
      return;
    }
    stopScore();
    getAudioContext();
    playingScoreRef.current = score.id;
    setPlayingScore(score.id);
    const beat = 60000 / score.bpm;
    const totalBeats = score.notes.reduce((sum, [, duration]) => sum + duration, 0);
    let elapsedBeats = 0;
    score.notes.forEach(([note, duration]) => {
      const startAt = elapsedBeats * beat;
      const timer = window.setTimeout(() => {
        playNote(keyByNote[note], Math.max(130, duration * beat * .82));
        setProgress(Math.min(100, (startAt / (totalBeats * beat)) * 100));
      }, startAt);
      playbackTimersRef.current.push(timer);
      elapsedBeats += duration;
    });
    playbackTimersRef.current.push(window.setTimeout(stopScore, elapsedBeats * beat + 500));
  };

  useEffect(() => {
    const down = (event) => {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) return;
      const note = keyboardMap[event.key.toUpperCase()];
      if (note) {
        event.preventDefault();
        playNote(keyByNote[note]);
      }
    };
    const up = (event) => {
      const note = keyboardMap[event.key.toUpperCase()];
      if (note) stopNote(note, true);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  });

  useEffect(() => () => {
    playbackTimersRef.current.forEach(window.clearTimeout);
    window.clearTimeout(currentNoteTimerRef.current);
    if (audioRef.current) audioRef.current.close();
  }, []);

  const keyProps = (key) => ({
    ref: (element) => {
      if (element) keyElementsRef.current.set(key.note, element);
      else keyElementsRef.current.delete(key.note);
    },
    onPointerDown: (event) => { event.preventDefault(); playNote(key); },
    onPointerUp: () => stopNote(key.note, true),
    onPointerCancel: () => stopNote(key.note, true),
    onPointerLeave: () => stopNote(key.note, true),
    className: activeNotes.includes(key.note) ? "is-playing" : "",
    "aria-label": `Play ${key.note}`
  });

  const scoreButtons = scores.map((score) => (
    <button key={score.id} type="button" className={playingScore === score.id ? "is-playing" : ""} onClick={() => playScore(score)}>
      <i className={playingScore === score.id ? "is-pause" : "is-play"} aria-hidden="true">
        {playingScore === score.id ? <LuPause /> : <LuPlay />}
      </i>
      <span><strong>{score.title}</strong><small>{score.composer}</small></span>
    </button>
  ));

  return (
    <section className="arcana-piano" aria-label="Playable three-octave celestial piano">
      <header>
        <div><span>ARCANA KEYS · C3—B5</span><i className={activeNotes.length ? "is-live" : ""} /></div>
      </header>
      <div className="arcana-score-library">
        <div className="arcana-score-label"><span>MELODY PLAYER</span><b>{playingScore ? `PLAYING · ${currentNote || "READY"}` : "CHOOSE A PIECE"}</b></div>
        <div className="arcana-score-buttons">{scoreButtons}</div>
        <div className="arcana-score-progress"><i style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="arcana-piano-stage">
        <div ref={noteSkyRef} className="arcana-note-sky" aria-hidden="true">
          {bursts.map((burst) => <span key={burst.id} style={{ left: `${burst.x}%` }}><b>♪</b>{burst.note}</span>)}
        </div>
        <div className="arcana-keyboard-scroll">
          <div className="arcana-keyboard">
            <div className="arcana-white-keys">
              {whiteKeys.map((key) => <button type="button" key={key.note} {...keyProps(key)}><span>{key.keyboard}</span><small>{key.note}</small></button>)}
            </div>
            {blackKeys.map((key) => <button type="button" key={key.note} style={{ left: `${key.left}%` }} {...keyProps(key)}><span>{key.keyboard}</span><small>{key.note}</small></button>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArcanaPiano;
