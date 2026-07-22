import trackManifest from "./musicTracks.manifest.json";

const coverContext = require.context("../Assets/Music/cover", false, /\.(png|jpe?g|webp)$/);
const audioContext = require.context("../Assets/Music/music", false, /\.mp3$/);

const resolveAsset = (context, folderName, fileName, trackId) => {
  const requestPath = `./${fileName}`;
  if (!context.keys().includes(requestPath)) {
    throw new Error(`[musicTracks] Missing ${folderName} file "${fileName}" for track id=${trackId}`);
  }
  return context(requestPath);
};

const tracks = trackManifest.map((track) => ({
  id: track.id,
  title: track.title,
  artist: track.artist,
  album: track.album,
  cover: resolveAsset(coverContext, "cover", track.coverFile, track.id),
  audio: resolveAsset(audioContext, "audio", track.audioFile, track.id)
}));

export default tracks;
