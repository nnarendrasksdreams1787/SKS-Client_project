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

const ocrPageCache = new WeakMap();
let ocrWorkerPromise = null;

async function getOCRWorker() {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = createWorker(["mar", "hin"]).catch((err) => {
      ocrWorkerPromise = null;
      throw err;
    });
  }

  return ocrWorkerPromise;
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



export async function getReadablePageText({
  docxUrl,
  pdfDocument,
  pageNumber,
}) {
  if (!pdfDocument || !pageNumber) {
    throw new Error("PDF document and page number are required.");
  }

  if (!docxUrl) {
    throw new Error(
      "Clean DOCX text is unavailable for this book."
    );
  }

  const result = await extractVerifiedDocxPage({
    docxUrl,
    pdfDocument,
    pageNumber,
  });
  

  if (!result.text?.trim()) {
    throw new Error("No readable text found on this page.");
  }

  return result.text;
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

export async function testPageOCR(pdfDocument, pageNumber) {
  if (
    !pdfDocument ||
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > pdfDocument.numPages
  ) {
    throw new Error("Valid PDF document and page number are required.");
  }

  let pageCache = ocrPageCache.get(pdfDocument);

  if (!pageCache) {
    pageCache = new Map();
    ocrPageCache.set(pdfDocument, pageCache);
  }

  if (!pageCache.has(pageNumber)) {
    const request = (async () => {
      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });

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

        const worker = await getOCRWorker();
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

    pageCache.set(pageNumber, request);
  }

  try {
    const result = await pageCache.get(pageNumber);

    console.log("OCR PAGE:", pageNumber);
    console.log("OCR CONFIDENCE:", result.confidence);
    console.log("OCR TEXT:", result.text);

    return result.text;
  } catch (error) {
    pageCache.delete(pageNumber);
    throw error;
  }
}

function normalizeForMatching(text) {
  return text
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();
}

function getTextParagraphs(text) {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 20);
}

export async function testDocxPageMatch({ docxUrl, pdfDocument, pageNumber }) {
  if (!docxUrl || !pdfDocument || !pageNumber) {
    throw new Error("DOCX URL, PDF document and page number are required.");
  }

  const ocrText = await testPageOCR(pdfDocument, pageNumber);
  const docxText = await extractDocxText(docxUrl);

  const ocrLines = ocrText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => normalizeForMatching(line).length > 25);

  const paragraphs = getTextParagraphs(docxText);

  const matches = [];

  for (const ocrLine of ocrLines) {
    const normalizedOCR = normalizeForMatching(ocrLine);

    for (let i = 0; i < paragraphs.length; i++) {
      const normalizedDOCX = normalizeForMatching(paragraphs[i]);

      if (normalizedDOCX.includes(normalizedOCR)) {
        matches.push({
          ocrLine,
          paragraphIndex: i,
          docxParagraph: paragraphs[i],
        });

        break;
      }
    }
  }

  console.log("PAGE MATCH TEST:", pageNumber);
  console.log("OCR LINES:", ocrLines.length);
  console.log("EXACT MATCHES:", matches.length);
  console.log("MATCH DETAILS:", matches);

  return {
    pageNumber,
    ocrLines: ocrLines.length,
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
      .replace(/[^\p{L}\p{N}]/gu, "")
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

const cleanPageTextCache = new WeakMap();

export async function extractVerifiedDocxPage({
  docxUrl,
  pdfDocument,
  pageNumber,
}) {
  if (!docxUrl || !pdfDocument || !pageNumber) {
    throw new Error("PDF, DOCX and page number are required.");
  }

  let documentCache = cleanPageTextCache.get(pdfDocument);

  if (!documentCache) {
    documentCache = new Map();
    cleanPageTextCache.set(pdfDocument, documentCache);
  }

  const cacheKey = `${docxUrl}:${pageNumber}`;

  if (!documentCache.has(cacheKey)) {
    const request = (async () => {
      const matchResult = await testDocxPageMatch({
        docxUrl,
        pdfDocument,
        pageNumber,
      });

      const {
        matches,
        ocrLines,
        exactMatches,
      } = matchResult;

      if (
        exactMatches < 10 ||
        exactMatches / ocrLines < 0.7
      ) {
        throw new Error(
          "Page matching confidence is too low. Reading stopped."
        );
      }

      const docxText = await extractDocxText(docxUrl);
      const paragraphs = getTextParagraphs(docxText);

      const indexes = matches.map(
        (match) => match.paragraphIndex
      );

      // Matches should progress forward through the DOCX.
      for (let i = 1; i < indexes.length; i++) {
        if (indexes[i] < indexes[i - 1]) {
          throw new Error(
            "DOCX matches are out of order. Reading stopped."
          );
        }
      }

      const firstMatch = matches[0];
      const lastMatch = matches[matches.length - 1];

      const firstIndex = firstMatch.paragraphIndex;
      const lastIndex = lastMatch.paragraphIndex;

      const selectedParagraphs = paragraphs.slice(
        firstIndex,
        lastIndex + 1
      );

      const combinedText = selectedParagraphs.join("\n\n");
      const mapped = normalizeWithPositions(combinedText);

      const normalizedStart = normalizeForMatching(
        firstMatch.ocrLine
      );

      const normalizedEnd = normalizeForMatching(
        lastMatch.ocrLine
      );

      const startPosition = mapped.normalized.indexOf(
        normalizedStart
      );

      const endPosition = mapped.normalized.lastIndexOf(
        normalizedEnd
      );

      if (
        startPosition === -1 ||
        endPosition === -1 ||
        endPosition < startPosition
      ) {
        throw new Error(
          "Unable to identify clean page boundaries."
        );
      }

      const originalStart = mapped.positions[startPosition];

      const endCharacterIndex =
        endPosition + normalizedEnd.length - 1;

      const originalEnd =
        mapped.positions[endCharacterIndex] + 1;

      const cleanText = combinedText
        .slice(originalStart, originalEnd)
        .trim();

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

