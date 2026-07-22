import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Footer from "./components/Footer";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./final-overrides.css";
import "./music.css";
import "./App.css";
import "./about-background.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Gallery from "./components/Gallery/Gallery";
import ToX from "./components/ToX/ToX";
import MusicPlayer from "./components/Music/MusicPlayer";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";
import FloatingPlayer from "./components/Music/FloatingPlayer";

function App() {
  const [load, upadateLoad] = useState(true);
  const legacyPagesPath = "/anleeno-portfolio";
  const isLegacyProjectPage = window.location.hostname.toLowerCase() === "anleeno.github.io"
    && (window.location.pathname === legacyPagesPath
      || window.location.pathname.startsWith(`${legacyPagesPath}/`));
  const routerBasename = isLegacyProjectPage ? legacyPagesPath : "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isMediaTarget = (target) =>
      target instanceof Element && Boolean(target.closest("img, video"));
    const preventMediaAction = (event) => {
      if (isMediaTarget(event.target)) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventMediaAction, true);
    document.addEventListener("dragstart", preventMediaAction, true);

    return () => {
      document.removeEventListener("contextmenu", preventMediaAction, true);
      document.removeEventListener("dragstart", preventMediaAction, true);
    };
  }, []);

  return (
    <AudioPlayerProvider>
      <Router basename={routerBasename}>
        <Preloader load={load} />
        <div className="App" id={load ? "no-scroll" : "scroll"}>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/to-x" element={<ToX />} />
            <Route path="/music" element={<MusicPlayer />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
          <FloatingPlayer />
        </div>
      </Router>
    </AudioPlayerProvider>
  );
}

export default App;
