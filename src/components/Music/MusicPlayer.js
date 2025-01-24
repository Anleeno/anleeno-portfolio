import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";
import { useLocation } from "react-router-dom";
import { Container} from "react-bootstrap";
import { FaFastBackward, FaFastForward, FaPause, FaPlay } from "react-icons/fa";
import p1 from "../../Assets/Music/cover/01_Taeyeon_Disaster.png";
import p2 from "../../Assets/Music/cover/02_Taeyeon_CCM.png";
import p3 from "../../Assets/Music/cover/03_NOA_Fireworks.png";
import p4 from "../../Assets/Music/cover/03_TalkTalk_少女时代.jpg";
import p5 from "../../Assets/Music/cover/04_OnlyU_少女时代-泰蒂徐.jpg";
import p6 from "../../Assets/Music/cover/04_Taeyeon_11_11.png";
import p7 from "../../Assets/Music/cover/04_Taeyeon_Why.png";
import p8 from "../../Assets/Music/cover/05_Taeyeon_Dear_Me.png";
import p9 from "../../Assets/Music/cover/06_Taeyeon_Drawing_Our_Moments.png";
import p11 from "../../Assets/Music/cover/08_BabySteps_少女时代-泰蒂徐.jpg";
import p12 from "../../Assets/Music/cover/10_Promise_少女时代.jpg";
import p13 from "../../Assets/Music/cover/11_妖精的尾巴FAIRY_TAIL-KyleXian.png";
import p14 from "../../Assets/Music/cover/12_GrowingPains_SJ_DE.jpg";
import p15 from "../../Assets/Music/cover/13_PARTY_少女时代.jpg";
import p16 from "../../Assets/Music/cover/14_RedVelvet-BadBoy.jpg";
import p17 from "../../Assets/Music/cover/15_RedVelvet-Psycho.jpg";
import p18 from "../../Assets/Music/cover/16_BLACKPINK-Really.jpg";
import p19 from "../../Assets/Music/cover/18_BLACKPINK-WHISTLE.jpg";
import p20 from "../../Assets/Music/cover/21_POP_STARS.jpg";
import p21 from "../../Assets/Music/cover/25_4-Walls_fx.jpg";
import p22 from "../../Assets/Music/cover/27_illa_illa_JUNIEL.jpg";

import m1 from "../../Assets/Music/music/01_Taeyeon_Disaster.mp3";
import m2 from "../../Assets/Music/music/02_Taeyeon_CCM.mp3";
import m3 from "../../Assets/Music/music/03_NOA_Fireworks.mp3";
import m4 from "../../Assets/Music/music/03_TalkTalk_少女时代.mp3";
import m5 from "../../Assets/Music/music/04_OnlyU_少女时代-泰蒂徐.mp3";
import m6 from "../../Assets/Music/music/04_Taeyeon_11_11.mp3";
import m7 from "../../Assets/Music/music/04_Taeyeon_Why.mp3";
import m8 from "../../Assets/Music/music/05_Taeyeon_Dear_Me.mp3";
import m9 from "../../Assets/Music/music/06_Taeyeon_Drawing_Our_Moments.mp3";
import m11 from "../../Assets/Music/music/08_BabySteps_少女时代-泰蒂徐.mp3";
import m12 from "../../Assets/Music/music/10_Promise_少女时代.mp3";
import m13 from "../../Assets/Music/music/11_BoA-MASAYUME_CHASING.mp3";
import m14 from "../../Assets/Music/music/12_GrowingPains_SJ_DE.mp3";
import m15 from "../../Assets/Music/music/13_PARTY_少女时代.mp3";
import m16 from "../../Assets/Music/music/14_RedVelvet-BadBoy.mp3";
import m17 from "../../Assets/Music/music/15_RedVelvet-Psycho.mp3";
import m18 from "../../Assets/Music/music/16_BLACKPINK-Really.mp3";
import m19 from "../../Assets/Music/music/18_BLACKPINK-WHISTLE.mp3";
import m20 from "../../Assets/Music/music/21_POP_STARS.mp3";
import m21 from "../../Assets/Music/music/25_4Walls_fx.mp3";
import m22 from "../../Assets/Music/music/27_illa_illa_JUNIEL.mp3";


const MusicPlayer = () => {
  const audioRef = useRef(new Audio());
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');
  const [progress, setProgress] = useState(0);
  const [savedTime, setSavedTime] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const albums = useMemo(() => [
    "Disaster",
    "Can't Control Myself",
    "Fireworks",
    "Talk Talk",
    "Only U",
    "11:11",
    "Why",
    "Dear Me",
    "Drawing Our Moments",
    "Baby Steps",
    "Promise",
    "MASAYUME CHASING",
    "Growing Pains",
    "PARTY",
    "Bad Boy",
    "Psycho",
    "Really",
    "WHISTLE",
    "POP/STARS",
    "4 Walls",
    "ILLA ILLA(일라 일라)",
  ], []);

  const trackNames = [
    "泰妍(태연)",
    "泰妍(태연)",
    "NOA",
    "少女时代(소녀시대)",
    "少女时代(소녀시대)-TaeTiSeo",
    "泰妍(태연)",
    "泰妍(태연)",
    "泰妍(태연)",
    "泰妍(태연)",
    "少女时代(소녀시대)-TaeTiSeo",
    "少女时代(소녀시대)",
    "BoA",
    "Super Junior(D&E)",
    "少女时代(소녀시대)",
    "Red Velvet",
    "Red Velvet",
    "BLACKPINK",
    "BLACKPINK",
    "K/DA",
    "f(x)",
    "JUNIEL",
  ];
  const coverFiles = [p1,p2,p3,p4,p5,p6,p7,p8,p9,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20,p21,p22];
  const audioFiles = useMemo(() => [m1,m2,m3,m4,m5,m6,m7,m8,m9,m11,m12,m13,m14,m15,m16,m17,m18,m19,m20,m21,m22], []);

  const albumCoverRef = useRef(null);
  const playerTrackRef = useRef(null);
  const progressBoxRef = useRef(null);

  // const loadAudioFiles = useCallback((album) => {
  //   const pattern = new RegExp(album, "i");
  //   return audioFiles.filter((file) => pattern.test(file)); 
  // }, [audioFiles]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const playPauseHandler = () => {
    if (playing) {
      setSavedTime(audioRef.current.currentTime);
      if (playerTrackRef.current) playerTrackRef.current.classList.remove('active');
      if (albumCoverRef.current) albumCoverRef.current.classList.remove('active');
      if (progressBoxRef.current) progressBoxRef.current.classList.remove('active');
      document.querySelector('.progress-bar').style.transition = 'none';
      setTimeout(() => {
        audioRef.current.pause();
        setPlaying(false);
      }, 300);
    } else {
      audioRef.current.currentTime = savedTime;
      if (playerTrackRef.current) playerTrackRef.current.classList.add('active');
      if (albumCoverRef.current) albumCoverRef.current.classList.add('active');
      if (progressBoxRef.current) progressBoxRef.current.classList.add('active');
      setTimeout(() => {
        audioRef.current.play().catch((error) => {
          console.error("Error occurs while playing: ", error);
        });
        setPlaying(true);
      }, 300);
    }
    setPlaying(!playing);
  };

  const updateTime = useCallback(() => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const progressPercentage = (current / duration) * 100;

    setProgress(progressPercentage);
    setCurrentTime(formatTime(current));
  }, []);

  const handleTrackEnd = useCallback(() => {
    if (currentIndex < albums.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
      audioRef.current.currentTime = 0;
     
      setProgress(0);
      setCurrentTime('00:00');

  }, [currentIndex, audioRef, albums]);

  const handleProgressClick = (e) => {
    const progressBox = e.target.getBoundingClientRect();
    const clickPosition = e.clientX - progressBox.left;
    const clickTime = (clickPosition / progressBox.width) * audioRef.current.duration;
  
    if (!audioRef.current.paused && !audioRef.current.ended) {
      audioRef.current.currentTime = clickTime;
    }
  };

  const handleTrackChange = (direction) => {
    if (playing) {
      setSavedTime(audioRef.current.currentTime);
    }
    setIsLoading(true);
    if (direction === 'prev') {
      setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : albums.length - 1);
    } else if (direction === 'next') {
      setCurrentIndex(currentIndex < albums.length - 1 ? currentIndex + 1 : 0);
    }
    audioRef.current.currentTime = 0;
    setSavedTime(0);
  };
  
  const location = useLocation();
  useEffect(() => {
    if (audioRef.current) {
      setSavedTime(0);
      setProgress(0);
      setCurrentTime('00:00');
      setTotalTime('00:00');
      audioRef.current.removeEventListener('timeupdate', updateTime);
      audioRef.current.removeEventListener('ended', handleTrackEnd);

      audioRef.current.src = '';
    }
  }, [location, updateTime, handleTrackEnd]); 

  useEffect(() => {
    const currentAudio = audioFiles[currentIndex];
  
    if (audioRef.current.src === currentAudio) return;
  
    audioRef.current.pause();
    setIsLoading(true);
  
    audioRef.current.src = currentAudio;
    audioRef.current.load();
  
    setProgress(0);
    setCurrentTime('00:00');
  
    const handleMetadataLoaded = () => {
      setTotalTime(formatTime(audioRef.current.duration));
      setIsLoading(false);
    };
  
    const currentAudioRef = audioRef.current;
  
    currentAudioRef.addEventListener('loadedmetadata', handleMetadataLoaded);
  
    if (playing) {
      currentAudioRef.play().catch((error) => {
        console.error("播放时发生错误:", error);
      });
    } else {
      currentAudioRef.pause();
    }
  
    currentAudioRef.addEventListener('timeupdate', updateTime);
    currentAudioRef.addEventListener('ended', handleTrackEnd);
  
    return () => {
      currentAudioRef.removeEventListener('timeupdate', updateTime);
      currentAudioRef.removeEventListener('ended', handleTrackEnd);
      currentAudioRef.removeEventListener("loadedmetadata", handleMetadataLoaded);
      currentAudioRef.pause();
    };
  }, [currentIndex, audioFiles, updateTime, handleTrackEnd, playing, savedTime]);

  return (
    <Container fluid className="music-section">
      <Container className="music-content">
    <div className="music-player">
      <div className="bg" style={{ backgroundImage: `url(${coverFiles[currentIndex]})` }}></div>
      <div className="bg-mask"></div>
      <div className="player">
      <div className="player-track" ref={playerTrackRef}>
        <div className="album-name">{albums[currentIndex]}</div>
        <div className="track-name">{trackNames[currentIndex]}</div>
        <div className="track-time">
          <div className="current-time">{currentTime}</div>
          <div className="total-time">{totalTime}</div>
        </div>
        <div className="progress-box" ref={progressBoxRef} onClick={handleProgressClick}>
          <div className="hover-time">00:36</div>
          <div className="hover-bar"></div>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="player-content">
        <div className="album-cover" ref={albumCoverRef}>
          <img src={coverFiles[currentIndex]} alt="" className="active" />
        </div>
        <div className="play-controls">
          <div className="control" onClick={() => handleTrackChange('prev')}>
            <div className="button play-prev" >
              <FaFastBackward className="play-controls-icon"/>
            </div>
          </div>
          <div className="control" onClick={playPauseHandler}>
            <div className="button play-pause">
              {playing ? <FaPause className="play-controls-icon"/> : <FaPlay className="play-controls-icon"/>}
            </div>
          </div>
          <div className="control" onClick={() => handleTrackChange('next')}>
            <div className="button play-next" >
              <FaFastForward className="play-controls-icon"/>
            </div>
          </div>
          </div>
        </div>
        <div className="loading-spinner" style={{ display: isLoading ? 'block' : 'none' }}>
            <div className="spinner"></div>
        </div>
      </div>
    </div>
    </Container>
    </Container>
  );
};

export default MusicPlayer;