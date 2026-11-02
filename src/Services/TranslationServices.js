import { pipeline } from "@huggingface/transformers";

let translatorPromise = null;

async function getTranslator() {
  if (!translatorPromise) {
    translatorPromise = pipeline("translation", "Xenova/opus-mt-en-hi", {
      device: "wasm",
      dtype: "q8",
    }).catch((error) => {
      translatorPromise = null;
      throw error;
    });
  }

  return translatorPromise;
}

// Split extracted PDF text into smaller chunks.

function splitTextIntoChunks(text, maxLength = 180) {
  const sentences = text
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?।]+[.!?।]?/g);

  if (!sentences) return [];
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const cleanSentence = sentence.trim();

    if (!cleanSentence) continue;

    // Handle unusually long sentences.
    if (cleanSentence.length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }

      const words = cleanSentence.split(/\s+/);
      let wordChunk = "";

      for (const word of words) {
        if (
          wordChunk &&
          `${wordChunk} ${word}`.length > maxLength
        ) {
          chunks.push(wordChunk);
          wordChunk = word;
        } else {
          wordChunk = wordChunk
            ? `${wordChunk} ${word}`
            : word;
        }
      }

      if (wordChunk) chunks.push(wordChunk);

      continue;
    }

    if (
      currentChunk &&
      `${currentChunk} ${cleanSentence}`.length > maxLength
    ) {
      chunks.push(currentChunk);
      currentChunk = cleanSentence;
    } else {
      currentChunk = currentChunk
        ? `${currentChunk} ${cleanSentence}`
        : cleanSentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export async function translateToHindi(text, onProgress) {
  if (!text?.trim()) return "";

  const translator = await getTranslator();

  const chunks = splitTextIntoChunks(text);

  const translatedChunks = [];

  for (let index = 0; index < chunks.length; index++) {
    const result = await translator(chunks[index], {
      max_new_tokens: 256,
    });

    translatedChunks.push(result[0].translation_text);

    if (onProgress) {
      onProgress(index + 1, chunks.length);
    }
  }

  return translatedChunks.join(" ");
}