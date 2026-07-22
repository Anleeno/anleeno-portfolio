import ex from "../Assets/Project/ex.mp4";
import adas from "../Assets/Project/ADAS.png";
import leaf_2026 from "../Assets/Publications/2026-leaf.png"
import vqc_cha_2025 from "../Assets/Publications/2025-vqc-cha.png"
import dpc_vqa_2026 from "../Assets/Publications/2026-dpc-vqa.png"
import doris from "../Assets/Project/doris.png";

const mediaLibrary = {
  ex,
  adas,
  leaf_2026,
  vqc_cha_2025,
  dpc_vqa_2026,
  doris
};

export function resolveMedia(key) {
  if (!key) {
    return null;
  }

  if (!mediaLibrary[key] && process.env.NODE_ENV !== "production") {
    console.warn(`[mediaLibrary] Missing asset for key: ${key}`);
  }

  return mediaLibrary[key] || null;
}
