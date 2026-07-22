const GOOGLE_SCHOLAR_PROFILE =
  "https://scholar.google.com/citations?hl=en&user=Ih094PwAAAAJ&view_op=list_works&sortby=pubdate";
const CACHE_KEY = "anleeno:google-scholar-citations:v1";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

function normalizeTitle(value = "") {
  return value
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function rowsToMap(rows) {
  return rows.reduce((result, row) => {
    const key = normalizeTitle(row?.title);
    if (key && Number.isFinite(row?.citations)) {
      result[key] = Math.max(result[key] || 0, row.citations);
    }
    return result;
  }, {});
}

function parseScholarHtml(html) {
  if (typeof DOMParser === "undefined") {
    return [];
  }

  const documentNode = new DOMParser().parseFromString(html, "text/html");
  return Array.from(documentNode.querySelectorAll("tr.gsc_a_tr"))
    .map((row) => ({
      title: row.querySelector(".gsc_a_at")?.textContent?.trim() || "",
      citations: Number.parseInt(
        row.querySelector(".gsc_a_ac")?.textContent?.trim() || "0",
        10
      )
    }))
    .filter((row) => row.title && Number.isFinite(row.citations));
}

function parseScholarMarkdown(text) {
  const rows = [];
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  lines.forEach((line, index) => {
    const match = line.match(/cited by\s+(\d+)/i);
    const title = lines[index - 1]?.replace(/^\d+\.\s*/, "");
    if (match && title && !/^(cited by|year|title)$/i.test(title)) {
      rows.push({ title, citations: Number.parseInt(match[1], 10) });
    }
  });

  return rows;
}

function readCache(allowExpired = false) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const cached = JSON.parse(window.localStorage.getItem(CACHE_KEY));
    const isFresh = Date.now() - cached.savedAt < CACHE_TTL_MS;
    if (cached?.citations && (allowExpired || isFresh)) {
      return cached.citations;
    }
  } catch (error) {
    // Citation data is optional and must never affect the publication cards.
  }

  return null;
}

function writeCache(citations) {
  if (typeof window === "undefined" || Object.keys(citations).length === 0) {
    return;
  }

  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ citations, savedAt: Date.now() })
    );
  } catch (error) {
    // Ignore storage restrictions.
  }
}

async function fetchText(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store"
    });
    return response.ok ? response.text() : "";
  } catch (error) {
    return "";
  } finally {
    window.clearTimeout(timer);
  }
}

function proxyUrls() {
  const scholarPath = GOOGLE_SCHOLAR_PROFILE.replace(/^https?:\/\//i, "");
  return [
    `https://r.jina.ai/http://${scholarPath}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_SCHOLAR_PROFILE)}`
  ];
}

export async function fetchScholarCitations() {
  const freshCache = readCache();
  if (freshCache) {
    return freshCache;
  }

  for (const url of proxyUrls()) {
    const text = await fetchText(url);
    if (!text) {
      continue;
    }

    const rows = text.includes("gsc_a_tr")
      ? parseScholarHtml(text)
      : parseScholarMarkdown(text);
    const citations = rowsToMap(rows);
    if (Object.keys(citations).length > 0) {
      writeCache(citations);
      return citations;
    }
  }

  return readCache(true) || {};
}

export function resolveCitationCount(title, citationMap = {}) {
  const target = normalizeTitle(title);
  if (!target) {
    return null;
  }

  if (Number.isFinite(citationMap[target])) {
    return citationMap[target];
  }

  const similarTitle = Object.keys(citationMap).find(
    (candidate) =>
      candidate.length >= 12 &&
      (candidate.includes(target) || target.includes(candidate))
  );
  return similarTitle ? citationMap[similarTitle] : null;
}
