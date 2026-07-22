const DEFAULT_SCHOLAR_PROFILE =
  "https://scholar.google.com/citations?hl=en&user=Ih094PwAAAAJ&view_op=list_works&sortby=pubdate";

function normalizeTitle(value = "") {
  return value
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function toMap(rows) {
  return rows.reduce((acc, row) => {
    if (!row || !row.title || !Number.isFinite(row.citations)) {
      return acc;
    }
    const key = normalizeTitle(row.title);
    if (!key) {
      return acc;
    }
    acc[key] = Math.max(acc[key] || 0, row.citations);
    return acc;
  }, {});
}

function parseScholarHtmlRows(html) {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return [];
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const rows = Array.from(doc.querySelectorAll("tr.gsc_a_tr"));
  return rows
    .map((row) => {
      const title = row.querySelector(".gsc_a_at")?.textContent?.trim() || "";
      const citationText = row.querySelector(".gsc_a_ac")?.textContent?.trim() || "";
      const citations = Number.parseInt(citationText, 10);
      return {
        title,
        citations: Number.isFinite(citations) ? citations : 0
      };
    })
    .filter((row) => row.title);
}

function parseScholarTextRows(text) {
  if (!text) {
    return [];
  }
  const rows = [];
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (let index = 1; index < lines.length; index += 1) {
    const match = lines[index].match(/cited by\s+(\d+)/i);
    if (!match) {
      continue;
    }
    const previous = lines[index - 1];
    if (!previous || /^(cited by|year|title)$/i.test(previous)) {
      continue;
    }
    rows.push({
      title: previous.replace(/^\d+\.\s*/, ""),
      citations: Number.parseInt(match[1], 10)
    });
  }

  return rows;
}

async function fetchText(url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store"
    });
    if (!response.ok) {
      return "";
    }
    return response.text();
  } catch (error) {
    return "";
  } finally {
    window.clearTimeout(timer);
  }
}

function buildProxyUrls(profileUrl) {
  const withoutProtocol = profileUrl.replace(/^https?:\/\//i, "");
  return [
    `https://r.jina.ai/http://${withoutProtocol}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(profileUrl)}`
  ];
}

export async function fetchScholarCitations(profileUrl = DEFAULT_SCHOLAR_PROFILE) {
  const candidates = buildProxyUrls(profileUrl);
  for (const url of candidates) {
    const text = await fetchText(url);
    if (!text) {
      continue;
    }
    const rows = text.includes("gsc_a_tr") ? parseScholarHtmlRows(text) : parseScholarTextRows(text);
    if (rows.length > 0) {
      return toMap(rows);
    }
  }
  return {};
}

export function resolveCitationCount(title, citationMap = {}) {
  if (!title) {
    return null;
  }
  const target = normalizeTitle(title);
  if (!target) {
    return null;
  }
  if (Number.isFinite(citationMap[target])) {
    return citationMap[target];
  }

  const keys = Object.keys(citationMap);
  for (const key of keys) {
    if (key.length < 12) {
      continue;
    }
    if (target.includes(key) || key.includes(target)) {
      return citationMap[key];
    }
  }

  return null;
}
