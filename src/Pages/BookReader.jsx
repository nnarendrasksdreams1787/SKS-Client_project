// import { forwardRef, useEffect, useRef, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
// import { products } from "../Data/products";
// import "../BookReader.css";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// const FlipPage = forwardRef(function FlipPage({ page, number }, ref) {
//   return (
//     <div className="flip-page" ref={ref}>
//       <div className="flip-page-content">
//         <img src={page} alt={`Book page ${number}`} draggable="false" />
//       </div>
//       <span className="flip-page-number">{number}</span>
//     </div>
//   );
// });

// export default function BookReader() {
//   const { id } = useParams();
//   const flipBookRef = useRef(null);

//   const [pages, setPages] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [zoom, setZoom] = useState(100);

//   function zoomIn() {
//     setZoom((current) => Math.min(current + 25, 200));
//   }

//   function zoomOut() {
//     setZoom((current) => Math.max(current - 25, 75));
//   }

//   function resetZoom() {
//     setZoom(100);
//   }

//   const product = products.find((item) => item.id === id);

//   useEffect(() => {
//     let cancelled = false;
//     let loadingTask;

//     async function loadPdf() {
//       setLoading(true);
//       setError("");
//       setPages([]);
//       setCurrentPage(0);

//       if (!product?.pdfUrl) {
//         setError("This book does not have a PDF available yet.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const pdfUrl = new URL(product.pdfUrl, window.location.origin).href;
//         loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
//         const pdf = await loadingTask.promise;
//         const renderedPages = [];

//         for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
//           if (cancelled) return;

//           const pdfPage = await pdf.getPage(pageNumber);
//           const viewport = pdfPage.getViewport({ scale: 1.15 });
//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");

//           canvas.width = Math.ceil(viewport.width);
//           canvas.height = Math.ceil(viewport.height);

//           await pdfPage.render({
//             canvasContext: context,
//             viewport,
//           }).promise;

//           renderedPages.push(canvas.toDataURL("image/jpeg", 0.88));
//           canvas.width = 0;
//           canvas.height = 0;
//         }

//         if (!cancelled) setPages(renderedPages);
//       } catch (err) {
//         console.error("PDF loading failed:", err);
//         if (!cancelled) {
//           setError(
//             "We couldn't open this PDF. Check the file path and try again.",
//           );
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadPdf();

//     return () => {
//       cancelled = true;
//       loadingTask?.destroy();
//     };
//   }, [product?.pdfUrl]);

//   function goPrevious() {
//     flipBookRef.current?.pageFlip()?.flipPrev();
//   }

//   function goNext() {
//     flipBookRef.current?.pageFlip()?.flipNext();
//   }

//   if (!product) {
//     return (
//       <main className="reader-message">
//         <h1>Book not found</h1>
//         <Link to="/">Return to SKS Dream</Link>
//       </main>
//     );
//   }

//   return (
//     <main className="reader-page">
//       <header className="reader-header">
//         <Link to="/" className="reader-back">
//           ← Back to SKS Dream
//         </Link>
//         <span className="reader-brand">SKS Dream</span>
//       </header>

//       <section className="reader-heading">
//         <p className="reader-eyebrow">DIGITAL LIBRARY</p>
//         <h1>{product.name}</h1>
//         <p>Settle in, turn the pages, and enjoy your reading experience.</p>
//       </section>

//       {loading && (
//         <div className="reader-message" role="status">
//           Preparing your book…
//         </div>
//       )}

//       {error && (
//         <div className="reader-message" role="alert">
//           <p>{error}</p>
//           <Link to="/">Return to products</Link>
//         </div>
//       )}

//       {!loading && !error && pages.length > 0 && (
//         <>
//           {/* Zooom Effects */}

//           <nav
//             className="reader-zoom-toolbar"
//             aria-label="Reading zoom controls"
//           >
//             <span className="reader-zoom-label">Reading View</span>

//             <div className="reader-zoom-actions">
//               <button
//                 type="button"
//                 onClick={zoomOut}
//                 disabled={zoom <= 75}
//                 aria-label="Zoom out"
//               >
//                 -
//               </button>

//               <span className="reader-zoom-level">{zoom}%</span>

//               <button
//                 type="button"
//                 onClick={zoomIn}
//                 disabled={zoom >= 200}
//                 aria-label="Zoom in"
//               >
//                 +
//               </button>

//               <button
//                 type="button"
//                 className="reader-zoom-reset"
//                 onClick={resetZoom}
//               >
//                 Reset
//               </button>
//             </div>
//           </nav>

//           <div className="reader-book-viewport">
//             <div className="reader-book-zoom" style={{ zoom: zoom / 100 }}>
//               <section className="book-stage" aria-label="Interactive book">
//                 <HTMLFlipBook
//                   ref={flipBookRef}
//                   width={380}
//                   height={520}
//                   size="stretch"
//                   minWidth={260}
//                   maxWidth={760}
//                   minHeight={360}
//                   maxHeight={620}
//                   showCover
//                   usePortrait
//                   mobileScrollSupport
//                   drawShadow
//                   flippingTime={650}
//                   maxShadowOpacity={0.45}
//                   onFlip={(event) => setCurrentPage(event.data)}
//                   className="book-flip"
//                 >
//                   {pages.map((page, index) => (
//                     <FlipPage key={index} page={page} number={index + 1} />
//                   ))}
//                 </HTMLFlipBook>
//               </section>
//             </div>
//           </div>

//           <nav className="reader-controls" aria-label="Book navigation">
//             <button
//               type="button"
//               onClick={goPrevious}
//               disabled={currentPage === 0}
//             >
//               ← Previous
//             </button>

//             <span>
//               Page {currentPage + 1} of {pages.length}
//             </span>

//             <button
//               type="button"
//               onClick={goNext}
//               disabled={currentPage >= pages.length - 1}
//             >
//               Next →
//             </button>
//           </nav>
//         </>
//       )}
//     </main>
//   );
// }

// import { forwardRef, useEffect, useRef, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
// // import { products } from "../Data/products";
// import { getBookById } from "../Services/BookService";
// import "../BookReader.css";

// import { translateToHindi } from "../Services/TranslationServices";

// import {
//   getReadablePageText,
//   extractDocxText,
//   testPageOCR,
//   testDocxPageMatch,
//   testCleanPageBoundaries,
//   extractVerifiedDocxPage,
// } from "../Services/BookTextService";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// // const FlipPage = forwardRef(function FlipPage({ page, number }, ref) {
// //   return (
// //     <div className="flip-page" ref={ref}>
// //       <div className="flip-page-content">
// //         <img src={page} alt={`Book page ${number}`} draggable="false" />
// //       </div>
// //       <span className="flip-page-number">{number}</span>
// //     </div>
// //   );
// // });

// const FlipPage = forwardRef(function FlipPage(
//   { pdfDocument, number, shouldRender },
//   ref
// ) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!pdfDocument || !shouldRender) return;

//     let cancelled = false;
//     let renderTask;

//     async function renderPage() {
//       try {
//         const pdfPage = await pdfDocument.getPage(number);

//         if (cancelled) return;

//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const viewport = pdfPage.getViewport({ scale: 1.5 });
//         const context = canvas.getContext("2d");

//         canvas.width = Math.ceil(viewport.width);
//         canvas.height = Math.ceil(viewport.height);

//         renderTask = pdfPage.render({
//           canvasContext: context,
//           viewport,
//         });

//         await renderTask.promise;
//       } catch (error) {
//         if (error?.name !== "RenderingCancelledException") {
//           console.error("Page rendering failed:", error);
//         }
//       }
//     }

//     renderPage();

//     return () => {
//       cancelled = true;
//       renderTask?.cancel();
//     };
//   }, [pdfDocument, number, shouldRender]);

//   return (
//     <div className="flip-page" ref={ref}>
//       <div className="flip-page-content">
//         <canvas ref={canvasRef} />
//       </div>
//       <span className="flip-page-number">{number}</span>
//     </div>
//   );
// });

// export default function BookReader() {
//   const { id } = useParams();
//   const flipBookRef = useRef(null);
//   const speechSessionRef = useRef(0);

//   const readingProgressRef = useRef({
//     pageNumber: null,
//     chunks: [],
//     chunkIndex: 0,
//     status: "idle",
//   })

//   const autoFlipRef = useRef(false);
//   const pendingAutoFlipSessionRef = useRef(null);

//   const readingQueueRef = useRef([]);

//   const pagePreparationCacheRef = useRef(new Map());

//   const [pages, setPages] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [zoom, setZoom] = useState(100);
//   const [pdfDocument, setPdfDocument] = useState(null);
//   const [totalPages, setTotalPages] = useState(0);
//   const [extractedText, setExtractedText] = useState("");
//   const [extracting, setExtracting] = useState(false);

//   const [docxText, setDocxText] = useState("");
//   const [docxLoading, setDocxLoading] = useState(false);
//   const [docxError, setDocxError] = useState("");

//   const [selectedLanguage, setSelectedLanguage] = useState("en");
//   const [translatedText, setTranslatedText] = useState("");
//   const [translating, setTranslating] = useState(false);
//   const [translationError, setTranslationError] = useState("");

//   const [translationProgress, setTranslationProgress] = useState("");

//   const [ttsLanguage, setTtsLanguage] = useState("en-IN");
//   const [ttsSpeed, setTtsSpeed] = useState(1);
//   const [ttsVoices, setTtsVoices] = useState([]);
//   const [selectedVoice, setSelectedVoice] = useState("");
//   const [ttsStatus, setTtsStatus] = useState("idle");

//   const [product, setProduct] = useState(null);
//   const [productLoading, setProductLoading] = useState(true);

//   function zoomIn() {
//     setZoom((current) => Math.min(current + 25, 200));
//   }

//   function zoomOut() {
//     setZoom((current) => Math.max(current - 25, 75));
//   }

//   function resetZoom() {
//     setZoom(100);
//   }

//   // const product = products.find((item) => item.id === id);

//   useEffect(() => {
//     let cancelled = false;

//     async function loadProduct() {
//       setProductLoading(true);

//       try {
//         const book = await getBookById(id);

//         if (!cancelled) {
//           setProduct(book);
//         }
//       } catch (error) {
//         console.error("Book loading failed:", error);

//         if (!cancelled) {
//           setProduct(null);
//         }
//       } finally {
//         if (!cancelled) {
//           setProductLoading(false);
//         }
//       }
//     }

//     loadProduct();

//     return () => {
//       cancelled = true;
//     };
//   }, [id]);

//   useEffect(() => {
//     if (!("speechSynthesis" in window)) return;

//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();

//       setTtsVoices(voices);

//       console.log(
//         "AVAILABLE TTS VOICES:",
//         voices.map((voice) => ({
//           name: voice.name,
//           lang: voice.lang,
//         }))
//       );
//     };

//     loadVoices();

//     window.speechSynthesis.addEventListener(
//       "voiceschanged",
//       loadVoices
//     );

//     return () => {
//       window.speechSynthesis.removeEventListener(
//         "voiceschanged",
//         loadVoices
//       );
//     };
//   }, []);

//   useEffect(() => {
//     let cancelled = false;
//     let loadingTask;

//     if (!product) return;

//     async function loadPdf() {
//       setLoading(true);
//       setError("");
//       setPages([]);
//       setCurrentPage(0);
//       setPdfDocument(null);
//       setTotalPages(0);
//       pagePreparationCacheRef.current.clear();

//       if (!product?.pdfUrl) {
//         setError("This book does not have a PDF available yet.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const pdfUrl = new URL(product.pdfUrl, window.location.origin).href;
//         loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
//         const pdf = await loadingTask.promise;

//         if (cancelled) return;

//         setPdfDocument(pdf);
//         setTotalPages(pdf.numPages);

//         // const renderedPages = [];

//         // for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
//         //   if (cancelled) return;

//         //   const pdfPage = await pdf.getPage(pageNumber);
//         //   const viewport = pdfPage.getViewport({ scale: 1.15 });
//         //   const canvas = document.createElement("canvas");
//         //   const context = canvas.getContext("2d");

//         //   canvas.width = Math.ceil(viewport.width);
//         //   canvas.height = Math.ceil(viewport.height);

//         //   await pdfPage.render({
//         //     canvasContext: context,
//         //     viewport,
//         //   }).promise;

//         //   renderedPages.push(canvas.toDataURL("image/jpeg", 0.88));
//         //   canvas.width = 0;
//         //   canvas.height = 0;
//         // }

//         // if (!cancelled) setPages(renderedPages);
//       } catch (err) {
//         if (cancelled || err?.name === "AbortException") {
//           return;
//         }

//         console.error("PDF loading failed:", err);

//         setError(
//           "We couldn't open this PDF. Check the file path and try again."
//         );

//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadPdf();

//     return () => {
//       cancelled = true;
//       loadingTask?.destroy();
//     };
//   }, [product?.pdfUrl]);

//   function goPrevious() {
//     flipBookRef.current?.pageFlip()?.flipPrev();
//   }

//   function goNext() {
//     flipBookRef.current?.pageFlip()?.flipNext();
//   }

//   // async function extractCurrentPageText() {
//   //   if (!pdfDocument) return;

//   //   try {
//   //     setExtracting(true);

//   //     const pageNumber = currentPage + 1;

//   //     const pdfPage = await pdfDocument.getPage(pageNumber);

//   //     const textContent = await pdfPage.getTextContent();

//   //     const text = textContent.items
//   //       .map((item) => item.str || "")
//   //       .join(" ");

//   //     setExtractedText(text);

//   //     console.log("PDF PAGE:", pageNumber);
//   //     console.log("EXTRACTED TEXT:", text);
//   //     console.log("TEXT ITEMS:", textContent.items);

//   //   } catch (error) {
//   //     console.error("Text extraction failed:", error);
//   //   } finally {
//   //     setExtracting(false);
//   //   }
//   // }

//   async function handleReadDocx() {

//     if (!product?.docxUrl) return;

//     try {
//       setDocxLoading(true);
//       setDocxError("")

//       const text = await extractDocxText(product.docxUrl);
//       setDocxText(text);
//     } catch (error) {
//       console.error("DOCX extraction failed:", error);
//       setDocxError(error.message || "Unable to read DOCX.");
//     } finally {
//       setDocxLoading(false);
//     }

//   }

//   async function handleTestOCR() {
//     if (!pdfDocument) return;

//     try {
//       const pageNumber = currentPage + 1;

//       console.log("STARTING OCR TEST:", pageNumber);

//       const text = await testPageOCR(pdfDocument, pageNumber);

//       console.log("FINAL OCR RESULT:", text);
//     } catch (error) {
//       console.error("OCR TEST FAILED:", error);
//     }
//   }

//   console.log("BOOK PRODUCT:", product);
//   console.log("PDF READY:", Boolean(pdfDocument));
//   console.log("DOCX URL:", product?.docxUrl);

//   async function handleTestDocxMatch() {
//     if (!pdfDocument || !product.docxUrl) {
//       console.error("PDF or DOCX is missing.")
//       return;
//     }

//     try {
//       const result = await testDocxPageMatch({
//         docxUrl: product.docxUrl,
//         pdfDocument,
//         pageNumber: currentPage + 1,
//       });

//       console.log("Final MATCH RESULT:", result);

//     } catch (error) {
//       console.error("DOCX MATCH FAILED:", error);
//     }
//   }

//   async function handleTestPageBoundaries() {
//     if (!pdfDocument || !product?.docxUrl) return;

//     try {
//       const result = await testCleanPageBoundaries({
//         docxUrl: product.docxUrl,
//         pdfDocument,
//         pageNumber: currentPage + 1,
//       });

//       console.log("PAGE BOUNDARY RESULT:", result);
//     } catch (error) {
//       console.error("PAGE BOUNDARY TEST FAILED:", error);
//     }
//   }

//   async function handleTestCleanPage() {
//     if (!pdfDocument || !product?.docxUrl) {
//       console.error("PDF or DOCX is missing.");
//       return;
//     }

//     try {
//       const result = await extractVerifiedDocxPage({
//         docxUrl: product.docxUrl,
//         pdfDocument,
//         pageNumber: currentPage + 1,
//       });

//       console.log("CLEAN PAGE NUMBER:", result.pageNumber);
//       console.log("CLEAN PAGE TEXT:", result.text);
//       console.log(
//         "MATCH COVERAGE:",
//         `${result.exactMatches}/${result.ocrLines}`
//       );

//       setExtractedText(result.text);
//     } catch (err) {
//       console.error("CLEAN PAGE TEST FAILED:", err);
//       alert(err.message);
//     }
//   }

//   // async function extractCurrentPageText() {
//   //   if (!pdfDocument) return;

//   //   try {
//   //     setExtracting(true);

//   //     // Clear previous results.
//   //     setExtractedText("");
//   //     setTranslatedText("");
//   //     setTranslationError("");

//   //     const pageNumber = currentPage + 1;

//   //     const pdfPage = await pdfDocument.getPage(pageNumber);

//   //     const textContent = await pdfPage.getTextContent();

//   //     const lines = [];
//   //     let currentLine = [];
//   //     let previousY = null;

//   //     for (const item of textContent.items) {
//   //       if (typeof item.str !== "string") continue;

//   //       const text = item.str.trim();

//   //       if (!text) continue;

//   //       // PDF.js stores text positions in transform.
//   //       const currentY = item.transform?.[5];

//   //       if (typeof currentY !== "number") {
//   //         if (currentLine.length > 0) {
//   //           lines.push(currentLine.join(" "));
//   //           currentLine = [];
//   //         }

//   //         lines.push(text);
//   //         previousY = null;
//   //         continue;
//   //       }

//   //       // Detect when text moves to another line.
//   //       const isNewLine =
//   //         previousY !== null &&
//   //         Math.abs(currentY - previousY) > 3;

//   //       if (isNewLine && currentLine.length > 0) {
//   //         lines.push(currentLine.join(" "));
//   //         currentLine = [];
//   //       }

//   //       currentLine.push(text);

//   //       previousY = currentY;

//   //       // Some PDF.js text items explicitly end a line.
//   //       if (item.hasEOL) {
//   //         lines.push(currentLine.join(" "));
//   //         currentLine = [];
//   //         previousY = null;
//   //       }
//   //     }

//   //     // Include any remaining text.
//   //     if (currentLine.length > 0) {
//   //       lines.push(currentLine.join(" "));
//   //     }

//   //     const structuredText = lines.join("\n");

//   //     setExtractedText(structuredText);

//   //     console.log("PDF PAGE:", pageNumber);
//   //     console.log("STRUCTURED PDF TEXT:", structuredText);
//   //     console.log("TEXT ITEMS:", textContent.items);

//   //   } catch (error) {
//   //     console.error("Text extraction failed:", error);
//   //   } finally {
//   //     setExtracting(false);
//   //   }
//   // }

//   async function extractCurrentPageText() {
//     if (!pdfDocument) return;

//     try {
//       setExtracting(true);
//       setExtractedText("");
//       setTranslatedText("");
//       setTranslationError("");

//       const pageNumber = currentPage + 1;

//       const cleanText = await getReadablePageText({
//         docxUrl: product?.docxUrl,
//         pdfDocument,
//         pageNumber,
//       });

//       setExtractedText(cleanText);

//       console.log("CLEAN PAGE:", pageNumber);
//       console.log("CLEAN TEXT:", cleanText);
//     } catch (error) {
//       console.error("Clean text extraction failed:", error);
//       alert(error.message || "Unable to extract page text.");
//     } finally {
//       setExtracting(false);
//     }
//   }

//   // async function handleSpeakPage() {
//   //   if (!pdfDocument) {
//   //     alert("PDF is not ready yet.");
//   //     return;
//   //   }

//   //   if (!("speechSynthesis" in window)) {
//   //     alert("Text-to-Speech is not supported in this browser.");
//   //     return;
//   //   }

//   //   try {
//   //     // stop any previous speech
//   //     window.speechSynthesis.cancel();

//   //     // Get the current PDF page.
//   //     const pageNumber = currentPage + 1
//   //     const pdfPage = await pdfDocument.getPage(pageNumber);

//   //     // Extract text directly from PDF.js
//   //     const textContent = await pdfPage.getTextContent();

//   //     const pageText = textContent.items
//   //       .map((item) => item.str || "")
//   //       .join(" ")
//   //       .trim();

//   //     if (!pageText) {
//   //       alert("No readable text found on this page.");
//   //       return;
//   //     }

//   //     // Create speech.

//   //     const utterance = new SpeechSynthesisUtterance(pageText);

//   //     utterance.lang = "en-IN";
//   //     utterance.rate = 1;
//   //     utterance.pitch = 1;
//   //     utterance.volume = 1;

//   //     utterance.onerror = (event) => {
//   //       if (event.error !== "canceled") {
//   //         console.error("TTS error:", event.error);
//   //       }
//   //     };

//   //     window.speechSynthesis.speak(utterance);

//   //     console.log("TTS PAGE:", pageNumber);
//   //     console.log("TTS TEST:", pageText);

//   //   } catch (error) {
//   //     console.error("TTS failed: ", error);
//   //     alert("Unable to read this page aloud.");
//   //   }
//   // }

//   // function handleStopSpeech() {
//   //   window.speechSynthesis.cancel();
//   // }

//   function getVisiblePageNumbers() {
//     const flipInstance = flipBookRef.current?.pageFlip();

//     if (!flipInstance || !totalPages) {
//       return [];
//     }

//     const currentIndex = flipInstance.getCurrentPageIndex();
//     const orientation = flipInstance.getOrientation();

//     if (currentIndex < 0 || currentIndex >= totalPages) {
//       return [];
//     }

//     const firstPage = currentIndex + 1;

//     // Mobile: one page at a time.
//     if (orientation === "portrait") {
//       return [firstPage];
//     }

//     // if (secondPage <= totalPages) {
//     //   return [firstPage, secondPage];
//     // }

//     // return [firstPage];

//     // Desktop: cover is displayed alon
//     if (currentIndex === 0) {
//       return [1];
//     }

//     // Desktop: two-page spread
//     const secondPage = firstPage + 1;

//     return secondPage <= totalPages
//       ? [firstPage, secondPage]
//       : [firstPage];

//   }

//   function flipToNextReadingPages() {
//     const flipInstance = flipBookRef.current?.pageFlip();

//     if (!flipInstance) return false;

//     const visiblePages = getVisiblePageNumbers();

//     if (!visiblePages.length) return false;

//     const lastVisiblePage = visiblePages[visiblePages.length - 1];

//     if (lastVisiblePage >= totalPages) {
//       return false;
//     }

//     autoFlipRef.current = true;

//     flipInstance.flipNext();

//     return true;

//   }

//   function preparePageForSpeech(pageNumber) {
//     if (!pdfDocument || !product?.docxUrl) {
//       return Promise.reject(
//         new Error("PDF or DOCX is not ready.")
//       )
//     }

//     const cache = pagePreparationCacheRef.current;

//     // Already prepared or currently preperting

//     if (cache.has(pageNumber)) {
//       return cache.get(pageNumber);
//     }

//     console.log("BACKGROUND PREPARATION START:", pageNumber);

//     const preparationPromise = getReadablePageText({
//       docxUrl: product.docxUrl,
//       pdfDocument,
//       pageNumber,
//     })
//       .then((text) => {
//         if (!text?.trim()) {
//           throw new Error(
//             `No readable text found on Page ${pageNumber}`
//           )
//         }

//         console.log("BACKGROUND PREPARATION READY:", pageNumber);

//         return text.trim();
//       }).catch((error) => {
//         //Failed results should not stay cached.

//         if (cache.get(pageNumber) === preparationPromise) {
//           cache.delete(pageNumber);
//         }

//         throw error;
//       })

//     cache.set(pageNumber, preparationPromise);

//     return preparationPromise;

//   }

//   function preloadUpcomingPage(pageNumber, sessionId) {

//     if (
//       !pageNumber ||
//       pageNumber < 1 ||
//       pageNumber > totalPages
//     ) {
//       return;
//     }

//     preparePageForSpeech(pageNumber).catch((error) => {

//       if (sessionId !== speechSessionRef.current) return;

//       console.warn(
//         "BACKGROUND PAGE PREPARATION FAILED:",
//         pageNumber,
//         error,
//       )
//     })
//   }

//   function completeReadingPage(sessionId) {
//     if (sessionId !== speechSessionRef.current) return;

//     const nextPageNumber = readingQueueRef.current.shift();

//     if (nextPageNumber) {
//       readNextVisiblePage(nextPageNumber, sessionId);
//       return;
//     }

//     const visiblePages = getVisiblePageNumbers();

//     if (!visiblePages.length) {
//       readingProgressRef.current.status = "idle";
//       setTtsStatus("idle");
//       return;
//     }

//     const lastVisiblePage = visiblePages[visiblePages.length - 1];

//     if (lastVisiblePage >= totalPages) {
//       readingProgressRef.current.status = "idle";
//       setTtsStatus("idle");
//       console.log("BOOK READING COMPLETED");
//       return;
//     }

//     pendingAutoFlipSessionRef.current = sessionId;

//     readingProgressRef.current.status = "loading";
//     setTtsStatus("loading");

//     const flipped = flipToNextReadingPages();

//     if (!flipped) {
//       pendingAutoFlipSessionRef.current = null;
//       readingProgressRef.current.status = "idle";
//       setTtsStatus("idle");
//     }
//   }

//   async function readNextVisiblePage(pageNumber, sessionId) {

//     const synth = window.speechSynthesis;

//     try {

//       if (sessionId !== speechSessionRef.current) return;

//       setTtsStatus("loading");

//       // const pageText = await getReadablePageText({
//       //   docxUrl: product?.docxUrl,
//       //   pdfDocument,
//       //   pageNumber,
//       // });

//       console.log("Using PREPARE PAGE:", pageNumber);

//       const pageText = await preparePageForSpeech(pageNumber)

//       if (sessionId !== speechSessionRef.current) return;

//       console.group(`NARRATION AUDIT — PAGE ${pageNumber}`);

//       console.log("PAGE NUMBER:", pageNumber);
//       console.log("TEXT LENGTH:", pageText?.length ?? 0);
//       console.log("FULL TEXT FOR NARRATION:");
//       console.log(pageText);

//       console.groupEnd();

//       if (sessionId !== speechSessionRef.current) return;

//       if (!pageText?.trim()) {
//         throw new Error(`No readable text found on page ${pageNumber}`);
//       }

//       const chunks = [];
//       const maxChunkLength = 200;
//       let remainingText = pageText.trim();

//       while (remainingText.length > 0) {
//         if (remainingText.length <= maxChunkLength) {
//           chunks.push(remainingText);
//           break;
//         }

//         let splitAt = remainingText.lastIndexOf(" ", maxChunkLength);

//         if (splitAt <= 0) splitAt = maxChunkLength;

//         const chunk = remainingText.slice(0, splitAt).trim();

//         if (chunk) chunks.push(chunk);

//         remainingText = remainingText.slice(splitAt).trim();
//       }

//       readingProgressRef.current = {
//         pageNumber,
//         chunks,
//         chunkIndex: 0,
//         status: "loading",
//       };

//       const upcomingPage =
//         readingQueueRef.current[0] ||
//         (pageNumber < totalPages ? pageNumber + 1 : null);

//       preloadUpcomingPage(upcomingPage, sessionId);

//       // if (upcomingPage) {
//       //   preparePageForSpeech(upcomingPage).catch((error) => {
//       //     if (sessionId !== speechSessionRef.current) return;

//       //     console.warn(
//       //       "UPCOMING PAGE PREPARATION FAILED:",
//       //       upcomingPage,
//       //       error
//       //     )

//       //   })
//       // }

//       const voice =
//         ttsVoices.find(
//           (item) =>
//             item.name === selectedVoice &&
//             item.lang.toLowerCase().startsWith(
//               ttsLanguage.split("-")[0].toLowerCase()
//             )
//         ) ||
//         ttsVoices.find(
//           (item) =>
//             item.lang.toLowerCase() === ttsLanguage.toLowerCase()
//         );

//       let chunkIndex = 0;

//       const speakNextChunk = () => {
//         if (sessionId !== speechSessionRef.current) return;

//         readingProgressRef.current.chunkIndex = chunkIndex;

//         // if (chunkIndex >= chunks.length) {
//         //   console.log("TTS PAGE COMPLETED:", pageNumber);

//         //   const nextPageNumber = readingQueueRef.current.shift();

//         //   if (nextPageNumber) {
//         //     readNextVisiblePage(nextPageNumber, sessionId);
//         //   } else {
//         //     readingProgressRef.current.status = "idle";
//         //     setTtsStatus("idle");
//         //     console.log("VISIBLE PAGES READING COMPLETED");
//         //   }

//         //   return;
//         // }

//         if (chunkIndex >= chunks.length) {
//           console.log("TTS PAGE COMPLETED:", pageNumber);

//           completeReadingPage(sessionId);
//           return;
//         }

//         const utterance = new SpeechSynthesisUtterance(
//           chunks[chunkIndex]
//         );

//         utterance.lang = ttsLanguage;
//         utterance.rate = ttsSpeed;
//         utterance.pitch = 1;
//         utterance.volume = 1;

//         if (voice) utterance.voice = voice;

//         utterance.onstart = () => {
//           if (sessionId !== speechSessionRef.current) return;

//           readingProgressRef.current.status = "playing";
//           setTtsStatus("playing");
//         };

//         // utterance.onend = () => {
//         //   if (sessionId !== speechSessionRef.current) return;

//         //   chunkIndex += 1;
//         //   speakNextChunk();
//         // };

//         utterance.onend = () => {
//           if (sessionId !== speechSessionRef.current) return;

//           console.log("TTS CHUNK COMPLETED:", {
//             pageNumber,
//             chunkNumber: chunkIndex + 1,
//             totalChunks: chunks.length,
//           });

//           chunkIndex += 1;
//           speakNextChunk();
//         };

//         utterance.onerror = (event) => {
//           if (sessionId !== speechSessionRef.current) return;

//           console.error("TTS error:", event.error);
//           readingProgressRef.current.status = "idle";
//           setTtsStatus("idle");
//         };

//         synth.speak(utterance);
//       };

//       console.log("TTS PAGE:", pageNumber);
//       speakNextChunk();

//     } catch (error) {
//       if (sessionId !== speechSessionRef.current) return;

//       console.error("Next page reading failed:", error);
//       readingQueueRef.current = [];
//       readingProgressRef.current.status = "idle";
//       setTtsStatus("idle");
//     }
//   }

//   async function handleSpeakPage() {
//     if (!pdfDocument) return;

//     if (!("speechSynthesis" in window)) {
//       alert("Text-to-Speech is not supported in this browser.");
//       return;
//     }

//     const synth = window.speechSynthesis;

//     // Resume from paused position.
//     // if (synth.paused) {
//     //   synth.resume();
//     //   setTtsStatus("playing");
//     //   return;
//     // }

//     if (ttsStatus === "paused") {
//       // console.log("RESUME REQUEST: ", {
//       //   paused: synth.paused,
//       //   speaking: synth.speaking,
//       //   pending: synth.pending,
//       // })

//       const progress = readingProgressRef.current;

//       if (!progress.chunks.length) {
//         setTtsStatus("idle");
//         return;
//       }

//       // if (synth.paused) {
//       //   synth.resume();
//       //   setTtsStatus("playing");
//       // }
//       // else {
//       //   console.warn("Resume requested, but browser has no paused speech.")
//       // }

//       const sessionId = ++speechSessionRef.current;

//       const voice =
//         ttsVoices.find(
//           (item) =>
//             item.name === selectedVoice &&
//             item.lang.toLowerCase().startsWith(
//               ttsLanguage.split("-")[0].toLowerCase()
//             )
//         ) ||

//         ttsVoices.find(
//           (item) =>
//             item.lang.toLowerCase() === ttsLanguage.toLowerCase()
//         );

//       progress.status = "playing";
//       setTtsStatus("playing");

//       const resumeChunk = () => {
//         if (sessionId !== speechSessionRef.current) return;

//         // if (progress.chunkIndex >= progress.chunks.length) {
//         //   progress.status = "idle";
//         //   setTtsStatus("idle");
//         //   return;
//         // }

//         if (progress.chunkIndex >= progress.chunks.length) {
//           console.log("RESUMED PAGE COMPLETED:", progress.pageNumber);

//           completeReadingPage(sessionId);
//           return;
//         }

//         console.log("TTS CHUNK AUDIT:", {
//           pageNumber,
//           chunkNumber: chunkIndex + 1,
//           totalChunks: chunks.length,
//           text: chunks[chunkIndex],
//         });

//         const utterance = new SpeechSynthesisUtterance(
//           progress.chunks[progress.chunkIndex]
//         );

//         utterance.lang = ttsLanguage;
//         utterance.rate = ttsSpeed;
//         utterance.pitch = 1;
//         utterance.volume = 1;

//         if (voice) utterance.voice = voice;

//         utterance.onend = () => {
//           if (sessionId !== speechSessionRef.current) return;

//           progress.chunkIndex += 1;
//           resumeChunk();
//         };

//         utterance.onerror = (event) => {
//           if (sessionId !== speechSessionRef.current) return;

//           console.error("Resume TTS error:", event.error);
//           progress.status = "idle";
//           setTtsStatus("idle");
//         };

//         synth.speak(utterance);
//       };

//       resumeChunk();

//       return;
//     }
//     // Avoid restarting speech when already playing.
//     if (synth.speaking || ttsStatus === "loading") {
//       return;
//     }

//     const sessionId = ++speechSessionRef.current;

//     const visiblePages = getVisiblePageNumbers();

//     if (!visiblePages.length) {
//       setTtsStatus("idle");
//       return;
//     }

//     readingQueueRef.current = [...visiblePages];

//     const firstPage = readingQueueRef.current.shift();

//     readingProgressRef.current.status = "loading";
//     setTtsStatus("loading");

//     readNextVisiblePage(firstPage, sessionId);

//     // try {
//     //   setTtsStatus("loading");

//     // const pageNumber = currentPage + 1;
//     // const pdfPage = await pdfDocument.getPage(pageNumber);
//     // const textContent = await pdfPage.getTextContent();

//     // console.table(
//     //   textContent.items.slice(0, 30).map((item, index) => ({
//     //     index,
//     //     text: item.str,
//     //     fontName: item.fontName,
//     //     hasEOL: item.hasEOL,
//     //   }))
//     // )

//     // const pageNumber = currentPage + 1;

//     // const pageNumber = readingQueueRef.current.shift();

//     // const pageText = await getReadablePageText({
//     //   docxUrl: product.docxUrl,
//     //   pdfDocument,
//     //   pageNumber,
//     // });

//     // if (sessionId !== speechSessionRef.current) return;

//     // const pageText = textContent.items
//     //   .map((item) => item.str || "")
//     //   .join(" ")
//     //   .replace(/\s+/g, " ")
//     //   .trim();

//     //   if (!pageText) {
//     //     setTtsStatus("idle");
//     //     alert("No readable text found on this page.");
//     //     return;
//     //   }

//     //   console.log("TTS PAGE:", pageNumber);
//     //   console.log("TTS TEXT LENGTH: ", pageText.length);
//     //   console.log("TTS TEXT:", pageText);

//     //   // Divide text into smaller pieces.
//     //   const maxChunkLength = 200;
//     //   const chunks = [];
//     //   let remainingText = pageText;

//     //   while (remainingText.length > 0) {
//     //     if (remainingText.length <= maxChunkLength) {
//     //       chunks.push(remainingText);
//     //       break;
//     //     }

//     //     let splitAt = remainingText.lastIndexOf(
//     //       " ",
//     //       maxChunkLength
//     //     );

//     //     if (splitAt <= 0) {
//     //       splitAt = maxChunkLength;
//     //     }

//     //     const chunk = remainingText.slice(0, splitAt).trim();

//     //     if (chunk) {
//     //       chunks.push(chunk);
//     //     }

//     //     remainingText = remainingText.slice(splitAt).trim();
//     //   }

//     //   console.log("TOTAL TTS CHUNKS:", chunks.length);

//     //   readingProgressRef.current = {
//     //     pageNumber,
//     //     chunks,
//     //     chunkIndex: 0,
//     //     status: "loading",
//     //   }

//     //   // Prepare the next visible page while this page is speaking.

//     //   // const nextPageToPrepare = readingProgressRef.current[0];

//     //   const nextPageToPrepare = readingQueueRef.current[0];

//     //   if (nextPageToPrepare) {
//     //     preparePageForSpeech(nextPageToPrepare).catch((error) => {
//     //       if (sessionId !== speechSessionRef.current) return;

//     //       console.warn(
//     //         "NEXT PAGE PREPARATION FAILED:",
//     //         nextPageToPrepare,
//     //         error
//     //       )
//     //     })
//     //   }

//     //   const voice =
//     //     ttsVoices.find(
//     //       (item) =>
//     //         item.name === selectedVoice &&
//     //         item.lang.toLowerCase().startsWith(
//     //           ttsLanguage.split("-")[0].toLowerCase()
//     //         )
//     //     ) ||
//     //     ttsVoices.find(
//     //       (item) =>
//     //         item.lang.toLowerCase() === ttsLanguage.toLowerCase()
//     //     );

//     //   let chunkIndex = 0;

//     //   const speakNextChunk = () => {
//     //     if (sessionId !== speechSessionRef.current) {
//     //       return;
//     //     }

//     //     readingProgressRef.current.chunkIndex = chunkIndex;

//     //     // if (chunkIndex >= chunks.length) {
//     //     //   setTtsStatus("idle");
//     //     //   console.log("TTS PAGE COMPLETED");
//     //     //   return;
//     //     // }

//     //     if (chunkIndex >= chunks.length) {

//     //       console.log("TTS PAGE COMPLETED:", pageNumber);

//     //       const nextPageNumber = readingQueueRef.current.shift();

//     //       if (!nextPageNumber) {
//     //         readingProgressRef.current.status = "idle";
//     //         setTtsStatus("idle");
//     //         console.log("VISIBLE PAGE READING COMPLETED");
//     //         return;
//     //       }

//     //       console.log("STARTING NEXT VISIBLE PAGE:", nextPageNumber);

//     //       readNextVisiblePage(nextPageNumber, sessionId);
//     //       return;

//     //     }

//     //     const utterance = new SpeechSynthesisUtterance(
//     //       chunks[chunkIndex]
//     //     );

//     //     utterance.lang = ttsLanguage;
//     //     utterance.rate = ttsSpeed;
//     //     utterance.pitch = 1;
//     //     utterance.volume = 1;

//     //     if (voice) {
//     //       utterance.voice = voice;
//     //     }

//     //     utterance.onstart = () => {
//     //       if (sessionId === speechSessionRef.current) {
//     //         readingProgressRef.current.status = "playing";
//     //         setTtsStatus("playing");
//     //       }
//     //     };

//     //     utterance.onend = () => {
//     //       if (sessionId !== speechSessionRef.current) {
//     //         return;
//     //       }

//     //       chunkIndex += 1;

//     //       speakNextChunk();
//     //     };

//     //     utterance.onerror = (event) => {
//     //       if (sessionId !== speechSessionRef.current) {
//     //         return;
//     //       }

//     //       console.error("TTS error:", event.error);
//     //       setTtsStatus("idle");
//     //     };

//     //     console.log(
//     //       `READING CHUNK ${chunkIndex + 1}/${chunks.length}`
//     //     );

//     //     synth.speak(utterance);
//     //   };

//     //   speakNextChunk();
//     // // } catch (error) {
//     // //   if (sessionId !== speechSessionRef.current) return;

//     // //   console.error("TTS failed:", error);
//     // //   setTtsStatus("idle");
//     // //   alert(error.message || "Unable to rea this page aloud.")
//     // // }

//     // const sessionId = ++speechSessionRef.current;

//     // const visiblePages = getVisiblePageNumbers();
//   }

//   // function handlePauseSpeech() {
//   //   if (!("speechSynthesis" in window)) return;

//   //   window.speechSynthesis.pause();
//   //   setTtsStatus("paused");
//   // }

//   function handleStopSpeech() {
//     if (!("speechSynthesis" in window)) return;

//     // Invalidate pending and future chunks.
//     speechSessionRef.current += 1;

//     pendingAutoFlipSessionRef.current = null;
//     autoFlipRef.current = false;

//     readingQueueRef.current = [];

//     readingProgressRef.current = {
//       pageNumber: null,
//       chunks: [],
//       chunkIndex: 0,
//       status: "idle",
//     }

//     window.speechSynthesis.cancel();

//     setTtsStatus("idle");
//   }

//   // function handlePauseSpeech() {
//   //   if (!("speechSynthesis" in window)) return;

//   //   const synth = window.speechSynthesis;

//   //   synth.pause();

//   //   console.log("PAUSE REQUEST: ", {
//   //     paused: synth.paused,
//   //     speaking: synth.speaking,
//   //     pending: synth.pending,
//   //   })

//   //   setTtsStatus("paused");
//   // }

//   function handlePauseSpeech() {
//     if (!("speechSynthesis" in window)) return;

//     if (readingProgressRef.current.status !== "playing") return;

//     // Cancle the current speech session, but preserve reading progress.

//     speechSessionRef.current += 1;

//     readingProgressRef.current.status = "paused";

//     window.speechSynthesis.cancel();

//     setTtsStatus("paused");

//   }

//   async function handleTranslate() {
//     if (!extractedText.trim()) {
//       alert("Please extract the PDF text first.");
//       return;
//     }

//     if (selectedLanguage === "en") {
//       setTranslatedText("");
//       setTranslationError("");
//       return;
//     }

//     try {
//       setTranslating(true);
//       setTranslationError("");

//       // const translated = await translateToHindi(extractedText);

//       // const testText =
//       //   "At the core of quantum information processing is the quantum bit, or qubit.";

//       // const testText = "The sun rises in the east.";

//       // const translated = await translateToHindi(testText);

//       setTranslationProgress("Preparing translation...");

//       const translated = await translateToHindi(
//         extractedText,
//         (completed, total) => {
//           setTranslationProgress(
//             `Translating ${completed} of ${total} chunks...`
//           );
//         }
//       );

//       setTranslatedText(translated);

//       console.log("HINDI TRANSLATION:", translated);

//     } catch (error) {
//       console.error("Translation failed:", error);

//       setTranslationError(
//         error?.message || "Unable to translate this page."
//       );

//     } finally {
//       setTranslating(false);
//       setTranslationProgress("");
//     }
//   }

//   if (productLoading) {
//     return (
//       <main className="reader-message">
//         <p>Loading your book...</p>
//       </main>
//     )
//   }

//   if (!product) {
//     return (
//       <main className="reader-message">
//         <h1>Book not found</h1>
//         <Link to="/">Return to SKS Dream</Link>
//       </main>
//     );
//   }

//   return (
//     <main className="reader-page">
//       <header className="reader-header">
//         <Link to="/" className="reader-back">
//           ← Back to SKS Dream
//         </Link>
//         <span className="reader-brand">SKS Dream</span>
//       </header>

//       <section className="reader-heading">
//         <p className="reader-eyebrow">DIGITAL LIBRARY</p>
//         <h1>{product.name}</h1>
//         <p>Settle in, turn the pages, and enjoy your reading experience.</p>
//       </section>

//       {loading && (
//         <div className="reader-message" role="status">
//           Preparing your book…
//         </div>
//       )}

//       {error && (
//         <div className="reader-message" role="alert">
//           <p>{error}</p>
//           <Link to="/">Return to products</Link>
//         </div>
//       )}

//       {/* {!loading && !error && pages.length > 0 && ( */}
//       {!loading && !error && pdfDocument && totalPages > 0 && (
//         <>
//           {/* Zooom Effects */}

//           <nav
//             className="reader-zoom-toolbar"
//             aria-label="Reading zoom controls"
//           >
//             <span className="reader-zoom-label">Reading View</span>

//             <div className="reader-zoom-actions">
//               <button
//                 type="button"
//                 onClick={zoomOut}
//                 disabled={zoom <= 75}
//                 aria-label="Zoom out"
//               >
//                 -
//               </button>

//               <span className="reader-zoom-level">{zoom}%</span>

//               <button
//                 type="button"
//                 onClick={zoomIn}
//                 disabled={zoom >= 200}
//                 aria-label="Zoom in"
//               >
//                 +
//               </button>

//               <button
//                 type="button"
//                 className="reader-zoom-reset"
//                 onClick={resetZoom}
//               >
//                 Reset
//               </button>
//             </div>
//           </nav>

//           <div className="reader-book-viewport">
//             <div className="reader-book-zoom" style={{ zoom: zoom / 100 }}>
//               <section className="book-stage" aria-label="Interactive book">
//                 <HTMLFlipBook
//                   ref={flipBookRef}
//                   width={380}
//                   height={520}
//                   size="stretch"
//                   minWidth={260}
//                   maxWidth={760}
//                   minHeight={360}
//                   maxHeight={620}
//                   showCover
//                   usePortrait
//                   mobileScrollSupport
//                   drawShadow
//                   flippingTime={650}
//                   maxShadowOpacity={0.45}
//                   // onFlip={(event) => {
//                   //   // window.speechSynthesis.cancel();
//                   //   // handleStopSpeech();

//                   //   // setCurrentPage(event.data);

//                   //   const isAutomaticFlip = autoFlipRef.current;

//                   //   autoFlipRef.current = false;

//                   //   if (!isAutomaticFlip) {
//                   //     handleStopSpeech();
//                   //   }

//                   //   setCurrentPage(event.data);

//                   //   console.log("FLIP SOURCE:", isAutomaticFlip ? "automatic" : "manual");

//                   //   const flipInstance = flipBookRef.current?.pageFlip();

//                   //   console.log("FLIPBOOK PAGE INFO:", {
//                   //     eventPageIndex: event.data,
//                   //     currentPageIndex: flipInstance?.getCurrentPageIndex(),
//                   //     orientation: flipInstance?.getOrientation(),
//                   //     pageCount: flipInstance?.getPageCount(),
//                   //   });

//                   //   console.log("VISIBLE PDF PAGES:", getVisiblePageNumbers());

//                   //   setExtractedText("");
//                   //   setTranslatedText("");
//                   //   setTranslationError("");
//                   // }}

//                   onFlip={(event) => {
//                     const isAutomaticFlip = autoFlipRef.current;

//                     autoFlipRef.current = false;

//                     setCurrentPage(event.data);

//                     setExtractedText("");
//                     setTranslatedText("");
//                     setTranslationError("");

//                     const visiblePages = getVisiblePageNumbers();

//                     console.log(
//                       "FLIP SOURCE:",
//                       isAutomaticFlip ? "automatic" : "manual"
//                     );

//                     console.log("VISIBLE PDF PAGES:", visiblePages);

//                     if (isAutomaticFlip) {
//                       const sessionId = pendingAutoFlipSessionRef.current;

//                       pendingAutoFlipSessionRef.current = null;

//                       if (
//                         sessionId === null ||
//                         sessionId !== speechSessionRef.current
//                       ) {
//                         return;
//                       }

//                       if (!visiblePages.length) {
//                         handleStopSpeech();
//                         return;
//                       }

//                       readingQueueRef.current = [...visiblePages];

//                       const firstPage = readingQueueRef.current.shift();

//                       readNextVisiblePage(firstPage, sessionId);
//                       return;
//                     }

//                     // Manual navigation.
//                     const wasReading = ["playing", "loading", "paused"].includes(
//                       readingProgressRef.current.status
//                     );

//                     handleStopSpeech();

//                     // Don't start narration if the reader was already stopped.
//                     if (!wasReading || !visiblePages.length) {
//                       return;
//                     }

//                     const sessionId = ++speechSessionRef.current;

//                     readingQueueRef.current = [...visiblePages];

//                     const firstPage = readingQueueRef.current.shift();

//                     readingProgressRef.current.status = "loading";
//                     setTtsStatus("loading");

//                     readNextVisiblePage(firstPage, sessionId);
//                   }}
//                   className="book-flip"
//                 >
//                   {/* {pages.map((page, index) => (
//                     <FlipPage key={index} page={page} number={index + 1} />
//                   ))} */}

//                   {Array.from({ length: totalPages }, (_, index) => (
//                     <FlipPage
//                       key={`${product.id}-${index}`}
//                       pdfDocument={pdfDocument}
//                       number={index + 1}
//                       shouldRender={Math.abs(index - currentPage) <= 3}
//                     />
//                   ))}

//                 </HTMLFlipBook>
//               </section>
//             </div>
//           </div>

//           <div style={{ textAlign: "center", margin: "20px 0" }} >

//             {product?.docxUrl && (
//               <button
//                 type="button"
//                 onClick={handleReadDocx}
//                 disabled={docxLoading}
//                 style={{ marginRight: "10px" }}
//               >
//                 {docxLoading ? "Loading DOCX..." : "Read Clean DOCX Text"}
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={extractCurrentPageText}
//               disabled={extracting}
//             >
//               {extracting ? "Extracting..." : "Extract Page Text"}
//             </button>
//             <button
//               type="button"
//               onClick={handleTestOCR}
//               style={{ marginLeft: "10px" }}
//             >
//               Test Marathi OCR
//             </button>

//             <button
//               type="button"
//               onClick={handleTestDocxMatch}
//               style={{ marginLeft: "10px" }}
//             >
//               TEST DOCX Matching
//             </button>

//             <button
//               type="button"
//               onClick={handleTestPageBoundaries}
//               style={{ marginLeft: "10px" }}
//             >
//               Test Page Boundaries
//             </button>

//             <button
//               type="button"
//               onClick={handleTestCleanPage}
//               style={{ marginLeft: "10px" }}
//             >
//               Test Clean Page
//             </button>

//             <div style={{ marginTop: "15px" }}>

//               <label htmlFor="pdf-language">
//                 Select Language:{" "}
//               </label>

//               <select id="pdf-language"
//                 value={selectedLanguage}
//                 onChange={(event) => {
//                   setSelectedLanguage(event.target.value)
//                   setTranslatedText("");
//                   setTranslationError("");
//                 }}
//               >
//                 <option value="en">English</option>
//                 <option value="hi">Hindi</option>

//               </select>

//               <button
//                 type="button"
//                 onClick={handleTranslate}
//                 disabled={translating || extracting || !extractedText}
//                 style={{ marginLeft: "10px" }}
//               >
//                 {translating ? "Translating..." : "Translate"}
//               </button>

//               {translating && translationProgress && (
//                 <p
//                   style={{
//                     marginTop: "10px",
//                     fontSize: "14px",
//                     color: "#555",
//                   }}
//                 >
//                   {translationProgress}
//                 </p>
//               )}
//             </div>

//             {extractedText && (
//               <div
//                 style={{
//                   marginTop: "20px",
//                   padding: "20px",
//                   background: "#f5f5f5",
//                   borderRadius: "10px",
//                   textAlign: "left",
//                   maxHeight: "300px",
//                   overflowY: "auto",
//                 }}
//               >
//                 <h3>Extracted PDF Text</h3>

//                 {/* <p>{extractedText}</p> */}
//                 <p
//                   style={{
//                     whiteSpace: "pre-wrap",
//                     lineHeight: "1.8",
//                   }}
//                 >{
//                     selectedLanguage === "hi" && translatedText
//                       ? translatedText
//                       : extractedText
//                   }</p>

//                 {translationError && (
//                   <p
//                     style={{ color: "red", marginTop: "10px" }}
//                   >{translationError}</p>
//                 )}
//               </div>
//             )}

//             {/* DOCX extraction error */}
//             {docxError && (
//               <p role="alert" style={{ color: "red" }}>
//                 {docxError}
//               </p>
//             )}

//             {/* Clean DOCX text display */}
//             {docxText && (
//               <div
//                 style={{
//                   marginTop: "20px",
//                   padding: "20px",
//                   background: "#f5f5f5",
//                   borderRadius: "10px",
//                   textAlign: "left",
//                   maxHeight: "350px",
//                   overflowY: "auto",
//                 }}
//               >
//                 <h3>Clean DOCX Text</h3>

//                 <p
//                   style={{
//                     whiteSpace: "pre-wrap",
//                     lineHeight: "1.8",
//                   }}
//                 >
//                   {docxText}
//                 </p>
//               </div>
//             )}

//           </div>

//           <div className="reader-controls">

//             <select
//               value={ttsLanguage}
//               onChange={(event) => {
//                 handleStopSpeech();
//                 setTtsLanguage(event.target.value);
//                 setSelectedVoice("");
//               }}
//             >
//               <option value="en-IN">English</option>
//               <option value="hi-IN">Hindi</option>
//               <option value="mr-IN">Marathi</option>
//               <option value="sa-IN">Sanskrit</option>
//             </select>

//             <select
//               value={selectedVoice}
//               onChange={(event) => {
//                 handleStopSpeech();
//                 setSelectedVoice(event.target.value);
//               }}
//             >
//               <option value="">Default Voice</option>

//               {ttsVoices
//                 .filter((voice) =>
//                   voice.lang.toLowerCase().startsWith(
//                     ttsLanguage.split("-")[0].toLowerCase()
//                   )
//                 )
//                 .map((voice) => (
//                   <option
//                     key={`${voice.name}-${voice.lang}`}
//                     value={voice.name}
//                   >
//                     {voice.name}
//                   </option>
//                 ))}
//             </select>

//             <select
//               value={ttsSpeed}
//               onChange={(event) =>
//                 setTtsSpeed(Number(event.target.value))
//               }
//             >
//               <option value={0.75}>0.75× Slow</option>
//               <option value={1}>1× Normal</option>
//               <option value={1.25}>1.25× Fast</option>
//               <option value={1.5}>1.5× Faster</option>
//             </select>

//             <button
//               type="button"
//               onClick={handleSpeakPage}
//               disabled={ttsStatus === "loading"}
//             >
//               {ttsStatus === "paused"
//                 ? "▶ Resume"
//                 : ttsStatus === "playing"
//                   ? "🔊 Playing"
//                   : "🔊 Listen"}
//             </button>

//             <button
//               type="button"
//               onClick={handlePauseSpeech}
//               disabled={ttsStatus !== "playing"}
//             >
//               ⏸ Pause
//             </button>

//             <button
//               type="button"
//               onClick={handleStopSpeech}
//               disabled={ttsStatus === "idle"}
//             >
//               ⏹ Stop
//             </button>

//           </div>

//           <nav className="reader-controls" aria-label="Book navigation">
//             <button
//               type="button"
//               onClick={goPrevious}
//               disabled={currentPage === 0}
//             >
//               ← Previous
//             </button>

//             <span>
//               {/* Page {currentPage + 1} of {pages.length} */}
//               Page {currentPage + 1} of {totalPages}
//             </span>

//             <button
//               type="button"
//               onClick={goNext}
//               // disabled={currentPage >= pages.length - 1}
//               disabled={currentPage >= totalPages - 1}
//             >
//               Next →
//             </button>
//           </nav>
//         </>
//       )}
//     </main>
//   );
// }

////////////////////////////////////  This is the working verions which is we check already /////////////////////////////

import { forwardRef, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
// import { products } from "../Data/products";
import { getBookById } from "../Services/BookService";
import "../BookReader.css";
import { API_BASE_URL } from "../Config/api";

import { translateToHindi } from "../Services/TranslationServices";

import {
  getReadablePageText,
  extractDocxText,
  testPageOCR,
  testDocxPageMatch,
  testCleanPageBoundaries,
  extractVerifiedDocxPage,
} from "../Services/BookTextService";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// const FlipPage = forwardRef(function FlipPage({ page, number }, ref) {
//   return (
//     <div className="flip-page" ref={ref}>
//       <div className="flip-page-content">
//         <img src={page} alt={`Book page ${number}`} draggable="false" />
//       </div>
//       <span className="flip-page-number">{number}</span>
//     </div>
//   );
// });

// const FlipPage = forwardRef(function FlipPage(
//   { pdfDocument, number, shouldRender },
//   ref,
// ) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!pdfDocument || !shouldRender) return;

//     let cancelled = false;
//     let renderTask;

//     async function renderPage() {
//       try {
//         const pdfPage = await pdfDocument.getPage(number);

//         if (cancelled) return;

//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const viewport = pdfPage.getViewport({ scale: 1.5 });
//         const context = canvas.getContext("2d");

//         canvas.width = Math.ceil(viewport.width);
//         canvas.height = Math.ceil(viewport.height);

//         renderTask = pdfPage.render({
//           canvasContext: context,
//           viewport,
//         });

//         await renderTask.promise;
//       } catch (error) {
//         if (error?.name !== "RenderingCancelledException") {
//           console.error("Page rendering failed:", error);
//         }
//       }
//     }

//     renderPage();

//     return () => {
//       cancelled = true;
//       renderTask?.cancel();
//     };
//   }, [pdfDocument, number, shouldRender]);

//   return (
//     <div className="flip-page" ref={ref}>
//       <div className="flip-page-content">
//         <canvas ref={canvasRef} />
//       </div>
//       <span className="flip-page-number">{number}</span>
//     </div>
//   );
// });





const FlipPage = forwardRef(function FlipPage(
  { pdfDocument, number, shouldRender, zoom },
  ref,
) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  // const lastRenderWidthRef = useRef(null);

  useEffect(() => {
    if (!pdfDocument || !shouldRender) return;

    let cancelled = false;
    let renderTask = null;
    let frameId = null;
    let resizeObserver = null;
    let renderVersion = 0;

    async function renderPage() {
      const version = ++renderVersion;

      if (renderTask) {
        renderTask.cancel();
        try {
          await renderTask.promise;
        } catch {
          // Previous render was cancelled.
        }
        renderTask = null;
      }

      if (cancelled || version !== renderVersion) return;

      try {
        const pdfPage = await pdfDocument.getPage(number);

        if (cancelled || version !== renderVersion) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        // const displayWidth = container.getBoundingClientRect().width;

        // User layout width, not the animated/ transformed width

        const displayWidth =
          container.offsetWidth * ((zoom / 100) * 1.5);

        if (displayWidth <= 0) return;
        // const roundedWidth = Math.round(displayWidth);

        // if (lastRenderWidthRef.current === roundedWidth) {
        //   return;
        // }

        // lastRenderWidthRef.current = roundedWidth;

        const baseViewport = pdfPage.getViewport({ scale: 1 });

        // Account for screen density while limiting memory usage.
        const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 2.5);

        const targetScale =
          (displayWidth / baseViewport.width) * dpr;

        // Avoid excessively large canvas allocations.
        const maxPixels = 12000000;
        const maxDimension = 4096;

        const scaleLimit = Math.min(
          maxDimension / baseViewport.width,
          maxDimension / baseViewport.height,
          Math.sqrt(
            maxPixels /
            (baseViewport.width * baseViewport.height)
          ),
        );

        const renderScale = Math.min(targetScale, scaleLimit);
        const viewport = pdfPage.getViewport({
          scale: renderScale,
        });

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        if (cancelled || version !== renderVersion) return;

        renderTask = pdfPage.render({
          canvasContext: context,
          viewport,
        });

        await renderTask.promise;

        if (!cancelled && version === renderVersion) {
          console.log("SHARP PDF RENDER:", {
            page: number,
            zoom,
            displayWidth: Math.round(displayWidth),
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            dpr,
          });
        }
      } catch (error) {
        if (
          !cancelled &&
          version === renderVersion &&
          error?.name !== "RenderingCancelledException"
        ) {
          console.error("Page rendering failed:", error);
        }
      }
    }

    function scheduleRender() {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        frameId = null;
        renderPage();
      });
    }

    const container = containerRef.current;

    if (container) {
      resizeObserver = new ResizeObserver(scheduleRender);
      resizeObserver.observe(container);
    }

    scheduleRender();

    return () => {
      cancelled = true;
      // lastRenderWidthRef.current = null;
      renderVersion += 1;

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      resizeObserver?.disconnect();
      renderTask?.cancel();
    };
  }, [pdfDocument, number, shouldRender, zoom]);

  return (
    <div className="flip-page" ref={ref}>
      <div className="flip-page-content" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>

      <span className="flip-page-number">{number}</span>
    </div>
  );
});


export default function BookReader() {
  const { id } = useParams();
  const flipBookRef = useRef(null);
  const speechSessionRef = useRef(0);

  const readingProgressRef = useRef({
    pageNumber: null,
    chunks: [],
    chunkIndex: 0,
    status: "idle",
  });

  const autoFlipRef = useRef(false);
  const pendingAutoFlipSessionRef = useRef(null);

  const readingQueueRef = useRef([]);

  const pagePreparationCacheRef = useRef(new Map());

  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [zoom, setZoom] = useState(100);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [extracting, setExtracting] = useState(false);

  const [docxText, setDocxText] = useState("");
  const [docxLoading, setDocxLoading] = useState(false);
  const [docxError, setDocxError] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState("");

  const [translationProgress, setTranslationProgress] = useState("");

  const [ttsLanguage, setTtsLanguage] = useState("en-IN");
  const [ttsSpeed, setTtsSpeed] = useState(1);
  const [ttsVoices, setTtsVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [ttsStatus, setTtsStatus] = useState("idle");

  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);


  const pinchRef = useRef({
    startDistance: 0,
    startZoom: 100,
    active: false,
  });

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;

    return Math.hypot(dx, dy);
  }

  function handlePinchStart(event) {
    if (event.touches.length !== 2) return;

    pinchRef.current = {
      startDistance: getTouchDistance(event.touches),
      startZoom: zoom,
      active: true,
    };
  }

  function handlePinchMove(event) {
    if (!pinchRef.current.active || event.touches.length !== 2) return;

    const distance = getTouchDistance(event.touches);
    const ratio = distance / pinchRef.current.startDistance;

    const nextZoom = Math.max(
      100,
      Math.min(200, pinchRef.current.startZoom * ratio),
    );

    setZoom(Math.round(nextZoom));
  }

  function handlePinchEnd(event) {
    if (event.touches.length < 2) {
      pinchRef.current.active = false;
    }
  }


  function zoomIn() {
    setZoom((current) => Math.min(current + 25, 200));
  }

  function zoomOut() {
    setZoom((current) => Math.max(current - 25, 75));
  }

  function resetZoom() {
    setZoom(100);
  }

  // const product = products.find((item) => item.id === id);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setProductLoading(true);

      try {
        const book = await getBookById(id);

        if (!cancelled) {
          setProduct(book);
        }
      } catch (error) {
        console.error("Book loading failed:", error);

        if (!cancelled) {
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setProductLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      setTtsVoices(voices);

      console.log(
        "AVAILABLE TTS VOICES:",
        voices.map((voice) => ({
          name: voice.name,
          lang: voice.lang,
        })),
      );
    };

    loadVoices();

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // useEffect(() => {
  //   let cancelled = false;
  //   let loadingTask;

  //   if (!product) return;

  //   async function loadPdf() {
  //     setLoading(true);
  //     setError("");
  //     setPages([]);
  //     setCurrentPage(0);
  //     setPdfDocument(null);
  //     setTotalPages(0);
  //     pagePreparationCacheRef.current.clear();

  //     if (!product?.pdfUrl) {
  //       setError("This book does not have a PDF available yet.");
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const pdfUrl = new URL(product.pdfUrl, window.location.origin).href;
  //       loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
  //       const pdf = await loadingTask.promise;

  //       if (cancelled) return;

  //       setPdfDocument(pdf);
  //       setTotalPages(pdf.numPages);

  //       // const renderedPages = [];

  //       // for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
  //       //   if (cancelled) return;

  //       //   const pdfPage = await pdf.getPage(pageNumber);
  //       //   const viewport = pdfPage.getViewport({ scale: 1.15 });
  //       //   const canvas = document.createElement("canvas");
  //       //   const context = canvas.getContext("2d");

  //       //   canvas.width = Math.ceil(viewport.width);
  //       //   canvas.height = Math.ceil(viewport.height);

  //       //   await pdfPage.render({
  //       //     canvasContext: context,
  //       //     viewport,
  //       //   }).promise;

  //       //   renderedPages.push(canvas.toDataURL("image/jpeg", 0.88));
  //       //   canvas.width = 0;
  //       //   canvas.height = 0;
  //       // }

  //       // if (!cancelled) setPages(renderedPages);
  //     } catch (err) {
  //       if (cancelled || err?.name === "AbortException") {
  //         return;
  //       }

  //       console.error("PDF loading failed:", err);

  //       setError(
  //         "We couldn't open this PDF. Check the file path and try again."
  //       );

  //     } finally {
  //       if (!cancelled) setLoading(false);
  //     }
  //   }

  //   loadPdf();

  //   return () => {
  //     cancelled = true;
  //     loadingTask?.destroy();
  //   };
  // }, [product?.pdfUrl]);

  // useEffect(() => {
  //   let cancelled = false;
  //   let loadingTask;
  //   let docxObjectUrl;

  //   if (!product) return;

  //   async function loadPdf() {
  //     setLoading(true);
  //     setError("");
  //     setPages([]);
  //     setCurrentPage(0);
  //     setPdfDocument(null);
  //     setTotalPages(0);
  //     pagePreparationCacheRef.current.clear();

  //     if (!product.pdfUrl) {
  //       setError("This book does not have a PDF available yet.");
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       // 1. Get logged-in user's token
  //       const token = sessionStorage.getItem("authToken");

  //       if (!token) {
  //         throw new Error("Please log in to read this book.");
  //       }

  //       const headers = {
  //         Authorization: `Bearer ${token}`,
  //       };

  //       // 2. Verify purchase/access
  //       const accessResponse = await fetch(
  //         `${API_BASE_URL}/api/library/${product.id}/access`,
  //         { headers },
  //       );

  //       if (!accessResponse.ok) {
  //         if (accessResponse.status === 401) {
  //           throw new Error("Your session has expired. Please log in again.");
  //         }

  //         if (accessResponse.status === 403) {
  //           throw new Error("Please purchase this book to read it.");
  //         }

  //         throw new Error("Unable to verify book access.");
  //       }

  //       const accessData = await accessResponse.json();

  //       if (accessData?.data?.hasAccess !== true) {
  //         throw new Error("Please purchase this book to read it.");
  //       }

  //       // 3. Download protected PDF
  //       const pdfResponse = await fetch(product.pdfUrl, {
  //         headers,
  //       });

  //       if (!pdfResponse.ok) {
  //         throw new Error(
  //           pdfResponse.status === 401
  //             ? "Your session has expired. Please log in again."
  //             : pdfResponse.status === 403
  //               ? "You do not have access to this book."
  //               : "Unable to download the PDF.",
  //         );
  //       }

  //       const pdfBuffer = await pdfResponse.arrayBuffer();

  //       if (cancelled) return;

  //       loadingTask = pdfjsLib.getDocument({
  //         data: pdfBuffer,
  //       });

  //       const pdf = await loadingTask.promise;

  //       if (cancelled) return;

  //       setPdfDocument(pdf);
  //       setTotalPages(pdf.numPages);

  //       // 4. Download DOCX with the same authentication
  //       if (product.docxUrl) {
  //         const docxResponse = await fetch(product.docxUrl, {
  //           headers,
  //         });

  //         if (!docxResponse.ok) {
  //           throw new Error("Unable to download the DOCX file.");
  //         }

  //         const docxBlob = await docxResponse.blob();

  //         if (cancelled) return;

  //         docxObjectUrl = URL.createObjectURL(docxBlob);

  //         // Existing text extraction functions use product.docxUrl.
  //         setProduct((previous) => ({
  //           ...previous,
  //           docxUrl: docxObjectUrl,
  //         }));
  //       }
  //     } catch (err) {
  //       if (cancelled) return;

  //       console.error("Book loading failed:", err);
  //       setError(
  //         err.message || "We couldn't open this book. Please try again.",
  //       );
  //     } finally {
  //       if (!cancelled) {
  //         setLoading(false);
  //       }
  //     }
  //   }

  //   loadPdf();

  //   return () => {
  //     cancelled = true;
  //     loadingTask?.destroy();

  //     if (docxObjectUrl) {
  //       URL.revokeObjectURL(docxObjectUrl);
  //     }
  //   };
  // }, [product?.id, product?.pdfUrl]);

  useEffect(() => {
    let cancelled = false;
    let loadingTask;

    if (!product) return;

    async function loadPdf() {
      setLoading(true);
      setError("");
      setPages([]);
      setCurrentPage(0);
      setPdfDocument(null);
      setTotalPages(0);
      setExtractedText("");
      setDocxText("");
      pagePreparationCacheRef.current.clear();

      if (!product.pdfUrl) {
        setError("This book does not have a preview available yet.");
        setLoading(false);
        return;
      }

      try {
        // Public preview: no login and no purchase token required.
        const response = await fetch(product.pdfUrl);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Book preview is not available."
              : "Unable to load book preview.",
          );
        }

        const pdfBuffer = await response.arrayBuffer();

        if (cancelled) return;

        loadingTask = pdfjsLib.getDocument({
          data: pdfBuffer,
        });

        const pdf = await loadingTask.promise;

        if (cancelled) {
          await pdf.destroy();
          return;
        }

        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);

        console.log("PUBLIC BOOK PREVIEW LOADED:", {
          productId: product.id,
          previewPages: pdf.numPages,
        });
      } catch (err) {
        if (cancelled) return;

        console.error("Book preview loading failed:", err);

        setError(
          err.message || "We couldn't open this book. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
      loadingTask?.destroy();
    };
  }, [product?.id, product?.pdfUrl]);

  function goPrevious() {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }

  function goNext() {
    flipBookRef.current?.pageFlip()?.flipNext();
  }

  // async function extractCurrentPageText() {
  //   if (!pdfDocument) return;

  //   try {
  //     setExtracting(true);

  //     const pageNumber = currentPage + 1;

  //     const pdfPage = await pdfDocument.getPage(pageNumber);

  //     const textContent = await pdfPage.getTextContent();

  //     const text = textContent.items
  //       .map((item) => item.str || "")
  //       .join(" ");

  //     setExtractedText(text);

  //     console.log("PDF PAGE:", pageNumber);
  //     console.log("EXTRACTED TEXT:", text);
  //     console.log("TEXT ITEMS:", textContent.items);

  //   } catch (error) {
  //     console.error("Text extraction failed:", error);
  //   } finally {
  //     setExtracting(false);
  //   }
  // }

  async function handleReadDocx() {
    if (!product?.docxUrl) return;

    try {
      setDocxLoading(true);
      setDocxError("");

      const text = await extractDocxText(product.docxUrl);
      setDocxText(text);
    } catch (error) {
      console.error("DOCX extraction failed:", error);
      setDocxError(error.message || "Unable to read DOCX.");
    } finally {
      setDocxLoading(false);
    }
  }

  async function handleTestOCR() {
    if (!pdfDocument) return;

    try {
      const pageNumber = currentPage + 1;

      console.log("STARTING OCR TEST:", pageNumber);

      const text = await testPageOCR(pdfDocument, pageNumber);

      console.log("FINAL OCR RESULT:", text);
    } catch (error) {
      console.error("OCR TEST FAILED:", error);
    }
  }

  console.log("BOOK PRODUCT:", product);
  console.log("PDF READY:", Boolean(pdfDocument));
  console.log("DOCX URL:", product?.docxUrl);

  async function handleTestDocxMatch() {
    if (!pdfDocument || (!product?.docxUrl && !product?.previewTextUrl)) {
      return Promise.reject(new Error("PDF or preview text is not ready."));
    }

    try {
      const result = await testDocxPageMatch({
        docxUrl: product.docxUrl,
        pdfDocument,
        pageNumber: currentPage + 1,
      });

      console.log("Final MATCH RESULT:", result);
    } catch (error) {
      console.error("DOCX MATCH FAILED:", error);
    }
  }

  async function handleTestPageBoundaries() {
    if (!pdfDocument || !product?.docxUrl) return;

    try {
      const result = await testCleanPageBoundaries({
        docxUrl: product.docxUrl,
        pdfDocument,
        pageNumber: currentPage + 1,
      });

      console.log("PAGE BOUNDARY RESULT:", result);
    } catch (error) {
      console.error("PAGE BOUNDARY TEST FAILED:", error);
    }
  }

  async function handleTestCleanPage() {
    if (!pdfDocument || !product?.docxUrl) {
      console.error("PDF or DOCX is missing.");
      return;
    }

    try {
      const result = await extractVerifiedDocxPage({
        docxUrl: product.docxUrl,
        pdfDocument,
        pageNumber: currentPage + 1,
      });

      console.log("CLEAN PAGE NUMBER:", result.pageNumber);
      console.log("CLEAN PAGE TEXT:", result.text);
      console.log(
        "MATCH COVERAGE:",
        `${result.exactMatches}/${result.ocrLines}`,
      );

      setExtractedText(result.text);
    } catch (err) {
      console.error("CLEAN PAGE TEST FAILED:", err);
      alert(err.message);
    }
  }

  // async function extractCurrentPageText() {
  //   if (!pdfDocument) return;

  //   try {
  //     setExtracting(true);

  //     // Clear previous results.
  //     setExtractedText("");
  //     setTranslatedText("");
  //     setTranslationError("");

  //     const pageNumber = currentPage + 1;

  //     const pdfPage = await pdfDocument.getPage(pageNumber);

  //     const textContent = await pdfPage.getTextContent();

  //     const lines = [];
  //     let currentLine = [];
  //     let previousY = null;

  //     for (const item of textContent.items) {
  //       if (typeof item.str !== "string") continue;

  //       const text = item.str.trim();

  //       if (!text) continue;

  //       // PDF.js stores text positions in transform.
  //       const currentY = item.transform?.[5];

  //       if (typeof currentY !== "number") {
  //         if (currentLine.length > 0) {
  //           lines.push(currentLine.join(" "));
  //           currentLine = [];
  //         }

  //         lines.push(text);
  //         previousY = null;
  //         continue;
  //       }

  //       // Detect when text moves to another line.
  //       const isNewLine =
  //         previousY !== null &&
  //         Math.abs(currentY - previousY) > 3;

  //       if (isNewLine && currentLine.length > 0) {
  //         lines.push(currentLine.join(" "));
  //         currentLine = [];
  //       }

  //       currentLine.push(text);

  //       previousY = currentY;

  //       // Some PDF.js text items explicitly end a line.
  //       if (item.hasEOL) {
  //         lines.push(currentLine.join(" "));
  //         currentLine = [];
  //         previousY = null;
  //       }
  //     }

  //     // Include any remaining text.
  //     if (currentLine.length > 0) {
  //       lines.push(currentLine.join(" "));
  //     }

  //     const structuredText = lines.join("\n");

  //     setExtractedText(structuredText);

  //     console.log("PDF PAGE:", pageNumber);
  //     console.log("STRUCTURED PDF TEXT:", structuredText);
  //     console.log("TEXT ITEMS:", textContent.items);

  //   } catch (error) {
  //     console.error("Text extraction failed:", error);
  //   } finally {
  //     setExtracting(false);
  //   }
  // }

  async function extractCurrentPageText() {
    if (!pdfDocument) return;

    try {
      setExtracting(true);
      setExtractedText("");
      setTranslatedText("");
      setTranslationError("");

      const pageNumber = currentPage + 1;

      const cleanText = await getReadablePageText({
        docxUrl: product?.docxUrl,
        pdfDocument,
        pageNumber,
      });

      setExtractedText(cleanText);

      console.log("CLEAN PAGE:", pageNumber);
      console.log("CLEAN TEXT:", cleanText);
    } catch (error) {
      console.error("Clean text extraction failed:", error);
      alert(error.message || "Unable to extract page text.");
    } finally {
      setExtracting(false);
    }
  }

  // async function handleSpeakPage() {
  //   if (!pdfDocument) {
  //     alert("PDF is not ready yet.");
  //     return;
  //   }

  //   if (!("speechSynthesis" in window)) {
  //     alert("Text-to-Speech is not supported in this browser.");
  //     return;
  //   }

  //   try {
  //     // stop any previous speech
  //     window.speechSynthesis.cancel();

  //     // Get the current PDF page.
  //     const pageNumber = currentPage + 1
  //     const pdfPage = await pdfDocument.getPage(pageNumber);

  //     // Extract text directly from PDF.js
  //     const textContent = await pdfPage.getTextContent();

  //     const pageText = textContent.items
  //       .map((item) => item.str || "")
  //       .join(" ")
  //       .trim();

  //     if (!pageText) {
  //       alert("No readable text found on this page.");
  //       return;
  //     }

  //     // Create speech.

  //     const utterance = new SpeechSynthesisUtterance(pageText);

  //     utterance.lang = "en-IN";
  //     utterance.rate = 1;
  //     utterance.pitch = 1;
  //     utterance.volume = 1;

  //     utterance.onerror = (event) => {
  //       if (event.error !== "canceled") {
  //         console.error("TTS error:", event.error);
  //       }
  //     };

  //     window.speechSynthesis.speak(utterance);

  //     console.log("TTS PAGE:", pageNumber);
  //     console.log("TTS TEST:", pageText);

  //   } catch (error) {
  //     console.error("TTS failed: ", error);
  //     alert("Unable to read this page aloud.");
  //   }
  // }

  // function handleStopSpeech() {
  //   window.speechSynthesis.cancel();
  // }

  function getVisiblePageNumbers() {
    const flipInstance = flipBookRef.current?.pageFlip();

    if (!flipInstance || !totalPages) {
      return [];
    }

    const currentIndex = flipInstance.getCurrentPageIndex();
    const orientation = flipInstance.getOrientation();

    if (currentIndex < 0 || currentIndex >= totalPages) {
      return [];
    }

    const firstPage = currentIndex + 1;

    // Mobile: one page at a time.
    if (orientation === "portrait") {
      return [firstPage];
    }

    // if (secondPage <= totalPages) {
    //   return [firstPage, secondPage];
    // }

    // return [firstPage];

    // Desktop: cover is displayed alon
    if (currentIndex === 0) {
      return [1];
    }

    // Desktop: two-page spread
    const secondPage = firstPage + 1;

    return secondPage <= totalPages ? [firstPage, secondPage] : [firstPage];
  }

  function flipToNextReadingPages() {
    const flipInstance = flipBookRef.current?.pageFlip();

    if (!flipInstance) return false;

    const visiblePages = getVisiblePageNumbers();

    if (!visiblePages.length) return false;

    const lastVisiblePage = visiblePages[visiblePages.length - 1];

    if (lastVisiblePage >= totalPages) {
      return false;
    }

    autoFlipRef.current = true;

    flipInstance.flipNext();

    return true;
  }

  function preparePageForSpeech(pageNumber) {
    // if (!pdfDocument || !product?.docxUrl) {
    //   return Promise.reject(new Error("PDF or DOCX is not ready."));
    // }

    if (!pdfDocument || (!product?.docxUrl && !product?.previewTextUrl)) {
      return Promise.reject(new Error("PDF or preview text is not ready."));
    }

    const cache = pagePreparationCacheRef.current;

    // Already prepared or currently preperting

    if (cache.has(pageNumber)) {
      return cache.get(pageNumber);
    }

    console.log("BACKGROUND PREPARATION START:", pageNumber);

    const preparationPromise = getReadablePageText({
      docxUrl: product.docxUrl,
      previewTextUrl: product.previewTextUrl,
      pdfDocument,
      pageNumber,
    })
      .then((text) => {
        if (!text?.trim()) {
          throw new Error(`No readable text found on Page ${pageNumber}`);
        }

        console.log("BACKGROUND PREPARATION READY:", pageNumber);

        return text.trim();
      })
      .catch((error) => {
        //Failed results should not stay cached.

        if (cache.get(pageNumber) === preparationPromise) {
          cache.delete(pageNumber);
        }

        throw error;
      });

    cache.set(pageNumber, preparationPromise);

    return preparationPromise;
  }

  function preloadUpcomingPage(pageNumber, sessionId) {
    if (!pageNumber || pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    preparePageForSpeech(pageNumber).catch((error) => {
      if (sessionId !== speechSessionRef.current) return;

      console.warn("BACKGROUND PAGE PREPARATION FAILED:", pageNumber, error);
    });
  }

  function completeReadingPage(sessionId) {
    if (sessionId !== speechSessionRef.current) return;

    const nextPageNumber = readingQueueRef.current.shift();

    if (nextPageNumber) {
      readNextVisiblePage(nextPageNumber, sessionId);
      return;
    }

    const visiblePages = getVisiblePageNumbers();

    if (!visiblePages.length) {
      readingProgressRef.current.status = "idle";
      setTtsStatus("idle");
      return;
    }

    const lastVisiblePage = visiblePages[visiblePages.length - 1];

    if (lastVisiblePage >= totalPages) {
      readingProgressRef.current.status = "idle";
      setTtsStatus("idle");
      console.log("BOOK READING COMPLETED");
      return;
    }

    pendingAutoFlipSessionRef.current = sessionId;

    readingProgressRef.current.status = "loading";
    setTtsStatus("loading");

    const flipped = flipToNextReadingPages();

    if (!flipped) {
      pendingAutoFlipSessionRef.current = null;
      readingProgressRef.current.status = "idle";
      setTtsStatus("idle");
    }
  }

  async function readNextVisiblePage(pageNumber, sessionId) {
    const synth = window.speechSynthesis;

    try {
      if (sessionId !== speechSessionRef.current) return;

      setTtsStatus("loading");

      // const pageText = await getReadablePageText({
      //   docxUrl: product?.docxUrl,
      //   pdfDocument,
      //   pageNumber,
      // });

      console.log("Using PREPARE PAGE:", pageNumber);

      const pageText = await preparePageForSpeech(pageNumber);

      if (sessionId !== speechSessionRef.current) return;

      if (!pageText?.trim()) {
        throw new Error(`No readable text found on page ${pageNumber}`);
      }

      const chunks = [];
      const maxChunkLength = 200;
      let remainingText = pageText.trim();

      while (remainingText.length > 0) {
        if (remainingText.length <= maxChunkLength) {
          chunks.push(remainingText);
          break;
        }

        let splitAt = remainingText.lastIndexOf(" ", maxChunkLength);

        if (splitAt <= 0) splitAt = maxChunkLength;

        const chunk = remainingText.slice(0, splitAt).trim();

        if (chunk) chunks.push(chunk);

        remainingText = remainingText.slice(splitAt).trim();
      }

      readingProgressRef.current = {
        pageNumber,
        chunks,
        chunkIndex: 0,
        status: "loading",
      };

      const upcomingPage =
        readingQueueRef.current[0] ||
        (pageNumber < totalPages ? pageNumber + 1 : null);

      preloadUpcomingPage(upcomingPage, sessionId);

      // if (upcomingPage) {
      //   preparePageForSpeech(upcomingPage).catch((error) => {
      //     if (sessionId !== speechSessionRef.current) return;

      //     console.warn(
      //       "UPCOMING PAGE PREPARATION FAILED:",
      //       upcomingPage,
      //       error
      //     )

      //   })
      // }

      const voice =
        ttsVoices.find(
          (item) =>
            item.name === selectedVoice &&
            item.lang
              .toLowerCase()
              .startsWith(ttsLanguage.split("-")[0].toLowerCase()),
        ) ||
        ttsVoices.find(
          (item) => item.lang.toLowerCase() === ttsLanguage.toLowerCase(),
        );

      let chunkIndex = 0;

      const speakNextChunk = () => {
        if (sessionId !== speechSessionRef.current) return;

        readingProgressRef.current.chunkIndex = chunkIndex;

        // if (chunkIndex >= chunks.length) {
        //   console.log("TTS PAGE COMPLETED:", pageNumber);

        //   const nextPageNumber = readingQueueRef.current.shift();

        //   if (nextPageNumber) {
        //     readNextVisiblePage(nextPageNumber, sessionId);
        //   } else {
        //     readingProgressRef.current.status = "idle";
        //     setTtsStatus("idle");
        //     console.log("VISIBLE PAGES READING COMPLETED");
        //   }

        //   return;
        // }

        if (chunkIndex >= chunks.length) {
          console.log("TTS PAGE COMPLETED:", pageNumber);

          completeReadingPage(sessionId);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);

        utterance.lang = ttsLanguage;
        utterance.rate = ttsSpeed;
        utterance.pitch = 1;
        utterance.volume = 1;

        if (voice) utterance.voice = voice;

        utterance.onstart = () => {
          if (sessionId !== speechSessionRef.current) return;

          readingProgressRef.current.status = "playing";
          setTtsStatus("playing");
        };

        utterance.onend = () => {
          if (sessionId !== speechSessionRef.current) return;

          chunkIndex += 1;
          speakNextChunk();
        };

        utterance.onerror = (event) => {
          if (sessionId !== speechSessionRef.current) return;

          console.error("TTS error:", event.error);
          readingProgressRef.current.status = "idle";
          setTtsStatus("idle");
        };

        synth.speak(utterance);
      };

      console.log("TTS PAGE:", pageNumber);
      speakNextChunk();
    } catch (error) {
      if (sessionId !== speechSessionRef.current) return;

      console.error("Next page reading failed:", error);
      readingQueueRef.current = [];
      readingProgressRef.current.status = "idle";
      setTtsStatus("idle");
    }
  }

  async function handleSpeakPage() {
    if (!pdfDocument) return;

    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    const synth = window.speechSynthesis;

    // Resume from paused position.
    // if (synth.paused) {
    //   synth.resume();
    //   setTtsStatus("playing");
    //   return;
    // }

    if (ttsStatus === "paused") {
      // console.log("RESUME REQUEST: ", {
      //   paused: synth.paused,
      //   speaking: synth.speaking,
      //   pending: synth.pending,
      // })

      const progress = readingProgressRef.current;

      if (!progress.chunks.length) {
        setTtsStatus("idle");
        return;
      }

      // if (synth.paused) {
      //   synth.resume();
      //   setTtsStatus("playing");
      // }
      // else {
      //   console.warn("Resume requested, but browser has no paused speech.")
      // }

      const sessionId = ++speechSessionRef.current;

      const voice =
        ttsVoices.find(
          (item) =>
            item.name === selectedVoice &&
            item.lang
              .toLowerCase()
              .startsWith(ttsLanguage.split("-")[0].toLowerCase()),
        ) ||
        ttsVoices.find(
          (item) => item.lang.toLowerCase() === ttsLanguage.toLowerCase(),
        );

      progress.status = "playing";
      setTtsStatus("playing");

      const resumeChunk = () => {
        if (sessionId !== speechSessionRef.current) return;

        // if (progress.chunkIndex >= progress.chunks.length) {
        //   progress.status = "idle";
        //   setTtsStatus("idle");
        //   return;
        // }

        if (progress.chunkIndex >= progress.chunks.length) {
          console.log("RESUMED PAGE COMPLETED:", progress.pageNumber);

          completeReadingPage(sessionId);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(
          progress.chunks[progress.chunkIndex],
        );

        utterance.lang = ttsLanguage;
        utterance.rate = ttsSpeed;
        utterance.pitch = 1;
        utterance.volume = 1;

        if (voice) utterance.voice = voice;

        utterance.onend = () => {
          if (sessionId !== speechSessionRef.current) return;

          progress.chunkIndex += 1;
          resumeChunk();
        };

        utterance.onerror = (event) => {
          if (sessionId !== speechSessionRef.current) return;

          console.error("Resume TTS error:", event.error);
          progress.status = "idle";
          setTtsStatus("idle");
        };

        synth.speak(utterance);
      };

      resumeChunk();

      return;
    }
    // Avoid restarting speech when already playing.
    if (synth.speaking || ttsStatus === "loading") {
      return;
    }

    const sessionId = ++speechSessionRef.current;

    const visiblePages = getVisiblePageNumbers();

    if (!visiblePages.length) {
      setTtsStatus("idle");
      return;
    }

    readingQueueRef.current = [...visiblePages];

    const firstPage = readingQueueRef.current.shift();

    readingProgressRef.current.status = "loading";
    setTtsStatus("loading");

    readNextVisiblePage(firstPage, sessionId);

    // try {
    //   setTtsStatus("loading");

    // const pageNumber = currentPage + 1;
    // const pdfPage = await pdfDocument.getPage(pageNumber);
    // const textContent = await pdfPage.getTextContent();

    // console.table(
    //   textContent.items.slice(0, 30).map((item, index) => ({
    //     index,
    //     text: item.str,
    //     fontName: item.fontName,
    //     hasEOL: item.hasEOL,
    //   }))
    // )

    // const pageNumber = currentPage + 1;

    // const pageNumber = readingQueueRef.current.shift();

    // const pageText = await getReadablePageText({
    //   docxUrl: product.docxUrl,
    //   pdfDocument,
    //   pageNumber,
    // });

    // if (sessionId !== speechSessionRef.current) return;

    // const pageText = textContent.items
    //   .map((item) => item.str || "")
    //   .join(" ")
    //   .replace(/\s+/g, " ")
    //   .trim();

    //   if (!pageText) {
    //     setTtsStatus("idle");
    //     alert("No readable text found on this page.");
    //     return;
    //   }

    //   console.log("TTS PAGE:", pageNumber);
    //   console.log("TTS TEXT LENGTH: ", pageText.length);
    //   console.log("TTS TEXT:", pageText);

    //   // Divide text into smaller pieces.
    //   const maxChunkLength = 200;
    //   const chunks = [];
    //   let remainingText = pageText;

    //   while (remainingText.length > 0) {
    //     if (remainingText.length <= maxChunkLength) {
    //       chunks.push(remainingText);
    //       break;
    //     }

    //     let splitAt = remainingText.lastIndexOf(
    //       " ",
    //       maxChunkLength
    //     );

    //     if (splitAt <= 0) {
    //       splitAt = maxChunkLength;
    //     }

    //     const chunk = remainingText.slice(0, splitAt).trim();

    //     if (chunk) {
    //       chunks.push(chunk);
    //     }

    //     remainingText = remainingText.slice(splitAt).trim();
    //   }

    //   console.log("TOTAL TTS CHUNKS:", chunks.length);

    //   readingProgressRef.current = {
    //     pageNumber,
    //     chunks,
    //     chunkIndex: 0,
    //     status: "loading",
    //   }

    //   // Prepare the next visible page while this page is speaking.

    //   // const nextPageToPrepare = readingProgressRef.current[0];

    //   const nextPageToPrepare = readingQueueRef.current[0];

    //   if (nextPageToPrepare) {
    //     preparePageForSpeech(nextPageToPrepare).catch((error) => {
    //       if (sessionId !== speechSessionRef.current) return;

    //       console.warn(
    //         "NEXT PAGE PREPARATION FAILED:",
    //         nextPageToPrepare,
    //         error
    //       )
    //     })
    //   }

    //   const voice =
    //     ttsVoices.find(
    //       (item) =>
    //         item.name === selectedVoice &&
    //         item.lang.toLowerCase().startsWith(
    //           ttsLanguage.split("-")[0].toLowerCase()
    //         )
    //     ) ||
    //     ttsVoices.find(
    //       (item) =>
    //         item.lang.toLowerCase() === ttsLanguage.toLowerCase()
    //     );

    //   let chunkIndex = 0;

    //   const speakNextChunk = () => {
    //     if (sessionId !== speechSessionRef.current) {
    //       return;
    //     }

    //     readingProgressRef.current.chunkIndex = chunkIndex;

    //     // if (chunkIndex >= chunks.length) {
    //     //   setTtsStatus("idle");
    //     //   console.log("TTS PAGE COMPLETED");
    //     //   return;
    //     // }

    //     if (chunkIndex >= chunks.length) {

    //       console.log("TTS PAGE COMPLETED:", pageNumber);

    //       const nextPageNumber = readingQueueRef.current.shift();

    //       if (!nextPageNumber) {
    //         readingProgressRef.current.status = "idle";
    //         setTtsStatus("idle");
    //         console.log("VISIBLE PAGE READING COMPLETED");
    //         return;
    //       }

    //       console.log("STARTING NEXT VISIBLE PAGE:", nextPageNumber);

    //       readNextVisiblePage(nextPageNumber, sessionId);
    //       return;

    //     }

    //     const utterance = new SpeechSynthesisUtterance(
    //       chunks[chunkIndex]
    //     );

    //     utterance.lang = ttsLanguage;
    //     utterance.rate = ttsSpeed;
    //     utterance.pitch = 1;
    //     utterance.volume = 1;

    //     if (voice) {
    //       utterance.voice = voice;
    //     }

    //     utterance.onstart = () => {
    //       if (sessionId === speechSessionRef.current) {
    //         readingProgressRef.current.status = "playing";
    //         setTtsStatus("playing");
    //       }
    //     };

    //     utterance.onend = () => {
    //       if (sessionId !== speechSessionRef.current) {
    //         return;
    //       }

    //       chunkIndex += 1;

    //       speakNextChunk();
    //     };

    //     utterance.onerror = (event) => {
    //       if (sessionId !== speechSessionRef.current) {
    //         return;
    //       }

    //       console.error("TTS error:", event.error);
    //       setTtsStatus("idle");
    //     };

    //     console.log(
    //       `READING CHUNK ${chunkIndex + 1}/${chunks.length}`
    //     );

    //     synth.speak(utterance);
    //   };

    //   speakNextChunk();
    // // } catch (error) {
    // //   if (sessionId !== speechSessionRef.current) return;

    // //   console.error("TTS failed:", error);
    // //   setTtsStatus("idle");
    // //   alert(error.message || "Unable to rea this page aloud.")
    // // }

    // const sessionId = ++speechSessionRef.current;

    // const visiblePages = getVisiblePageNumbers();
  }

  // function handlePauseSpeech() {
  //   if (!("speechSynthesis" in window)) return;

  //   window.speechSynthesis.pause();
  //   setTtsStatus("paused");
  // }

  function handleStopSpeech() {
    if (!("speechSynthesis" in window)) return;

    // Invalidate pending and future chunks.
    speechSessionRef.current += 1;

    pendingAutoFlipSessionRef.current = null;
    autoFlipRef.current = false;

    readingQueueRef.current = [];

    readingProgressRef.current = {
      pageNumber: null,
      chunks: [],
      chunkIndex: 0,
      status: "idle",
    };

    window.speechSynthesis.cancel();

    setTtsStatus("idle");
  }

  // function handlePauseSpeech() {
  //   if (!("speechSynthesis" in window)) return;

  //   const synth = window.speechSynthesis;

  //   synth.pause();

  //   console.log("PAUSE REQUEST: ", {
  //     paused: synth.paused,
  //     speaking: synth.speaking,
  //     pending: synth.pending,
  //   })

  //   setTtsStatus("paused");
  // }

  function handlePauseSpeech() {
    if (!("speechSynthesis" in window)) return;

    if (readingProgressRef.current.status !== "playing") return;

    // Cancle the current speech session, but preserve reading progress.

    speechSessionRef.current += 1;

    readingProgressRef.current.status = "paused";

    window.speechSynthesis.cancel();

    setTtsStatus("paused");
  }

  async function handleTranslate() {
    if (!extractedText.trim()) {
      alert("Please extract the PDF text first.");
      return;
    }

    if (selectedLanguage === "en") {
      setTranslatedText("");
      setTranslationError("");
      return;
    }

    try {
      setTranslating(true);
      setTranslationError("");

      // const translated = await translateToHindi(extractedText);

      // const testText =
      //   "At the core of quantum information processing is the quantum bit, or qubit.";

      // const testText = "The sun rises in the east.";

      // const translated = await translateToHindi(testText);

      setTranslationProgress("Preparing translation...");

      const translated = await translateToHindi(
        extractedText,
        (completed, total) => {
          setTranslationProgress(
            `Translating ${completed} of ${total} chunks...`,
          );
        },
      );

      setTranslatedText(translated);

      console.log("HINDI TRANSLATION:", translated);
    } catch (error) {
      console.error("Translation failed:", error);

      setTranslationError(error?.message || "Unable to translate this page.");
    } finally {
      setTranslating(false);
      setTranslationProgress("");
    }
  }

  if (productLoading) {
    return (
      <main className="reader-message">
        <p>Loading your book...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="reader-message">
        <h1>Book not found</h1>
        <Link to="/">Return to SKS Dream</Link>
      </main>
    );
  }

  return (
    <main className="reader-page">
      <header className="reader-header">
        <Link to="/" className="reader-back">
          ← Back to SKS Dream
        </Link>
        <span className="reader-brand">SKS Dream</span>
      </header>

      <section className="reader-heading">
        <p className="reader-eyebrow">DIGITAL LIBRARY</p>
        <h1>{product.name}</h1>
        <p>Settle in, turn the pages, and enjoy your reading experience.</p>
      </section>

      {loading && (
        <div className="reader-message" role="status">
          Preparing your book…
        </div>
      )}

      {error && (
        <div className="reader-message" role="alert">
          <p>{error}</p>
          <Link to="/">Return to products</Link>
        </div>
      )}

      {/* {!loading && !error && pages.length > 0 && ( */}
      {!loading && !error && pdfDocument && totalPages > 0 && (
        <>
          {/* Zooom Effects */}

          <nav
            className="reader-zoom-toolbar"
            aria-label="Reading zoom controls"
          >
            <span className="reader-zoom-label">Reading View</span>

            <div className="reader-zoom-actions">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= 75}
                aria-label="Zoom out"
              >
                -
              </button>

              <span className="reader-zoom-level">{zoom}%</span>

              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= 200}
                aria-label="Zoom in"
              >
                +
              </button>

              <button
                type="button"
                className="reader-zoom-reset"
                onClick={resetZoom}
              >
                Reset
              </button>
            </div>
          </nav>

          <div className="reader-book-viewport"
            onTouchStart={handlePinchStart}
            onTouchMove={handlePinchMove}
            onTouchEnd={handlePinchEnd}
            onTouchCancel={handlePinchEnd}
          >
            {/* <div className="reader-book-zoom" style={{ zoom: zoom / 100 }}> */}
            <div className="reader-book-zoom" style={{ zoom: (zoom / 100) * 1.5 }}>
              {/* <div className="reader-book-zoom" style={{ zoom: Math.max(zoom, 150) / 100 }}> */}
              <section className="book-stage" aria-label="Interactive book">
                <HTMLFlipBook
                  ref={flipBookRef}
                  width={380}
                  height={520}
                  size="stretch"
                  minWidth={260}
                  maxWidth={760}
                  minHeight={360}
                  maxHeight={620}
                  showCover
                  usePortrait
                  mobileScrollSupport
                  drawShadow
                  flippingTime={650}
                  maxShadowOpacity={0.45}
                  // onFlip={(event) => {
                  //   // window.speechSynthesis.cancel();
                  //   // handleStopSpeech();

                  //   // setCurrentPage(event.data);

                  //   const isAutomaticFlip = autoFlipRef.current;

                  //   autoFlipRef.current = false;

                  //   if (!isAutomaticFlip) {
                  //     handleStopSpeech();
                  //   }

                  //   setCurrentPage(event.data);

                  //   console.log("FLIP SOURCE:", isAutomaticFlip ? "automatic" : "manual");

                  //   const flipInstance = flipBookRef.current?.pageFlip();

                  //   console.log("FLIPBOOK PAGE INFO:", {
                  //     eventPageIndex: event.data,
                  //     currentPageIndex: flipInstance?.getCurrentPageIndex(),
                  //     orientation: flipInstance?.getOrientation(),
                  //     pageCount: flipInstance?.getPageCount(),
                  //   });

                  //   console.log("VISIBLE PDF PAGES:", getVisiblePageNumbers());

                  //   setExtractedText("");
                  //   setTranslatedText("");
                  //   setTranslationError("");
                  // }}

                  onFlip={(event) => {
                    const isAutomaticFlip = autoFlipRef.current;

                    autoFlipRef.current = false;

                    setCurrentPage(event.data);

                    setExtractedText("");
                    setTranslatedText("");
                    setTranslationError("");

                    const visiblePages = getVisiblePageNumbers();

                    console.log(
                      "FLIP SOURCE:",
                      isAutomaticFlip ? "automatic" : "manual",
                    );

                    console.log("VISIBLE PDF PAGES:", visiblePages);

                    if (isAutomaticFlip) {
                      const sessionId = pendingAutoFlipSessionRef.current;

                      pendingAutoFlipSessionRef.current = null;

                      if (
                        sessionId === null ||
                        sessionId !== speechSessionRef.current
                      ) {
                        return;
                      }

                      if (!visiblePages.length) {
                        handleStopSpeech();
                        return;
                      }

                      readingQueueRef.current = [...visiblePages];

                      const firstPage = readingQueueRef.current.shift();

                      readNextVisiblePage(firstPage, sessionId);
                      return;
                    }

                    // Manual navigation.
                    const wasReading = [
                      "playing",
                      "loading",
                      "paused",
                    ].includes(readingProgressRef.current.status);

                    handleStopSpeech();

                    // Don't start narration if the reader was already stopped.
                    if (!wasReading || !visiblePages.length) {
                      return;
                    }

                    const sessionId = ++speechSessionRef.current;

                    readingQueueRef.current = [...visiblePages];

                    const firstPage = readingQueueRef.current.shift();

                    readingProgressRef.current.status = "loading";
                    setTtsStatus("loading");

                    readNextVisiblePage(firstPage, sessionId);
                  }}
                  className="book-flip"
                >
                  {/* {pages.map((page, index) => (
                    <FlipPage key={index} page={page} number={index + 1} />
                  ))} */}

                  {Array.from({ length: totalPages }, (_, index) => (
                    <FlipPage
                      key={`${product.id}-${index}`}
                      pdfDocument={pdfDocument}
                      number={index + 1}
                      shouldRender={Math.abs(index - currentPage) <= 3}
                      zoom={zoom}
                    />
                  ))}
                </HTMLFlipBook>
              </section>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            {product?.docxUrl && (
              <button
                type="button"
                onClick={handleReadDocx}
                disabled={docxLoading}
                style={{ marginRight: "10px" }}
              >
                {docxLoading ? "Loading DOCX..." : "Read Clean DOCX Text"}
              </button>
            )}
            <button
              type="button"
              onClick={extractCurrentPageText}
              disabled={extracting}
            >
              {extracting ? "Extracting..." : "Extract Page Text"}
            </button>
            <button
              type="button"
              onClick={handleTestOCR}
              style={{ marginLeft: "10px" }}
            >
              Test Marathi OCR
            </button>

            <button
              type="button"
              onClick={handleTestDocxMatch}
              style={{ marginLeft: "10px" }}
            >
              TEST DOCX Matching
            </button>

            <button
              type="button"
              onClick={handleTestPageBoundaries}
              style={{ marginLeft: "10px" }}
            >
              Test Page Boundaries
            </button>

            <button
              type="button"
              onClick={handleTestCleanPage}
              style={{ marginLeft: "10px" }}
            >
              Test Clean Page
            </button>

            <div style={{ marginTop: "15px" }}>
              <label htmlFor="pdf-language">Select Language: </label>

              <select
                id="pdf-language"
                value={selectedLanguage}
                onChange={(event) => {
                  setSelectedLanguage(event.target.value);
                  setTranslatedText("");
                  setTranslationError("");
                }}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>

              <button
                type="button"
                onClick={handleTranslate}
                disabled={translating || extracting || !extractedText}
                style={{ marginLeft: "10px" }}
              >
                {translating ? "Translating..." : "Translate"}
              </button>

              {translating && translationProgress && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "#555",
                  }}
                >
                  {translationProgress}
                </p>
              )}
            </div>

            {extractedText && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  background: "#f5f5f5",
                  borderRadius: "10px",
                  textAlign: "left",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <h3>Extracted PDF Text</h3>

                {/* <p>{extractedText}</p> */}
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.8",
                  }}
                >
                  {selectedLanguage === "hi" && translatedText
                    ? translatedText
                    : extractedText}
                </p>

                {translationError && (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    {translationError}
                  </p>
                )}
              </div>
            )}

            {/* DOCX extraction error */}
            {docxError && (
              <p role="alert" style={{ color: "red" }}>
                {docxError}
              </p>
            )}

            {/* Clean DOCX text display */}
            {docxText && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  background: "#f5f5f5",
                  borderRadius: "10px",
                  textAlign: "left",
                  maxHeight: "350px",
                  overflowY: "auto",
                }}
              >
                <h3>Clean DOCX Text</h3>

                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.8",
                  }}
                >
                  {docxText}
                </p>
              </div>
            )}
          </div>

          <div className="reader-controls">
            <select
              value={ttsLanguage}
              onChange={(event) => {
                handleStopSpeech();
                setTtsLanguage(event.target.value);
                setSelectedVoice("");
              }}
            >
              <option value="en-IN">English</option>
              <option value="hi-IN">Hindi</option>
              <option value="mr-IN">Marathi</option>
              <option value="sa-IN">Sanskrit</option>
            </select>

            <select
              value={selectedVoice}
              onChange={(event) => {
                handleStopSpeech();
                setSelectedVoice(event.target.value);
              }}
            >
              <option value="">Default Voice</option>

              {ttsVoices
                .filter((voice) =>
                  voice.lang
                    .toLowerCase()
                    .startsWith(ttsLanguage.split("-")[0].toLowerCase()),
                )
                .map((voice) => (
                  <option
                    key={`${voice.name}-${voice.lang}`}
                    value={voice.name}
                  >
                    {voice.name}
                  </option>
                ))}
            </select>

            <select
              value={ttsSpeed}
              onChange={(event) => setTtsSpeed(Number(event.target.value))}
            >
              <option value={0.75}>0.75× Slow</option>
              <option value={1}>1× Normal</option>
              <option value={1.25}>1.25× Fast</option>
              <option value={1.5}>1.5× Faster</option>
            </select>

            <button
              type="button"
              onClick={handleSpeakPage}
              disabled={ttsStatus === "loading"}
            >
              {ttsStatus === "paused"
                ? "▶ Resume"
                : ttsStatus === "playing"
                  ? "🔊 Playing"
                  : "🔊 Listen"}
            </button>

            <button
              type="button"
              onClick={handlePauseSpeech}
              disabled={ttsStatus !== "playing"}
            >
              ⏸ Pause
            </button>

            <button
              type="button"
              onClick={handleStopSpeech}
              disabled={ttsStatus === "idle"}
            >
              ⏹ Stop
            </button>
          </div>

          <nav className="reader-controls" aria-label="Book navigation">
            <button
              type="button"
              onClick={goPrevious}
              disabled={currentPage === 0}
            >
              ← Previous
            </button>

            <span>
              {/* Page {currentPage + 1} of {pages.length} */}
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              type="button"
              onClick={goNext}
              // disabled={currentPage >= pages.length - 1}
              disabled={currentPage >= totalPages - 1}
            >
              Next →
            </button>
          </nav>
        </>
      )}
    </main>
  );
}
