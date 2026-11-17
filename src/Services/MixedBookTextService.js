
const DEVANAGARI_CHAR = /[\u0900-\u097F]/u;
const LATIN_CHAR = /[A-Za-z]/u;

function detectCharacterLanguage(character) {
  if (DEVANAGARI_CHAR.test(character)) return "hi-IN";
  if (LATIN_CHAR.test(character)) return "en-IN";
  return null;
}

function splitIntoLanguageSegments(text) {
  const segments = [];

  let currentText = "";
  let currentLanguage = null;
  let pendingNeutral = "";

  for (const character of text) {
    const detectedLanguage = detectCharacterLanguage(character);

    if (!detectedLanguage) {
      if (currentLanguage) {
        currentText += character;
      } else {
        pendingNeutral += character;
      }
      continue;
    }

    if (!currentLanguage) {
      currentLanguage = detectedLanguage;
      currentText = pendingNeutral + character;
      pendingNeutral = "";
      continue;
    }

    if (detectedLanguage !== currentLanguage) {
      if (currentText.trim()) {
        segments.push({
          text: currentText.trim(),
          language: currentLanguage,
        });
      }

      currentText = pendingNeutral + character;
      currentLanguage = detectedLanguage;
      pendingNeutral = "";
    } else {
      currentText += pendingNeutral + character;
      pendingNeutral = "";
    }
  }

  currentText += pendingNeutral;

  if (currentText.trim()) {
    segments.push({
      text: currentText.trim(),
      language: currentLanguage || "en-IN",
    });
  }

  return segments;
}

function splitLongSegment(segment, maxLength = 220) {
  const words = segment.text.split(/\s+/);
  const chunks = [];

  let buffer = "";

  for (const word of words) {
    if (buffer && `${buffer} ${word}`.length > maxLength) {
      chunks.push({
        text: buffer,
        language: segment.language,
        pauseMs: 0,
      });

      buffer = word;
    } else {
      buffer = buffer ? `${buffer} ${word}` : word;
    }
  }

  if (buffer.trim()) {
    chunks.push({
      text: buffer.trim(),
      language: segment.language,
      pauseMs: 80,
    });
  }

  return chunks;
}

export function prepareMixedSpeechChunks(text) {
  const normalized = String(text || "")
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/([^\n])\n(?!\n)/g, "$1 ")
    .replace(/\n{2,}/g, "\n\n")
    .trim();

  if (!normalized) return [];

  const paragraphs = normalized
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks = [];

  for (const paragraph of paragraphs) {
    const segments = splitIntoLanguageSegments(paragraph);

    for (const segment of segments) {
      chunks.push(...splitLongSegment(segment));
    }

    if (chunks.length) {
      chunks[chunks.length - 1].pauseMs = 150;
    }
  }

  return chunks;
}
