// import mammoth from "mammoth";
// import { createWorker } from "tesseract.js";

// const docxTextCache = new Map();

// const ocrPageCache = new WeakMap();
// let ocrWorkerPromise = null;

// async function getOCRWorker() {
//   if (!ocrWorkerPromise) {
//     ocrWorkerPromise = createWorker(["mar", "hin"]).catch((err) => {
//       ocrWorkerPromise = null;
//       throw err;
//     });
//   }

//   return ocrWorkerPromise;
// }

// export async function extractDocxText(docxUrl) {
//   if (!docxTextCache.has(docxUrl)) {
//     const request = (async () => {
//       const response = await fetch(docxUrl);

//       if (!response.ok) {
//         throw new Error(`DOCX loading failed: ${response.status}`);
//       }

//       const arrayBuffer = await response.arrayBuffer();
//       const result = await mammoth.extractRawText({ arrayBuffer });

//       return result.value.trim();
//     })();

//     docxTextCache.set(docxUrl, request);
//   }

//   try {
//     return await docxTextCache.get(docxUrl);
//   } catch (error) {
//     docxTextCache.delete(docxUrl);
//     throw error;
//   }
// }

// export async function getBookText({ docxUrl, pdfDocument, pageNumber }) {
//   if (docxUrl) {
//     const text = await extractDocxText(docxUrl);

//     return {
//       source: "docx",
//       text,
//       pageAligned: false,
//     };
//   }

//   if (!pdfDocument || !pageNumber) {
//     throw new Error("PDF document and page number are required");
//   }

//   const page = await pdfDocument.getPage(pageNumber);
//   const content = await page.getTextContent();

//   return {
//     source: "pdf",
//     text: content.items
//       .map((item) => item.str || "")
//       .join(" ")
//       .trim(),
//     pageAligned: true,
//   };
// }

// // async function handleReadDocx() {
// //   if (!product?.docxUrl) return;

// //   try {
// //     setDocxLoading(true);
// //     setDocxError("");

// //     const text = await extractDocxText(product.docxUrl);

// //     setDocxText(text);
// //   } catch (error) {
// //     console.error("DOCX extraction failed:", error);
// //     setDocxError(error.message || "Unable to read DOCX.");
// //   } finally {
// //     setDocxLoading(false);
// //   }
// // }

// // export async function getReadablePageText({
// //   docxUrl,
// //   pdfDocument,
// //   pageNumber,
// // }) {
// //   const result = await getBookText({
// //     docxUrl,
// //     pdfDocument,
// //     pageNumber,
// //   });

// //   if (!result.pageAligned) {
// //     throw new Error(
// //       "DOCX text is available, but its PDF page mapping is not ready.",
// //     );
// //   }

// //   return result.text;
// // }

// // export async function getReadablePageText({
// //   docxUrl,
// //   pdfDocument,
// //   pageNumber,
// // }) {
// //   if (!pdfDocument || !pageNumber) {
// //     throw new Error("PDF document and page number are required.");
// //   }

// //   if (docxUrl) {
// //     const result = await extractVerifiedDocxPage({
// //       docxUrl,
// //       pdfDocument,
// //       pageNumber,
// //     });

// //     if (!result.text?.trim()) {
// //       throw new Error("Readable DOCX page text is empty.");
// //     }

// //     return result.text;
// //   }

// //   throw new Error(
// //     "Readable DOCX is unavailable. Cannot safely read this page."
// //   );
// // }

// export async function getReadablePageText({
//   docxUrl,
//   pdfDocument,
//   pageNumber,
// }) {
//   if (!pdfDocument || !pageNumber) {
//     throw new Error("PDF document and page number are required.");
//   }

//   if (!docxUrl) {
//     throw new Error("Clean DOCX text is unavailable for this book.");
//   }

//   const result = await extractVerifiedDocxPage({
//     docxUrl,
//     pdfDocument,
//     pageNumber,
//   });

//   if (!result.text?.trim()) {
//     throw new Error("No readable text found on this page.");
//   }

//   return result.text;
// }

// // export async function testPageOCR(pdfDocument, pageNumber) {

// //   if (!pdfDocument || !pageNumber ) {
// //     throw new Error("PDF document and page number are required.");
// //   }

// //   const page = await pdfDocument.getPage(pageNumber);

// //   const viewport = page.getViewport({ scale: 2 });

// //   const canvas = document.createElement("canvas");
// //   canvas.width = Math.ceil(viewport.width);
// //   canvas.height = Math.ceil(viewport.height);

// //   const context = canvas.getContext("2d");

// //   if (!context) {
// //     throw new Error("Canvas context is unavailable.");
// //   }

// //   await page.render({
// //     canvasContext: context,
// //     viewport,
// //   }).promise;

// //   const worker = await createWorker(["mar", "hin"]);

// //   try {
// //     const result = await worker.recognize(canvas);

// //     const text = result.data.text.trim();

// //     console.log("OCR PAGE:", pageNumber);
// //     console.log("OCR CONFIDENCE:", result.data.confidence);
// //     console.log("OCR TEXT:", text);

// //     return text;
// //   } finally {
// //     await worker.terminate();
// //     canvas.width = 0;
// //     canvas.height = 0;
// //   }
// // }

// export async function testPageOCR(pdfDocument, pageNumber) {
//   if (
//     !pdfDocument ||
//     !Number.isInteger(pageNumber) ||
//     pageNumber < 1 ||
//     pageNumber > pdfDocument.numPages
//   ) {
//     throw new Error("Valid PDF document and page number are required.");
//   }

//   let pageCache = ocrPageCache.get(pdfDocument);

//   if (!pageCache) {
//     pageCache = new Map();
//     ocrPageCache.set(pdfDocument, pageCache);
//   }

//   if (!pageCache.has(pageNumber)) {
//     const request = (async () => {
//       const page = await pdfDocument.getPage(pageNumber);
//       const viewport = page.getViewport({ scale: 2 });

//       const canvas = document.createElement("canvas");

//       canvas.width = Math.ceil(viewport.width);
//       canvas.height = Math.ceil(viewport.height);

//       try {
//         const context = canvas.getContext("2d");

//         if (!context) {
//           throw new Error("Canvas context is unavailable.");
//         }

//         await page.render({
//           canvasContext: context,
//           viewport,
//         }).promise;

//         const worker = await getOCRWorker();
//         const result = await worker.recognize(canvas);

//         return {
//           text: result.data.text.trim(),
//           confidence: result.data.confidence,
//         };
//       } finally {
//         canvas.width = 0;
//         canvas.height = 0;
//       }
//     })();

//     pageCache.set(pageNumber, request);
//   }

//   try {
//     const result = await pageCache.get(pageNumber);

//     console.log("OCR PAGE:", pageNumber);
//     console.log("OCR CONFIDENCE:", result.confidence);
//     console.log("OCR TEXT:", result.text);

//     return result.text;
//   } catch (error) {
//     pageCache.delete(pageNumber);
//     throw error;
//   }
// }

// function normalizeForMatching(text) {
//   return text
//     .normalize("NFC")
//     .replace(/[\u200B-\u200D\uFEFF]/g, "")
//     .replace(/[^\p{L}\p{N}]/gu, "")
//     .toLowerCase();
// }

// // function getTextParagraphs(text) {
// //   return text
// //     .split(/\n+/)
// //     .map((paragraph) => paragraph.trim())
// //     .filter((paragraph) => paragraph.length > 20);
// // }

// function getTextParagraphs(text) {
//   return text
//     .split(/\n+/)
//     .map((paragraph) => paragraph.trim())
//     .filter(Boolean);
// }

// export async function testDocxPageMatch({ docxUrl, pdfDocument, pageNumber }) {
//   if (!docxUrl || !pdfDocument || !pageNumber) {
//     throw new Error("DOCX URL, PDF document and page number are required.");
//   }

//   const ocrText = await testPageOCR(pdfDocument, pageNumber);
//   const docxText = await extractDocxText(docxUrl);

//   // const ocrLines = ocrText
//   //   .split("\n")
//   //   .map((line) => line.trim())
//   //   .filter((line) => normalizeForMatching(line).length > 25);

//   const ocrLines = ocrText
//     .split("\n")
//     .map((line) => line.trim())
//     .filter((line) => {
//       const normalized = normalizeForMatching(line);

//       // Ignore empty lines and isolated page numbers.
//       if (!normalized || /^\d+$/.test(normalized)) {
//         return false;
//       }

//       // Preserve short headings and numbered list items.
//       return normalized.length >= 4;
//     });

//   const paragraphs = getTextParagraphs(docxText);

//   const normalizedParagraphs = paragraphs.map((paragraph) =>
//     normalizeForMatching(paragraph),
//   );

//   const matches = [];

//   for (const ocrLine of ocrLines) {
//     const normalizedOCR = normalizeForMatching(ocrLine);

//     for (let i = 0; i < paragraphs.length; i++) {
//       // const normalizedDOCX = normalizeForMatching(paragraphs[i]);

//       const normalizedDOCX = normalizedParagraphs[i];

//       if (normalizedDOCX.includes(normalizedOCR)) {
//         matches.push({
//           ocrLine,
//           paragraphIndex: i,
//           docxParagraph: paragraphs[i],
//         });

//         break;
//       }
//     }
//   }

//   console.log("PAGE MATCH TEST:", pageNumber);
//   console.log("OCR LINES:", ocrLines.length);
//   console.log("EXACT MATCHES:", matches.length);
//   console.log("MATCH DETAILS:", matches);

//   return {
//     pageNumber,
//     ocrLines: ocrLines.length,
//     exactMatches: matches.length,
//     matches,
//   };
// }

// export async function testCleanPageBoundaries({
//   docxUrl,
//   pdfDocument,
//   pageNumber,
// }) {
//   const result = await testDocxPageMatch({
//     docxUrl,
//     pdfDocument,
//     pageNumber,
//   });

//   const indexes = [
//     ...new Set(result.matches.map((match) => match.paragraphIndex)),
//   ].sort((a, b) => a - b);

//   if (result.exactMatches < 5 || indexes.length === 0) {
//     throw new Error("Not enough matches to identify this page.");
//   }

//   const docxText = await extractDocxText(docxUrl);
//   const paragraphs = getTextParagraphs(docxText);

//   const firstIndex = indexes[0];
//   const lastIndex = indexes[indexes.length - 1];

//   console.log("PAGE:", pageNumber);
//   console.log("FIRST PARAGRAPH:", firstIndex);
//   console.log("LAST PARAGRAPH:", lastIndex);

//   console.log("FIRST PARAGRAPH TEXT:", paragraphs[firstIndex]);
//   console.log("LAST PARAGRAPH TEXT:", paragraphs[lastIndex]);

//   return {
//     firstIndex,
//     lastIndex,
//     firstParagraph: paragraphs[firstIndex],
//     lastParagraph: paragraphs[lastIndex],
//   };
// }

// function normalizeWithPositions(text) {
//   const characters = [];
//   const positions = [];

//   for (let i = 0; i < text.length; i++) {
//     const originalCharacter = text[i];

//     const normalized = originalCharacter
//       .normalize("NFC")
//       .replace(/[\u200B-\u200D\uFEFF]/g, "")
//       .replace(/[^\p{L}\p{N}]/gu, "")
//       .toLowerCase();

//     for (const character of normalized) {
//       characters.push(character);
//       positions.push(i);
//     }
//   }

//   return {
//     normalized: characters.join(""),
//     positions,
//   };
// }

// const cleanPageTextCache = new WeakMap();

// export async function extractVerifiedDocxPage({
//   docxUrl,
//   pdfDocument,
//   pageNumber,
// }) {
//   if (!docxUrl || !pdfDocument || !pageNumber) {
//     throw new Error("PDF, DOCX and page number are required.");
//   }

//   let documentCache = cleanPageTextCache.get(pdfDocument);

//   if (!documentCache) {
//     documentCache = new Map();
//     cleanPageTextCache.set(pdfDocument, documentCache);
//   }

//   const cacheKey = `${docxUrl}:${pageNumber}`;

//   if (!documentCache.has(cacheKey)) {
//     const request = (async () => {
//       const matchResult = await testDocxPageMatch({
//         docxUrl,
//         pdfDocument,
//         pageNumber,
//       });

//       const { matches, ocrLines, exactMatches } = matchResult;

//       // if (exactMatches < 10 || exactMatches / ocrLines < 0.7) {
//       //   throw new Error(
//       //     "Page matching confidence is too low. Reading stopped.",
//       //   );
//       // }

//       const matchRatio = ocrLines > 0 ? exactMatches / ocrLines : 0;

//       const minimumMatches = Math.min(2, ocrLines);

//       if (ocrLines === 0 || exactMatches < minimumMatches || matchRatio < 0.7) {
//         throw new Error(
//           `Page ${pageNumber}: DOCX matching failed. ` +
//             `${exactMatches}/${ocrLines} OCR lines matched.`,
//         );
//       }

//       const docxText = await extractDocxText(docxUrl);
//       const paragraphs = getTextParagraphs(docxText);

//       const indexes = matches.map((match) => match.paragraphIndex);

//       // Matches should progress forward through the DOCX.
//       for (let i = 1; i < indexes.length; i++) {
//         if (indexes[i] < indexes[i - 1]) {
//           throw new Error("DOCX matches are out of order. Reading stopped.");
//         }
//       }

//       const firstMatch = matches[0];
//       const lastMatch = matches[matches.length - 1];

//       const firstIndex = firstMatch.paragraphIndex;
//       const lastIndex = lastMatch.paragraphIndex;

//       const selectedParagraphs = paragraphs.slice(firstIndex, lastIndex + 1);

//       const combinedText = selectedParagraphs.join("\n\n");
//       const mapped = normalizeWithPositions(combinedText);

//       const normalizedStart = normalizeForMatching(firstMatch.ocrLine);

//       const normalizedEnd = normalizeForMatching(lastMatch.ocrLine);

//       const startPosition = mapped.normalized.indexOf(normalizedStart);

//       const endPosition = mapped.normalized.lastIndexOf(normalizedEnd);

//       if (
//         startPosition === -1 ||
//         endPosition === -1 ||
//         endPosition < startPosition
//       ) {
//         throw new Error("Unable to identify clean page boundaries.");
//       }

//       const originalStart = mapped.positions[startPosition];

//       const endCharacterIndex = endPosition + normalizedEnd.length - 1;

//       const originalEnd = mapped.positions[endCharacterIndex] + 1;

//       // const cleanText = combinedText.slice(originalStart, originalEnd).trim();

//       // if (!cleanText) {
//       //   throw new Error("Clean page text is empty.");
//       // }

//       // return {
//       //   pageNumber,
//       //   text: cleanText,
//       //   exactMatches,
//       //   ocrLines,
//       //   firstIndex,
//       //   lastIndex,
//       // };

//       const cleanText = combinedText.slice(originalStart, originalEnd).trim();

//       if (!cleanText) {
//         throw new Error(`Page ${pageNumber}: Clean page text is empty.`);
//       }

//       // Diagnostic: check what the page extraction actually produced.
//       console.log("DOCX PAGE EXTRACTION AUDIT:", {
//         pageNumber,
//         firstIndex,
//         lastIndex,
//         paragraphSpan: lastIndex - firstIndex + 1,
//         extractedCharacters: cleanText.length,
//         ocrLines,
//         exactMatches,
//         firstOCRLine: firstMatch.ocrLine,
//         lastOCRLine: lastMatch.ocrLine,
//         extractedStart: cleanText.slice(0, 200),
//         extractedEnd: cleanText.slice(-200),
//       });

//       // Safety guard: one page must not accidentally contain
//       // a very large section of the book.
//       const MAX_SUSPICIOUS_PAGE_CHARACTERS = 12000;

//       if (cleanText.length > MAX_SUSPICIOUS_PAGE_CHARACTERS) {
//         throw new Error(
//           `Page ${pageNumber}: Suspicious DOCX extraction detected. ` +
//             `${cleanText.length} characters were extracted. ` +
//             `Page mapping requires correction.`,
//         );
//       }

//       return {
//         pageNumber,
//         text: cleanText,
//         exactMatches,
//         ocrLines,
//         firstIndex,
//         lastIndex,
//       };
//     })();

//     documentCache.set(cacheKey, request);
//   }

//   try {
//     return await documentCache.get(cacheKey);
//   } catch (err) {
//     documentCache.delete(cacheKey);
//     throw err;
//   }
// }

import mammoth from "mammoth";
import { createWorker } from "tesseract.js";

const docxTextCache = new Map();

// const ocrPageCache = new WeakMap();
// let ocrWorkerPromise = null;

// async function getOCRWorker() {
//   if (!ocrWorkerPromise) {
//     ocrWorkerPromise = createWorker(["mar", "hin"]).catch((err) => {
//       ocrWorkerPromise = null;
//       throw err;
//     });
//   }

//   return ocrWorkerPromise;
// }

const ocrPageCache = new WeakMap();
// let ocrWorkerPromise = null;
const ocrWorkerPromise = new Map();

// function getOCRLanguage(language) {
//   const lang = String(language || "").toLowerCase();

//   if (lang.startsWith("en")) return "eng";
//   if (lang.startsWith("mr")) return "mar";
//   if (lang.startsWith("hi")) return "hin";

//   return "mar+hin";
// }

function getOCRLanguage(language) {
  const lang = String(language || "").toLowerCase();

  if (lang === "mixed") return "eng+hin";

  if (lang.startsWith("en")) return "eng";
  if (lang.startsWith("mr")) return "mar";
  if (lang.startsWith("hi")) return "hin";

  return "mar+hin";
}

// async function getOCRWorker() {
//   if (!ocrWorkerPromise) {
//     ocrWorkerPromise = createWorker(["mar", "hin"]).catch((err) => {
//       ocrWorkerPromise = null;
//       throw err;
//     });
//   }

//   return ocrWorkerPromise;
// }

async function getOCRWorker(language = "mr-IN") {
  const ocrLanguage = getOCRLanguage(language);

  if (!ocrWorkerPromise.has(ocrLanguage)) {
    // const workerPromise = createWorker([ocrLanguage]).catch((error) => {
    // const workerPromise = createWorker(
    //   ocrLanguage === "mar+hin" ? ["mar", "hin"] : [ocrLanguage],
    // ).catch((error) => {
    //   ocrWorkerPromise.delete(ocrLanguage);
    //   throw error;
    // });

    const workerPromise = createWorker(ocrLanguage.split("+")).catch(
      (error) => {
        ocrWorkerPromise.delete(ocrLanguage);
        throw error;
      },
    );

    ocrWorkerPromise.set(ocrLanguage, workerPromise);
    console.log("OCR LANGUAGE SELECTED:", ocrLanguage);
  }

  console.log("OCR LANGUAGE SELECTED:", ocrLanguage);

  return ocrWorkerPromise.get(ocrLanguage);
}

export async function extractDocxText(docxUrl) {
  if (!docxTextCache.has(docxUrl)) {
    const request = (async () => {
      const response = await fetch(docxUrl);

      if (!response.ok) {
        throw new Error(`DOCX loading failed: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      return result.value.trim();
    })();

    docxTextCache.set(docxUrl, request);
  }

  try {
    return await docxTextCache.get(docxUrl);
  } catch (error) {
    docxTextCache.delete(docxUrl);
    throw error;
  }
}

const bookLanguageCache = new Map();

export async function detectBookOCRLanguage(docxUrl) {
  if (!docxUrl) {
    return "mr-IN";
  }

  if (!bookLanguageCache.has(docxUrl)) {
    const request = (async () => {
      const text = await extractDocxText(docxUrl);

      const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;

      const englishCount = (text.match(/[A-Za-z]/g) || []).length;

      const detectedLanguage =
        devanagariCount >= englishCount ? "mr-IN" : "en-US";

      console.log("BOOK LANGUAGE DETECTED:", detectedLanguage);
      console.log("DEVANAGARI CHARACTERS:", devanagariCount);
      console.log("ENGLISH CHARACTERS:", englishCount);

      return detectedLanguage;
    })();

    bookLanguageCache.set(docxUrl, request);
  }

  try {
    return await bookLanguageCache.get(docxUrl);
  } catch (error) {
    bookLanguageCache.delete(docxUrl);
    throw error;
  }
}

export async function getBookText({ docxUrl, pdfDocument, pageNumber }) {
  if (docxUrl) {
    const text = await extractDocxText(docxUrl);

    return {
      source: "docx",
      text,
      pageAligned: false,
    };
  }

  if (!pdfDocument || !pageNumber) {
    throw new Error("PDF document and page number are required");
  }

  const page = await pdfDocument.getPage(pageNumber);
  const content = await page.getTextContent();

  return {
    source: "pdf",
    text: content.items
      .map((item) => item.str || "")
      .join(" ")
      .trim(),
    pageAligned: true,
  };
}

// async function handleReadDocx() {
//   if (!product?.docxUrl) return;

//   try {
//     setDocxLoading(true);
//     setDocxError("");

//     const text = await extractDocxText(product.docxUrl);

//     setDocxText(text);
//   } catch (error) {
//     console.error("DOCX extraction failed:", error);
//     setDocxError(error.message || "Unable to read DOCX.");
//   } finally {
//     setDocxLoading(false);
//   }
// }

// export async function getReadablePageText({
//   docxUrl,
//   pdfDocument,
//   pageNumber,
// }) {
//   const result = await getBookText({
//     docxUrl,
//     pdfDocument,
//     pageNumber,
//   });

//   if (!result.pageAligned) {
//     throw new Error(
//       "DOCX text is available, but its PDF page mapping is not ready.",
//     );
//   }

//   return result.text;
// }

// export async function getReadablePageText({
//   docxUrl,
//   pdfDocument,
//   pageNumber,
// }) {
//   if (!pdfDocument || !pageNumber) {
//     throw new Error("PDF document and page number are required.");
//   }

//   if (docxUrl) {
//     const result = await extractVerifiedDocxPage({
//       docxUrl,
//       pdfDocument,
//       pageNumber,
//     });

//     if (!result.text?.trim()) {
//       throw new Error("Readable DOCX page text is empty.");
//     }

//     return result.text;
//   }

//   throw new Error(
//     "Readable DOCX is unavailable. Cannot safely read this page."
//   );
// }

// export async function getReadablePageText({
//   docxUrl,
//   pdfDocument,
//   pageNumber,
// }) {
//   if (!pdfDocument || !pageNumber) {
//     throw new Error("PDF document and page number are required.");
//   }

//   if (!docxUrl) {
//     throw new Error("Clean DOCX text is unavailable for this book.");
//   }

//   const result = await extractVerifiedDocxPage({
//     docxUrl,
//     pdfDocument,
//     pageNumber,
//   });

//   if (!result.text?.trim()) {
//     throw new Error("No readable text found on this page.");
//   }

//   return result.text;
// }

export async function getReadablePageText({
  docxUrl,
  pdfDocument,
  pageNumber,
  previewTextUrl,
  // language = "mr-IN",
  language,

  strictBoundaryRecovery = false,
  hanumanShortLineMatching = false,
}) {
  if (!pdfDocument || !pageNumber) {
    throw new Error("PDF document and page number are required.");
  }

  // Admin and purchased reader: original matching logic.
  if (docxUrl) {
    // const detectedLanguage = await detectBookOCRLanguage(docxUrl);

    const detectedLanguage =
      language === "mixed" ? "mixed" : await detectBookOCRLanguage(docxUrl);

    const result = await extractVerifiedDocxPage({
      docxUrl,
      pdfDocument,
      pageNumber,
      language: detectedLanguage,

      strictBoundaryRecovery,
      hanumanShortLineMatching,
    });

    if (!result.text?.trim()) {
      throw new Error("No readable text found on this page.");
    }

    return result.text;
  }

  // Public preview: only first 8 pages.
  if (previewTextUrl) {
    if (pageNumber > 8) {
      throw new Error("Only 8 preview pages are available.");
    }

    // const ocrText = await testPageOCR(pdfDocument, pageNumber);
    const ocrText = await testPageOCR(pdfDocument, pageNumber, language);

    const response = await fetch(previewTextUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber,
        ocrText,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to prepare preview speech.");
    }

    return data.data.text;
  }

  throw new Error("Clean DOCX text is unavailable for this book.");
}

// export async function testPageOCR(pdfDocument, pageNumber) {

//   if (!pdfDocument || !pageNumber ) {
//     throw new Error("PDF document and page number are required.");
//   }

//   const page = await pdfDocument.getPage(pageNumber);

//   const viewport = page.getViewport({ scale: 2 });

//   const canvas = document.createElement("canvas");
//   canvas.width = Math.ceil(viewport.width);
//   canvas.height = Math.ceil(viewport.height);

//   const context = canvas.getContext("2d");

//   if (!context) {
//     throw new Error("Canvas context is unavailable.");
//   }

//   await page.render({
//     canvasContext: context,
//     viewport,
//   }).promise;

//   const worker = await createWorker(["mar", "hin"]);

//   try {
//     const result = await worker.recognize(canvas);

//     const text = result.data.text.trim();

//     console.log("OCR PAGE:", pageNumber);
//     console.log("OCR CONFIDENCE:", result.data.confidence);
//     console.log("OCR TEXT:", text);

//     return text;
//   } finally {
//     await worker.terminate();
//     canvas.width = 0;
//     canvas.height = 0;
//   }
// }

export async function testPageOCR(pdfDocument, pageNumber, language = "mr-IN") {
  if (
    !pdfDocument ||
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > pdfDocument.numPages
  ) {
    throw new Error("Valid PDF document and page number are required.");
  }
  // Diagnostic only: check whether PDF has a usable text layer.
  // Do not bypass OCR yet.
  try {
    const pdfPage = await pdfDocument.getPage(pageNumber);

    console.time(`PDF TEXT LAYER ${pageNumber}`);
    const textContent = await pdfPage.getTextContent();

    const pdfText = textContent.items
      .map((item) => item.str || "")
      .join(" ")
      .trim();

    console.timeEnd(`PDF TEXT LAYER ${pageNumber}`);

    console.log("PDF TEXT LENGTH:", pdfText.length);
    console.log("PDF TEXT SAMPLE:", pdfText.slice(0, 300));
  } catch (error) {
    console.warn("PDF text layer check failed:", error);
  }

  let pageCache = ocrPageCache.get(pdfDocument);

  if (!pageCache) {
    pageCache = new Map();
    ocrPageCache.set(pdfDocument, pageCache);
  }

  const cacheKey = `${pageNumber}:${getOCRLanguage(language)}`;
  // if (!pageCache.has(pageNumber)) {
  if (!pageCache.has(cacheKey)) {
    const request = (async () => {
      const page = await pdfDocument.getPage(pageNumber);
      // const viewport = page.getViewport({ scale: 2 });
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      try {
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas context is unavailable.");
        }

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        // const worker = await getOCRWorker();
        const worker = await getOCRWorker(language);
        const result = await worker.recognize(canvas);

        return {
          text: result.data.text.trim(),
          confidence: result.data.confidence,
        };
      } finally {
        canvas.width = 0;
        canvas.height = 0;
      }
    })();

    // pageCache.set(pageNumber, request);
    pageCache.set(cacheKey, request);
  }

  try {
    // const result = await pageCache.get(pageNumber);
    const result = await pageCache.get(cacheKey);

    console.log("OCR PAGE:", pageNumber);
    console.log("OCR CONFIDENCE:", result.confidence);
    console.log("OCR TEXT:", result.text);

    return result.text;
  } catch (error) {
    // pageCache.delete(pageNumber);
    pageCache.delete(cacheKey);
    throw error;
  }
}

function normalizeForMatching(text) {
  return (
    text
      .normalize("NFC")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      // .replace(/[^\p{L}\p{N}]/gu, "")
      .replace(/[^\p{L}\p{M}\p{N}]/gu, "")
      .toLowerCase()
  );
}

function getBoundarySimilarity(firstText, secondText) {
  const a = normalizeForMatching(firstText);
  const b = normalizeForMatching(secondText);

  if (!a || !b) return 0;
  if (a === b) return 1;

  const makePairs = (value) => {
    const pairs = new Set();

    for (let i = 0; i < value.length - 1; i++) {
      pairs.add(value.slice(i, i + 2));
    }

    return pairs;
  };

  const aPairs = makePairs(a);
  const bPairs = makePairs(b);

  let common = 0;

  for (const pair of aPairs) {
    if (bPairs.has(pair)) common++;
  }

  return (2 * common) / (aPairs.size + bPairs.size || 1);
}

function isOCRSupportedParagraph(paragraph, ocrLines, language) {
  const normalizedParagraph = normalizeForMatching(paragraph);

  if (normalizedParagraph.length < 12) return false;

  const paragraphPairs = new Set();

  for (let i = 0; i < normalizedParagraph.length - 1; i++) {
    paragraphPairs.add(normalizedParagraph.slice(i, i + 2));
  }

  return ocrLines.some((line) => {
    const normalizedLine = normalizeForMatching(line);

    if (normalizedLine.length < 12) return false;

    // Exact substring is the strongest evidence.
    if (
      normalizedParagraph.includes(normalizedLine) ||
      normalizedLine.includes(normalizedParagraph)
    ) {
      return true;
    }

    // Allow small OCR spelling errors in Devanagari.
    const linePairs = new Set();

    for (let i = 0; i < normalizedLine.length - 1; i++) {
      linePairs.add(normalizedLine.slice(i, i + 2));
    }

    let common = 0;

    for (const pair of paragraphPairs) {
      if (linePairs.has(pair)) common++;
    }

    const similarity = (2 * common) / (paragraphPairs.size + linePairs.size);

    // return similarity >= 0.75;
    return similarity >= (language === "mixed" ? 0.55 : 0.75);
  });
}

// function getTextParagraphs(text) {
//   return text
//     .split(/\n+/)
//     .map((paragraph) => paragraph.trim())
//     .filter((paragraph) => paragraph.length > 20);
// }

function getTextParagraphs(text, preserveShortLines = false) {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) =>
      preserveShortLines
        ? normalizeForMatching(paragraph).length >= 4
        : paragraph.length > 20,
    );
}

export async function testDocxPageMatch({
  docxUrl,
  pdfDocument,
  pageNumber,
  language = "mr-IN",
  hanumanShortLineMatching = false,
}) {
  if (!docxUrl || !pdfDocument || !pageNumber) {
    throw new Error("DOCX URL, PDF document and page number are required.");
  }

  const startTime = performance.now();

  console.time(`OCR PAGE ${pageNumber}`);
  // const ocrText = await testPageOCR(pdfDocument, pageNumber);
  // const ocrText = await testPageOCR(pdfDocument, pageNumber, language);
  // // const ocrText = await testPageOCR(pdfDocument, pageNumber, language, "mr-IN");
  // console.timeEnd(`OCR PAGE ${pageNumber}`);

  // console.time(`DOCX PAGE ${pageNumber}`);
  // const docxText = await extractDocxText(docxUrl);

  const ocrStart = performance.now();
  const docxStart = performance.now();

  const [ocrText, docxText] = await Promise.all([
    testPageOCR(pdfDocument, pageNumber, language),
    extractDocxText(docxUrl),
  ]);

  console.log(
    `OCR PAGE ${pageNumber}:`,
    Math.round(performance.now() - ocrStart),
    "ms",
  );

  console.log(
    `OCR + DOCX READY ${pageNumber}:`,
    Math.round(performance.now() - docxStart),
    "ms",
  );

  // console.timeEnd(`DOCX PAGE ${pageNumber}`);

  console.log(
    `TOTAL PREPARATION PAGE ${pageNumber}:`,
    ((performance.now() - startTime) / 1000).toFixed(2),
    "seconds",
  );

  // const ocrLines = ocrText
  //   .split("\n")
  //   .map((line) => line.trim())
  //   .filter((line) => normalizeForMatching(line).length > 25);

  const ocrTextLines = ocrText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // const ocrLines = ocrTextLines.filter(
  //   (line) => normalizeForMatching(line).length > 25,
  // );

  console.log("HANUMAN MATCHING FLAG:", hanumanShortLineMatching);
  const ocrLines = ocrTextLines.filter((line) => {
    const length = normalizeForMatching(line).length;

    return hanumanShortLineMatching ? length >= 12 : length > 25;
  });

  // const paragraphs = getTextParagraphs(docxText);
  const paragraphs = getTextParagraphs(docxText, hanumanShortLineMatching);

  console.log(
    "HANUMAN DOCX SAMPLE:",
    paragraphs
      .filter(
        (p) =>
          p.includes("जय हनुमान") ||
          p.includes("जय कपीस") ||
          p.includes("राम दूत") ||
          p.includes("अंजनि"),
      )
      .slice(0, 12),
  );

  const normalizedParagraphs = paragraphs.map(normalizeForMatching);

  if (hanumanShortLineMatching && pageNumber === 7) {
    const targetParagraphs = paragraphs.slice(21, 26);

    console.log(
      "HANUMAN PAGE 7 LINE SIMILARITY:",
      ocrLines.map((ocrLine) => ({
        ocrLine,
        candidates: targetParagraphs.map((paragraph, index) => ({
          paragraphIndex: index + 21,
          similarity: Number(
            getBoundarySimilarity(ocrLine, paragraph).toFixed(3),
          ),
          paragraph,
        })),
      })),
    );
  }

  // const matches = [];

  // for (const ocrLine of ocrLines) {
  //   const normalizedOCR = normalizeForMatching(ocrLine);

  //   for (let i = 0; i < paragraphs.length; i++) {
  //     // const normalizedDOCX = normalizeForMatching(paragraphs[i]);
  //     const normalizedDOCX = normalizedParagraphs[i];

  //     if (normalizedDOCX.includes(normalizedOCR)) {
  //       matches.push({
  //         ocrLine,
  //         paragraphIndex: i,
  //         docxParagraph: paragraphs[i],
  //       });

  //       break;
  //     }
  //   }
  // }

  const matches = [];

  let lastParagraphIndex = 0;

  if (hanumanShortLineMatching && pageNumber >= 16) {
    const marathiSectionIndex = paragraphs.findIndex((paragraph) =>
      normalizeForMatching(paragraph).includes(
        normalizeForMatching("चाळीस चौपाया व मराठी अर्थ"),
      ),
    );

    if (marathiSectionIndex === -1) {
      throw new Error(
        "Hanuman Marathi meaning section not found. Reading stopped.",
      );
    }

    lastParagraphIndex = marathiSectionIndex;
  }

  let lastCharacterPosition = 0;

  for (const ocrLine of ocrLines) {
    const normalizedOCR = normalizeForMatching(ocrLine);

    if (!normalizedOCR) continue;

    for (let i = lastParagraphIndex; i < normalizedParagraphs.length; i++) {
      const normalizedDOCX = normalizedParagraphs[i];

      const searchStart = i === lastParagraphIndex ? lastCharacterPosition : 0;

      const matchPosition = normalizedDOCX.indexOf(normalizedOCR, searchStart);

      if (matchPosition === -1) continue;

      matches.push({
        ocrLine,
        paragraphIndex: i,
        docxParagraph: paragraphs[i],
        matchPosition,
      });

      lastParagraphIndex = i;
      lastCharacterPosition = matchPosition + normalizedOCR.length;

      break;
    }
  }

  console.log("PAGE MATCH TEST:", pageNumber);
  console.log("OCR LINES:", ocrLines.length);
  console.log("EXACT MATCHES:", matches.length);
  console.log("MATCH DETAILS:", matches);

  if (hanumanShortLineMatching && pageNumber === 7) {
    console.log(
      "HANUMAN PAGE 7 DOCX PARAGRAPHS:",
      paragraphs.slice(19, 30).map((text, index) => ({
        paragraphIndex: index + 19,
        text,
      })),
    );

    console.log(
      "HANUMAN PAGE 7 MATCH POSITIONS:",
      matches.map((match) => ({
        ocrLine: match.ocrLine,
        paragraphIndex: match.paragraphIndex,
        matchPosition: match.matchPosition,
      })),
    );
  }

  if (hanumanShortLineMatching) {
    const matchedLines = new Set(
      matches.map((match) => normalizeForMatching(match.ocrLine)),
    );

    console.log(
      "HANUMAN UNMATCHED OCR LINES:",
      ocrLines.filter((line) => !matchedLines.has(normalizeForMatching(line))),
    );

    console.log("HANUMAN LAST MATCH:", matches[matches.length - 1] || null);
  }

  // return {
  //   pageNumber,
  //   ocrLines: ocrLines.length,
  //   exactMatches: matches.length,
  //   matches,
  // };

  return {
    pageNumber,
    ocrLines: ocrLines.length,
    ocrTextLines,
    exactMatches: matches.length,
    matches,
  };
}

export async function testCleanPageBoundaries({
  docxUrl,
  pdfDocument,
  pageNumber,
}) {
  const result = await testDocxPageMatch({
    docxUrl,
    pdfDocument,
    pageNumber,
  });

  const indexes = [
    ...new Set(result.matches.map((match) => match.paragraphIndex)),
  ].sort((a, b) => a - b);

  if (result.exactMatches < 5 || indexes.length === 0) {
    throw new Error("Not enough matches to identify this page.");
  }

  const docxText = await extractDocxText(docxUrl);
  const paragraphs = getTextParagraphs(docxText);

  const firstIndex = indexes[0];
  const lastIndex = indexes[indexes.length - 1];

  console.log("PAGE:", pageNumber);
  console.log("FIRST PARAGRAPH:", firstIndex);
  console.log("LAST PARAGRAPH:", lastIndex);

  console.log("FIRST PARAGRAPH TEXT:", paragraphs[firstIndex]);
  console.log("LAST PARAGRAPH TEXT:", paragraphs[lastIndex]);

  return {
    firstIndex,
    lastIndex,
    firstParagraph: paragraphs[firstIndex],
    lastParagraph: paragraphs[lastIndex],
  };
}

function normalizeWithPositions(text) {
  const characters = [];
  const positions = [];

  for (let i = 0; i < text.length; i++) {
    const originalCharacter = text[i];

    const normalized = originalCharacter
      .normalize("NFC")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      // .replace(/[^\p{L}\p{N}]/gu, "")
      .replace(/[^\p{L}\p{M}\p{N}]/gu, "")
      .toLowerCase();

    for (const character of normalized) {
      characters.push(character);
      positions.push(i);
    }
  }

  return {
    normalized: characters.join(""),
    positions,
  };
}

function extractHanumanVerifiedLines(docxText, matchResult) {
  const paragraphs = getTextParagraphs(docxText);
  const matches = matchResult.matches || [];

  if (matches.length < 2) {
    throw new Error("Hanuman page anchors could not be verified.");
  }

  // Use existing exact matches only as trustworthy location anchors.
  const firstIndex = matches[0].paragraphIndex;
  const lastIndex = matches[matches.length - 1].paragraphIndex;

  // Search locally around verified paragraphs, never the whole book.
  const searchFrom = Math.max(0, firstIndex - 2);
  const searchTo = Math.min(paragraphs.length, lastIndex + 3);

  const segments = [];

  for (let p = searchFrom; p < searchTo; p++) {
    const paragraph = paragraphs[p];

    // Split complete verse lines at their original punctuation.
    const parts = paragraph
      .split(/(?<=[।॥])\s*|\t|\n/u)
      .map((part) => part.trim())
      .filter(Boolean);

    for (const part of parts) {
      if (normalizeForMatching(part).length >= 10) {
        segments.push({
          text: part,
          paragraphIndex: p,
        });
      }
    }
  }

  const ocrLines = (matchResult.ocrTextLines || [])
    .map((line) => line.trim())
    .filter((line) => normalizeForMatching(line).length >= 10)
    .filter((line) => !/SKS|DREAM|हनुमान चालीसा/i.test(line));

  const selected = [];
  let cursor = 0;

  for (const ocrLine of ocrLines) {
    let bestIndex = -1;
    let bestScore = 0;

    // Only look a few verse lines ahead to preserve page order.
    for (let i = cursor; i < Math.min(segments.length, cursor + 7); i++) {
      const score = getBoundarySimilarity(ocrLine, segments[i].text);

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    if (bestIndex >= 0 && bestScore >= 0.65) {
      selected.push(segments[bestIndex]);
      cursor = bestIndex + 1;
    }
  }

  // Reject uncertain pages instead of reading unrelated content.
  const minimumMatches = Math.max(2, Math.ceil(ocrLines.length * 0.6));

  if (selected.length < minimumMatches) {
    throw new Error("Hanuman page verification failed. Reading stopped.");
  }

  const selectedIndexes = selected.map((item) => segments.indexOf(item));

  console.log("HANUMAN PAGE GAP AUDIT:", {
    pageNumber: matchResult.pageNumber,
    selectedIndexes,
    gaps: selectedIndexes.slice(1).map((index, i) => ({
      from: selectedIndexes[i],
      to: index,
      missingSegments: segments
        .slice(selectedIndexes[i] + 1, index)
        .map((item) => item.text),
    })),
  });

  // Do not bridge unmatched gaps: that could include next-page text.
  const text = selected.map((item) => item.text).join("\n");

  console.log("HANUMAN VERIFIED EXTRACTION:", {
    matchedLines: selected.length,
    ocrLines: ocrLines.length,
    firstParagraph: selected[0]?.paragraphIndex,
    lastParagraph: selected[selected.length - 1]?.paragraphIndex,
    text,
  });

  return text;
}

const cleanPageTextCache = new WeakMap();

// export async function extractVerifiedDocxPage({
//   docxUrl,
//   pdfDocument,
//   pageNumber,
// }) {
export async function extractVerifiedDocxPage({
  docxUrl,
  pdfDocument,
  pageNumber,
  language,

  strictBoundaryRecovery = false,
  hanumanShortLineMatching = false,
}) {
  if (!docxUrl || !pdfDocument || !pageNumber) {
    throw new Error("PDF, DOCX and page number are required.");
  }

  let documentCache = cleanPageTextCache.get(pdfDocument);

  if (!documentCache) {
    documentCache = new Map();
    cleanPageTextCache.set(pdfDocument, documentCache);
  }

  // const cacheKey = `${docxUrl}:${pageNumber}`;
  // const cacheKey = `${docxUrl}:${pageNumber}:${getOCRLanguage(language)}`;
  // const cacheKey = `${docxUrl}:${pageNumber}:${getOCRLanguage(language)}:${strictBoundaryRecovery}`;
  const cacheKey = `${docxUrl}:${pageNumber}:${getOCRLanguage(language)}:${strictBoundaryRecovery}:${hanumanShortLineMatching}`;
  if (!documentCache.has(cacheKey)) {
    const request = (async () => {
      const matchResult = await testDocxPageMatch({
        docxUrl,
        pdfDocument,
        pageNumber,
        language,

        hanumanShortLineMatching,
      });

      const { matches, ocrLines, exactMatches } = matchResult;

      // if (hanumanShortLineMatching) {
      if (hanumanShortLineMatching && pageNumber >= 3 && pageNumber <= 12) {
        const docxText = await extractDocxText(docxUrl);

        const verifiedText = extractHanumanVerifiedLines(docxText, matchResult);

        return {
          pageNumber,
          text: verifiedText,
          exactMatches,
          ocrLines,
        };
      }

      // Product 31 only: verified Chaupayi + complete Marathi meaning.
      // if (hanumanShortLineMatching && pageNumber >= 16 && pageNumber <= 55) {
      //   const docxText = await extractDocxText(docxUrl);
      //   const paragraphs = getTextParagraphs(docxText);

      //   const chaupayiNumber = pageNumber - 15;

      //   const sectionStart = paragraphs.findIndex((paragraph) =>
      //     normalizeForMatching(paragraph).includes(
      //       normalizeForMatching("चाळीस चौपाया व मराठी अर्थ"),
      //     ),
      //   );

      //   if (sectionStart === -1) {
      //     throw new Error("Hanuman Marathi section not found.");
      //   }

      //   const verseIndex = sectionStart + 1 + (chaupayiNumber - 1) * 2;
      //   const meaningIndex = verseIndex + 1;

      //   const verse = paragraphs[verseIndex];
      //   const meaning = paragraphs[meaningIndex];

      //   if (!verse || !meaning || !meaning.includes("मराठी अर्थ")) {
      //     throw new Error(
      //       "Hanuman verse and Marathi meaning verification failed.",
      //     );
      //   }

      //   return {
      //     pageNumber,
      //     text: `${verse}\n\n${meaning}`,
      //     exactMatches,
      //     ocrLines,
      //   };
      // }

      if (hanumanShortLineMatching && pageNumber >= 16) {
        const docxText = await extractDocxText(docxUrl);
        // const paragraphs = getTextParagraphs(docxText);
        const paragraphs = getTextParagraphs(docxText, true);

        const sectionStart = paragraphs.findIndex((p) =>
          normalizeForMatching(p).includes(
            normalizeForMatching("चाळीस चौपाया व मराठी अर्थ"),
          ),
        );

        if (sectionStart < 0) {
          throw new Error("Hanuman Marathi section not found.");
        }

        // Product 31: handle heading-only pages safely.
        if (
          hanumanShortLineMatching &&
          exactMatches >= 1 &&
          matches.length === 1
        ) {
          const matchedIndex = matches[0].paragraphIndex;
          const matchedParagraph = paragraphs[matchedIndex];

          const normalizedOCR = normalizeForMatching(matches[0].ocrLine);

          const normalizedDOCX = normalizeForMatching(matchedParagraph || "");

          const isHeadingOnlyPage =
            ocrLines <= 2 &&
            normalizedOCR.length >= 12 &&
            normalizedOCR === normalizedDOCX &&
            /(?:अष्टक|ाष्टक|चालीसा|आरती|स्तोत्र|वंदना|स्तुती|दोहा|श्रीराम\s*जय\s*राम\s*जय\s*जय\s*राम)/u.test(
              matchedParagraph || "",
            );

          if (isHeadingOnlyPage) {
            console.log("HANUMAN HEADING PAGE VERIFIED:", {
              pageNumber,
              paragraphIndex: matchedIndex,
              text: matchedParagraph,
            });

            return {
              pageNumber,
              text: matchedParagraph,
              exactMatches,
              ocrLines,
              firstIndex: matchedIndex,
              lastIndex: matchedIndex,
            };
          }
        }

        const ocrContent = (matchResult.ocrTextLines || [])
          .map((line) => line.trim())
          .filter((line) => {
            const normalized = normalizeForMatching(line);
            return (
              normalized.length >= 10 &&
              !/SKS|DREAM|श्री हनुमान चालीसा/i.test(line)
            );
          });

        // Compare OCR lines with a sliding window of DOCX paragraphs.
        // This avoids depending on exact spelling or fixed page numbers.
        const scoreWindow = (text) => {
          const normalizedText = normalizeForMatching(text);
          if (!normalizedText) return 0;

          let score = 0;
          let evidence = 0;

          for (const line of ocrContent) {
            const normalizedLine = normalizeForMatching(line);

            if (normalizedText.includes(normalizedLine)) {
              score += 1;
              evidence++;
              continue;
            }

            // OCR may contain spelling mistakes.
            const lineLength = normalizedLine.length;
            let best = 0;

            for (
              let pos = 0;
              pos < normalizedText.length;
              pos += Math.max(1, Math.floor(lineLength / 4))
            ) {
              const candidate = normalizedText.slice(pos, pos + lineLength + 5);

              best = Math.max(best, getBoundarySimilarity(line, candidate));
            }

            if (best >= 0.65) {
              score += best;
              evidence++;
            }
          }

          return evidence >= 2 ? score / ocrContent.length : 0;
        };

        let best = null;
        let secondBestScore = 0;

        for (let start = sectionStart; start < paragraphs.length; start++) {
          for (let count = 1; count <= 5; count++) {
            const end = start + count;

            if (end > paragraphs.length) break;

            const selected = paragraphs.slice(start, end);

            const combined = selected.join("\n\n");

            const score = scoreWindow(combined);

            // Prefer a smaller window when scores are comparable.
            const adjustedScore = score - (count - 1) * 0.005;

            if (!best || adjustedScore > best.adjustedScore) {
              secondBestScore = best
                ? Math.max(secondBestScore, best.adjustedScore)
                : secondBestScore;

              best = {
                start,
                end,
                text: combined,
                score,
                adjustedScore,
              };
            } else {
              secondBestScore = Math.max(secondBestScore, adjustedScore);
            }
          }
        }

        if (hanumanShortLineMatching && pageNumber === 67) {
          const candidates = [];

          for (let start = sectionStart; start < paragraphs.length; start++) {
            for (let count = 1; count <= 5; count++) {
              const end = start + count;

              if (end > paragraphs.length) break;

              const text = paragraphs.slice(start, end).join("\n\n");
              const score = scoreWindow(text);

              if (score > 0) {
                candidates.push({
                  start,
                  end,
                  score,
                  text: text.slice(0, 350),
                });
              }
            }
          }

          candidates.sort((a, b) => b.score - a.score);

          if (hanumanShortLineMatching && pageNumber === 67) {
            console.log(
              "HANUMAN PAGE 67 DOCX PARAGRAPHS:",
              paragraphs.slice(175, 185).map((text, index) => ({
                index: 175 + index,
                text,
              })),
            );
          }

          console.log("HANUMAN PAGE 67 OCR CONTENT:", ocrContent);
          console.log(
            "HANUMAN PAGE 67 TOP CANDIDATES:",
            candidates.slice(0, 10),
          );
        }

        if (!best || best.score < 0.6) {
          throw new Error(
            `Hanuman page ${pageNumber}: DOCX page could not be verified.`,
          );
        }

        // Prevent matching an unrelated passage.
        const meaningfulOCR = ocrContent.filter(
          (line) => !/^(चौपाई|दोहा|मराठी अर्थ)/u.test(line),
        );

        const hasTextEvidence = meaningfulOCR.some(
          (line) => scoreWindow(best.text) >= 0.6,
        );

        if (!hasTextEvidence) {
          throw new Error(
            `Hanuman page ${pageNumber}: insufficient text evidence.`,
          );
        }

        console.log("HANUMAN VERIFIED PAGE:", {
          pageNumber,
          firstIndex: best.start,
          lastIndex: best.end - 1,
          confidence: best.score,
          text: best.text,
        });

        return {
          pageNumber,
          text: best.text,
          exactMatches,
          ocrLines,
          firstIndex: best.start,
          lastIndex: best.end - 1,
        };
      }

      // if (
      //   exactMatches < 10 ||
      //   exactMatches / ocrLines < 0.7
      // ) {
      //   throw new Error(
      //     "Page matching confidence is too low. Reading stopped."
      //   );
      // }

      const matchRatio = ocrLines > 0 ? exactMatches / ocrLines : 0;

      // const requiredMatches = Math.min(
      //   10,
      //   Math.max(5, Math.ceil(ocrLines * 0.7)),
      // );

      // const requiredMatches = Math.min(
      //   10,
      //   Math.max(2, Math.ceil(ocrLines * 0.7)),
      // );

      const requiredMatches = hanumanShortLineMatching
        ? Math.min(10, Math.max(2, Math.ceil(ocrLines * 0.5)))
        : Math.min(10, Math.max(2, Math.ceil(ocrLines * 0.7)));

      // if (exactMatches < requiredMatches || matchRatio < 0.7) {
      //   throw new Error(
      //     "Page matching confidence is too low. Reading stopped.",
      //   );
      // }

      if (exactMatches < requiredMatches || matchRatio < 0.5) {
        throw new Error(
          "Page matching confidence is too low. Reading stopped.",
        );
      }

      const docxText = await extractDocxText(docxUrl);
      const paragraphs = getTextParagraphs(docxText);

      const indexes = matches.map((match) => match.paragraphIndex);

      console.log("DOCX MATCH SEQUENCE:", {
        pageNumber,
        indexes,
        backwardMatches: indexes
          .map((index, i) => ({
            previous: indexes[i - 1],
            current: index,
            ocrLine: matches[i]?.ocrLine,
          }))
          .filter(
            (item) =>
              item.previous !== undefined && item.current < item.previous,
          ),
      });

      // Matches should progress forward through the DOCX.
      for (let i = 1; i < indexes.length; i++) {
        if (indexes[i] < indexes[i - 1]) {
          throw new Error("DOCX matches are out of order. Reading stopped.");
        }
      }

      const firstMatch = matches[0];
      const lastMatch = matches[matches.length - 1];

      // const firstIndex = firstMatch.paragraphIndex;
      // const lastIndex = lastMatch.paragraphIndex;

      let firstIndex = firstMatch.paragraphIndex;
      const lastIndex = lastMatch.paragraphIndex;

      if ([14, 15, 31].includes(pageNumber)) {
        console.log("MISSING TEXT DEBUG:", {
          pageNumber,
          firstMatchedLine: firstMatch.ocrLine,
          firstMatchedParagraph: paragraphs[firstMatch.paragraphIndex],
          previousParagraphs: paragraphs.slice(
            Math.max(0, firstMatch.paragraphIndex - 4),
            firstMatch.paragraphIndex,
          ),
          firstMatchPosition: firstMatch.matchPosition,
          firstOCRLines: matchResult.ocrTextLines?.slice(0, 8),
        });
      }

      if (strictBoundaryRecovery) {
        firstIndex = Math.max(0, firstIndex - 2);
      }

      let includeStartingParagraph = false;

      const firstMatchedOCRIndex = matchResult.ocrTextLines.findIndex(
        (line) =>
          normalizeForMatching(line) ===
          normalizeForMatching(firstMatch.ocrLine),
      );

      const precedingOCRLines =
        firstMatchedOCRIndex > 0
          ? matchResult.ocrTextLines.slice(0, firstMatchedOCRIndex)
          : [];

      // if (precedingOCRLines.length > 0) {
      if (!strictBoundaryRecovery && precedingOCRLines.length > 0) {
        // First check for text before the match in the same paragraph.
        const firstParagraph = paragraphs[firstIndex];
        const normalizedFirst = normalizeWithPositions(firstParagraph);

        const matchStart = normalizedFirst.normalized.indexOf(
          normalizeForMatching(firstMatch.ocrLine),
        );

        if (matchStart > 0) {
          const prefix = firstParagraph.slice(
            0,
            normalizedFirst.positions[matchStart],
          );

          if (isOCRSupportedParagraph(prefix, precedingOCRLines, language)) {
            includeStartingParagraph = true;
          }
        }

        // Check up to two preceding DOCX paragraphs.
        // Stop immediately when OCR cannot verify a paragraph.
        for (let i = firstIndex - 1; i >= Math.max(0, firstIndex - 2); i--) {
          if (
            !isOCRSupportedParagraph(paragraphs[i], precedingOCRLines, language)
          ) {
            break;
          }

          firstIndex = i;
          includeStartingParagraph = true;
        }
      }

      const selectedParagraphs = paragraphs.slice(firstIndex, lastIndex + 1);

      const combinedText = selectedParagraphs.join("\n\n");
      const mapped = normalizeWithPositions(combinedText);

      const normalizedStart = normalizeForMatching(firstMatch.ocrLine);

      const normalizedEnd = normalizeForMatching(lastMatch.ocrLine);

      const startPosition = mapped.normalized.indexOf(normalizedStart);

      const endPosition = mapped.normalized.lastIndexOf(normalizedEnd);

      if (
        startPosition === -1 ||
        endPosition === -1 ||
        endPosition < startPosition
      ) {
        throw new Error("Unable to identify clean page boundaries.");
      }

      // const originalStart = mapped.positions[startPosition];

      // const originalStart = includeStartingParagraph
      //   ? 0
      //   : mapped.positions[startPosition];

      // const originalStart =
      //   includeStartingParagraph && firstIndex === firstMatch.paragraphIndex
      //     ? 0
      //     : mapped.positions[startPosition];

      let originalStart =
        includeStartingParagraph && firstIndex === firstMatch.paragraphIndex
          ? 0
          : mapped.positions[startPosition];

      if (strictBoundaryRecovery && precedingOCRLines.length > 0) {
        const candidates = precedingOCRLines
          .map((line) => normalizeForMatching(line))
          .filter((line) => line.length >= 28);

        let earliestVerifiedPosition = startPosition;

        for (const line of candidates) {
          const firstAnchor = line.slice(0, 12);
          const lastAnchor = line.slice(-12);

          const searchFrom = Math.max(0, startPosition - 700);
          const firstPos = mapped.normalized.indexOf(firstAnchor, searchFrom);

          if (firstPos < 0 || firstPos >= startPosition) continue;

          const lastPos = mapped.normalized.indexOf(
            lastAnchor,
            firstPos + firstAnchor.length,
          );

          if (
            lastPos < 0 ||
            lastPos >= startPosition ||
            lastPos - firstPos > line.length * 1.5
          ) {
            continue;
          }

          earliestVerifiedPosition = Math.min(
            earliestVerifiedPosition,
            firstPos,
          );
        }

        originalStart = mapped.positions[earliestVerifiedPosition];

        console.log(
          "STRICT START CANDIDATES FULL:",
          JSON.stringify(
            {
              pageNumber,
              precedingOCRLines,
              selectedParagraphs: selectedParagraphs.slice(0, 4),
              firstMatchIndex: firstMatch.paragraphIndex,
              selectedFirstIndex: firstIndex,
              firstMatchPosition: firstMatch.matchPosition,
            },
            null,
            2,
          ),
        );

        console.log("STRICT BOUNDARY RECOVERY:", {
          pageNumber,
          recovered: earliestVerifiedPosition < startPosition,
          firstMatchedOCR: firstMatch.ocrLine,
          recoveredStart: combinedText.slice(
            originalStart,
            originalStart + 180,
          ),
        });
      }

      // Product 29 only: recover verified Sanskrit lines before first exact match.
      if (strictBoundaryRecovery && precedingOCRLines.length > 0) {
        const ocrCandidates = precedingOCRLines.filter((line) => {
          const normalized = normalizeForMatching(line);

          return (
            normalized.length >= 18 &&
            !normalized.includes(
              normalizeForMatching("भगवद्गीता - जशी आहे तशी"),
            )
          );
        });

        let earliestParagraphIndex = firstMatch.paragraphIndex;

        for (
          let index = firstMatch.paragraphIndex - 1;
          index >= firstIndex;
          index--
        ) {
          const paragraph = paragraphs[index];

          const verified = ocrCandidates.some(
            (line) => getBoundarySimilarity(line, paragraph) >= 0.78,
          );

          if (!verified) break;

          earliestParagraphIndex = index;
        }

        if (earliestParagraphIndex < firstMatch.paragraphIndex) {
          const localIndex = earliestParagraphIndex - firstIndex;

          const recoveredStart = selectedParagraphs
            .slice(0, localIndex)
            .reduce((length, paragraph) => length + paragraph.length + 2, 0);

          originalStart = Math.min(originalStart, recoveredStart);

          console.log("GITA SHLOK RECOVERY:", {
            pageNumber,
            earliestParagraphIndex,
            recoveredText: combinedText.slice(
              originalStart,
              originalStart + 200,
            ),
          });
        }
      }

      const endCharacterIndex = endPosition + normalizedEnd.length - 1;

      const originalEnd = mapped.positions[endCharacterIndex] + 1;

      const cleanText = combinedText.slice(originalStart, originalEnd).trim();

      if (hanumanShortLineMatching && pageNumber >= 13) {
        console.log("HANUMAN BOUNDARY AUDIT:", {
          pageNumber,
          firstIndex,
          lastIndex,
          firstMatchParagraph: firstMatch.paragraphIndex,
          lastMatchParagraph: lastMatch.paragraphIndex,
          firstMatchOCR: firstMatch.ocrLine,
          lastMatchOCR: lastMatch.ocrLine,
          startPosition,
          endPosition,
          originalStart,
          originalEnd,
          selectedParagraphCount: selectedParagraphs.length,
          selectedParagraphs: selectedParagraphs.map((text, index) => ({
            index: firstIndex + index,
            text: text.slice(0, 160),
          })),
          cleanText,
        });
      }

      if ([10, 11, 12].includes(pageNumber)) {
        console.log("MARATHI PAGE BOUNDARY DEBUG:", {
          pageNumber,
          firstMatchedOCR: firstMatch.ocrLine,
          firstMatchedParagraph: paragraphs[firstMatch.paragraphIndex],
          firstMatchIndex: firstMatch.paragraphIndex,
          selectedFirstIndex: firstIndex,
          includeStartingParagraph,
          startPosition,
          originalStart,
          extractedStart: cleanText.slice(0, 250),
        });
      }

      if (!cleanText) {
        throw new Error("Clean page text is empty.");
      }

      return {
        pageNumber,
        text: cleanText,
        exactMatches,
        ocrLines,
        firstIndex,
        lastIndex,
      };
    })();

    documentCache.set(cacheKey, request);
  }

  try {
    return await documentCache.get(cacheKey);
  } catch (err) {
    documentCache.delete(cacheKey);
    throw err;
  }
}
