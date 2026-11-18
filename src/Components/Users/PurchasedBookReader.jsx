
// import React, {
//   forwardRef,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
// import "../../BookReader.css";
// import Chant from "./Chant"

// import { getReadablePageText } from "../../Services/BookTextService";


// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// // const API_URL = "http://localhost:4000" || "https://sks-serverproject-new.onrender.com";
// const API_URL = "https://sks-serverproject-new.onrender.com";

// const PurchasedPage = forwardRef(function PurchasedPage(
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
//         const page = await pdfDocument.getPage(number);
//         if (cancelled || !canvasRef.current) return;

//         const canvas = canvasRef.current;
//         const viewport = page.getViewport({ scale: 1.5 });

//         canvas.width = Math.ceil(viewport.width);
//         canvas.height = Math.ceil(viewport.height);

//         renderTask = page.render({
//           canvasContext: canvas.getContext("2d"),
//           viewport,
//         });

//         await renderTask.promise;
//       } catch (error) {
//         if (
//           error?.name !== "RenderingCancelledException" &&
//           !cancelled
//         ) {
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

// export default function PurchasedBookReader() {
//   const { productId } = useParams();
//   const flipBookRef = useRef(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [bookTitle, setBookTitle] = useState("");
//   const [pdfDocument, setPdfDocument] = useState(null);
//   const [totalPages, setTotalPages] = useState(0);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [zoom, setZoom] = useState(100);


//   const [speakingStatus, setSpeakingStatus] = useState("idle");
//   const [speakingError, setSpeakingError] = useState("");
//   const [speechRate, setSpeechRate] = useState(0.9);
//   const [speechVoices, setSpeechVoices] = useState([]);
//   const [selectedVoice, setSelectedVoice] = useState("");

//   const speechSessionRef = useRef(0);
//   const speechPausedRef = useRef(false);
//   const speechTimeoutRef = useRef(null);
//   const speechUtteranceRef = useRef(null);
//   const speechStatusRef = useRef("idle");

//   const autoFlipTargetRef = useRef(null);

//   const pagePreparationCacheRef = useRef(new Map());
//   const pendingSpeechContinuationRef = useRef(null);

//   const autoFlipContinuationRef = useRef(null);

//   const [docxUrl, setDocxUrl] = useState("");

//   const [isChantProduct, setIsChantProduct] = useState(false);

//   useEffect(() => {
//     const controller = new AbortController();
//     let loadingTask;
//     let objectUrl;
//     let docxObjectUrl;

//     async function loadPurchasedBook() {
//       setLoading(true);
//       setError("");
//       setBookTitle("");
//       setPdfDocument(null);
//       setTotalPages(0);
//       setCurrentPage(0);
//       setDocxUrl("");
//       setIsChantProduct(false);

//       try {
//         const token = sessionStorage.getItem("authToken");

//         if (!token) {
//           throw new Error("Please log in to read your book.");
//         }

//         const headers = {
//           Authorization: `Bearer ${token}`,
//         };

//         const accessResponse = await axios.get(
//           `${API_URL}/api/library/${productId}/access`,
//           { headers, signal: controller.signal }
//         );

//         if (accessResponse.data?.data?.hasAccess !== true) {
//           throw new Error("Purchase required to read this book.");
//         }

//         // Get the purchased book title.
//         const booksResponse = await axios.get(
//           `${API_URL}/api/library/my-books`,
//           { headers, signal: controller.signal }
//         );

//         const purchasedBook = booksResponse.data?.data?.find(
//           (book) => Number(book.product_id) === Number(productId)
//         );

//         setBookTitle(purchasedBook?.title || "My Purchased Book");

//         if (Number(productId) === 1){
//           setIsChantProduct(true);
//           return;
//         }

//         // Download the protected PDF with authentication.
//         const pdfResponse = await axios.get(
//           `${API_URL}/api/library/${productId}/pdf`,
//           {
//             headers,
//             responseType: "blob",
//             signal: controller.signal,
//           }
//         );

//         if (controller.signal.aborted) return;

//         objectUrl = URL.createObjectURL(pdfResponse.data);

//         loadingTask = pdfjsLib.getDocument({
//           url: objectUrl,
//         });

//         const pdf = await loadingTask.promise;

//         if (controller.signal.aborted) return;

//         setPdfDocument(pdf);
//         setTotalPages(pdf.numPages);

//         const docxResponse = await axios.get(
//           `${API_URL}/api/library/${productId}/docx`,
//           {
//             headers,
//             responseType: "blob",
//             signal: controller.signal,
//           }
//         );

//         if (controller.signal.aborted) return;

//         const purchasedDocxUrl = URL.createObjectURL(docxResponse.data);
//         docxObjectUrl = purchasedDocxUrl;
//         setDocxUrl(purchasedDocxUrl);


//       } catch (err) {
//         if (
//           controller.signal.aborted ||
//           err.code === "ERR_CANCELED"
//         ) {
//           return;
//         }

//         console.error("Purchased book loading failed:", err);

//         if (err.response?.status === 404) {
//           setError("This book's PDF has not been uploaded yet.");
//         } else if (err.response?.status === 401) {
//           setError("Your session has expired. Please log in again.");
//         } else if (err.response?.status === 403) {
//           setError("You do not have access to this book.");
//         } else {
//           setError(err.message || "Unable to load purchased book.");
//         }
//       } finally {
//         if (!controller.signal.aborted) {
//           setLoading(false);
//         }
//       }
//     }

//     loadPurchasedBook();

//     return () => {

//       speechSessionRef.current += 1;

//       if (speechTimeoutRef.current) {
//         clearTimeout(speechTimeoutRef.current);
//       }

//       if ("speechSynthesis" in window) {
//         window.speechSynthesis.cancel();
//       }

//       controller.abort();
//       loadingTask?.destroy();
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//       if (docxObjectUrl) URL.revokeObjectURL(docxObjectUrl);
//     };
//   }, [productId]);

//   async function testCurrentPageText() {
//     try {
//       const pageNumber = currentPage + 1;

//       const text = await getReadablePageText({
//         docxUrl,
//         pdfDocument,
//         pageNumber,
//       });

//       console.log("PURCHASED BOOK PAGE:", pageNumber);
//       console.log("MATCHED DOCX TEXT:", text);
//       alert(`Page ${pageNumber}: ${text.length} characters matched.`);
//     } catch (error) {
//       console.error("Purchased page matching failed:", error);
//       alert(error.message);
//     }
//   }

//   useEffect(() => {
//     if (!("speechSynthesis" in window)) {
//       setSpeakingError("Browser speech is not supported.");
//       return;
//     }

//     function loadVoices() {
//       const voices = window.speechSynthesis.getVoices();

//       setSpeechVoices(voices);

//       setSelectedVoice((previous) => {
//         if (previous) return previous;

//         const preferred =
//           voices.find((voice) => voice.lang.toLowerCase() === "mr-in") ||
//           voices.find((voice) => voice.lang.toLowerCase() === "hi-in") ||
//           voices.find((voice) => voice.lang.toLowerCase().startsWith("hi")) ||
//           voices[0];

//         return preferred?.voiceURI || "";
//       });
//     }

//     loadVoices();
//     window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

//     return () => {
//       window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
//     };
//   }, []);



//   function stopSpeaking() {
//     speechSessionRef.current += 1;
//     autoFlipTargetRef.current = null;
//     pendingSpeechContinuationRef.current = null;
//     autoFlipContinuationRef.current = null;
//     speechPausedRef.current = false;
//     speechStatusRef.current = "idle";



//     if (speechTimeoutRef.current) {
//       clearTimeout(speechTimeoutRef.current);
//       speechTimeoutRef.current = null;
//     }

//     speechUtteranceRef.current = null;

//     if ("speechSynthesis" in window) {
//       window.speechSynthesis.cancel();
//     }

//     setSpeakingStatus("idle");
//   }

//   function pauseSpeaking() {
//     if (!("speechSynthesis" in window)) return;
//     if (speechStatusRef.current !== "speaking") return;

//     speechPausedRef.current = true;
//     speechStatusRef.current = "paused";

//     window.speechSynthesis.pause();
//     setSpeakingStatus("paused");
//   }

//   function resumeSpeaking() {
//     if (!("speechSynthesis" in window)) return;
//     if (speechStatusRef.current !== "paused") return;

//     speechPausedRef.current = false;
//     speechStatusRef.current = "speaking";

//     window.speechSynthesis.resume();
//     setSpeakingStatus("speaking");

//     const continuation = pendingSpeechContinuationRef.current;

//     if (typeof continuation === "function") {
//       pendingSpeechContinuationRef.current = null;
//       continuation();
//     }
//   }

//   function prepareSpeechChunks(text) {
//     const normalized = String(text || "")
//       .replace(/\r\n/g, "\n")
//       .replace(/[ \t]+/g, " ")
//       .trim();

//     const paragraphs = normalized
//       .split(/\n\s*\n/)
//       .filter(Boolean);

//     const chunks = [];

//     for (const paragraph of paragraphs) {
//       const sentences = paragraph
//         .split(/(?<=[।॥.!?])\s+/u)
//         .filter(Boolean);

//       for (const sentence of sentences) {
//         // Keep utterances reasonably short for browser TTS.
//         const words = sentence.split(/\s+/);
//         let buffer = "";

//         for (const word of words) {
//           if (buffer && (buffer + " " + word).length > 180) {
//             chunks.push({
//               text: buffer,
//               pauseMs: 180,
//             });
//             buffer = word;
//           } else {
//             buffer = buffer ? `${buffer} ${word}` : word;
//           }
//         }

//         if (buffer) {
//           chunks.push({
//             text: buffer,
//             pauseMs: 350,
//           });
//         }
//       }

//       if (chunks.length) {
//         chunks[chunks.length - 1].pauseMs = 650;
//       }
//     }

//     return chunks;
//   }


//   function preparePageForSpeech(pageNumber) {
//     if (!docxUrl || !pdfDocument) {
//       return Promise.reject(new Error("PDF or DOCX is not ready."));
//     }

//     const cache = pagePreparationCacheRef.current;

//     if (cache.has(pageNumber)) {
//       return cache.get(pageNumber);
//     }

//     const promise = getReadablePageText({
//       docxUrl,
//       pdfDocument,
//       pageNumber,
//     })
//       .then((text) => {
//         if (!text?.trim()) {
//           throw new Error(`Page ${pageNumber}: no verified text.`);
//         }
//         return text;
//       })
//       .catch((error) => {
//         if (cache.get(pageNumber) === promise) {
//           cache.delete(pageNumber);
//         }
//         throw error;
//       });

//     cache.set(pageNumber, promise);
//     return promise;
//   }


//   async function startSpeaking() {
//     if (!("speechSynthesis" in window)) {
//       setSpeakingError("Browser speech is not supported.");
//       return;
//     }

//     if (!docxUrl || !pdfDocument) return;

//     stopSpeaking();
//     setSpeakingError("");

//     const sessionId = speechSessionRef.current;
//     const synth = window.speechSynthesis;
//     const flip = flipBookRef.current?.pageFlip();

//     const initialPage = flip?.getCurrentPageIndex() ?? currentPage;

//     const voice = speechVoices.find(
//       (item) => item.voiceURI === selectedVoice
//     );

//     function active() {
//       return sessionId === speechSessionRef.current;
//     }

//     function fail(error, pageIndex) {
//       if (!active()) return;
//       stopSpeaking();
//       setSpeakingError(
//         `Page ${pageIndex + 1}: ${error.message || error}`
//       );
//       console.error("Continuous reading failed:", error);
//     }

//     function waitWhilePaused(next) {
//       if (!active()) return;

//       if (speechPausedRef.current) {
//         pendingSpeechContinuationRef.current = next;
//         speechStatusRef.current = "paused";
//         setSpeakingStatus("paused");
//         return;
//       }

//       pendingSpeechContinuationRef.current = null;
//       next();
//     }

//     function scheduleNext(next, delay) {
//       if (!active()) return;

//       speechTimeoutRef.current = setTimeout(() => {
//         speechTimeoutRef.current = null;
//         waitWhilePaused(next);
//       }, delay);
//     }

//     async function readPage(pageIndex) {
//       if (!active()) return;

//       speechStatusRef.current = "loading";
//       setSpeakingStatus("loading");

//       try {
//         const text = await preparePageForSpeech(pageIndex + 1);
//         console.log("TTS PAGE:", pageIndex + 1);
// console.log("TTS TEXT START:", text.slice(0, 500));

//         if (!active()) return;

//         const chunks = prepareSpeechChunks(text);

//         if (!chunks.length) {
//           throw new Error("No verified speaking text found.");
//         }

//         // Prepare next page while current page is speaking.
//         if (pageIndex + 1 < totalPages) {
//           preparePageForSpeech(pageIndex + 2).catch((error) => {
//             if (active()) {
//               console.warn(
//                 "Next page preparation failed:",
//                 pageIndex + 2,
//                 error
//               );
//             }
//           });
//         }

//         let chunkIndex = 0;

//         function speakNext() {
//           if (!active()) return;

//           waitWhilePaused(() => {
//             if (!active()) return;

//             if (chunkIndex >= chunks.length) {
//               advancePage(pageIndex);
//               return;
//             }

//             const chunk = chunks[chunkIndex];
//             const utterance = new SpeechSynthesisUtterance(chunk.text);

//             if (voice) utterance.voice = voice;

//             utterance.lang = voice?.lang || "mr-IN";
//             utterance.rate = speechRate;
//             utterance.pitch = 1;
//             utterance.volume = 1;

//             speechUtteranceRef.current = utterance;

//             utterance.onstart = () => {
//               if (!active()) return;
//               if (speechPausedRef.current) {
//                 synth.pause();
//                 return;
//               }
//               speechStatusRef.current = "speaking";
//               setSpeakingStatus("speaking");
//             };

//             utterance.onend = () => {
//               if (!active()) return;

//               chunkIndex += 1;
//               speechUtteranceRef.current = null;

//               scheduleNext(speakNext, chunk.pauseMs);
//             };

//             utterance.onerror = (event) => {
//               if (!active()) return;

//               if (
//                 event.error === "canceled" ||
//                 event.error === "interrupted"
//               ) return;

//               fail(new Error(`Speech failed: ${event.error}`), pageIndex);
//             };

//             synth.speak(utterance);
//           });
//         }

//         waitWhilePaused(speakNext);
//       } catch (error) {
//         fail(error, pageIndex);
//       }
//     }


//     function advancePage(pageIndex) {
//       if (!active()) return;

//       const nextIndex = pageIndex + 1;

//       if (nextIndex >= totalPages) {
//         speechStatusRef.current = "idle";
//         setSpeakingStatus("idle");
//         return;
//       }

//       waitWhilePaused(() => {
//         if (!active()) return;

//         const flip = flipBookRef.current?.pageFlip();

//         if (!flip) {
//           fail(new Error("Flipbook unavailable."), pageIndex);
//           return;
//         }

//         const visiblePageIndices = flip.getPageCount
//           ? (() => {
//             const current = flip.getCurrentPageIndex();
//             const isPortrait =
//               flip.getSettings?.()?.usePortrait &&
//               flip.getOrientation?.() === "portrait";

//             if (isPortrait) return [current];

//             // Desktop spread: cover occupies its own spread.
//             if (current === 0) return [0];

//             const spreadStart = current % 2 === 1
//               ? current
//               : current - 1;

//             return [spreadStart, spreadStart + 1];
//           })()
//           : [pageIndex];

//         // Next page already visible: read without flipping.
//         if (visiblePageIndices.includes(nextIndex)) {
//           readPage(nextIndex);
//           return;
//         }

//         // Otherwise turn the physical book page.
//         const currentIndex = flip.getCurrentPageIndex();

//         // Target is the next visible spread's first page.
//         const expectedIndex =
//           currentIndex === 0
//             ? 1
//             : currentIndex % 2 === 0
//               ? currentIndex + 1
//               : currentIndex + 2;

//         autoFlipTargetRef.current = expectedIndex;

//         autoFlipContinuationRef.current = () => {
//           if (!active()) return;

//           autoFlipContinuationRef.current = null;
//           scheduleNext(() => readPage(nextIndex), 100);
//         };

//         flip.flipNext();

//         speechTimeoutRef.current = setTimeout(() => {
//           if (!active()) return;

//           if (autoFlipTargetRef.current !== null) {
//             fail(
//               new Error("Automatic page flip did not complete."),
//               pageIndex
//             );
//           }
//         }, 2500);
//       });
//     }


//     // Used by the onFlip handler to continue the same speech session.
//     // pendingSpeechContinuationRef.current = {
//     //   onAutoFlip(nextIndex) {
//     //     if (!active()) return;

//     //     if (speechTimeoutRef.current) {
//     //       clearTimeout(speechTimeoutRef.current);
//     //       speechTimeoutRef.current = null;
//     //     }

//     //     scheduleNext(() => readPage(nextIndex), 100);
//     //   },
//     // };

//     readPage(initialPage);
//   }




//   function goPrevious() {
//     flipBookRef.current?.pageFlip()?.flipPrev();
//   }

//   function goNext() {
//     flipBookRef.current?.pageFlip()?.flipNext();
//   }

//   if (loading) {
//     return (
//       <div className="reader-message">
//         Preparing your purchased book...
//       </div>
//     );
//   }

//   if (isChantProduct) {
//     return <Chant />
//   }

//   if (error || !pdfDocument) {
//     return (
//       <div className="reader-message" role="alert">
//         {error || "Unable to open this book."}
//       </div>
//     );
//   }

//   return (
//     <main className="reader-page">
//       <section className="reader-heading">
//         <p className="reader-eyebrow">MY DIGITAL LIBRARY</p>
//         <h1>{bookTitle}</h1>
//         <p>Enjoy reading your purchased eBook.</p>
//       </section>

//       <nav className="reader-zoom-toolbar">
//         <span className="reader-zoom-label">Reading View</span>

//         <div className="reader-zoom-actions">
//           <button
//             type="button"
//             onClick={() => setZoom((z) => Math.max(75, z - 25))}
//             disabled={zoom <= 75}
//           >
//             -
//           </button>

//           <span className="reader-zoom-level">{zoom}%</span>

//           <button
//             type="button"
//             onClick={() => setZoom((z) => Math.min(200, z + 25))}
//             disabled={zoom >= 200}
//           >
//             +
//           </button>

//           <button
//             type="button"
//             className="reader-zoom-reset"
//             onClick={() => setZoom(100)}
//           >
//             Reset
//           </button>
//         </div>
//       </nav>



//       <section className="reader-zoom-toolbar" aria-label="Speaking controls">
//         <span className="reader-zoom-label">
//           Read Aloud — Page {currentPage + 1}
//         </span>

//         <div className="reader-zoom-actions" style={{ flexWrap: "wrap" }}>
//           <button
//             type="button"
//             onClick={startSpeaking}
//             disabled={!docxUrl || speakingStatus === "loading"}
//             style={{ fontSize: 13 }}
//           >
//             {speakingStatus === "loading" ? "Matching text..." : "🔊 Read Aloud"}
//           </button>

//           <button
//             type="button"
//             onClick={pauseSpeaking}
//             disabled={speakingStatus !== "speaking"}
//             style={{ fontSize: 13 }}
//           >
//             Pause
//           </button>

//           <button
//             type="button"
//             onClick={resumeSpeaking}
//             disabled={speakingStatus !== "paused"}
//             style={{ fontSize: 13 }}
//           >
//             Resume
//           </button>

//           <button
//             type="button"
//             onClick={stopSpeaking}
//             disabled={speakingStatus === "idle"}
//             style={{ fontSize: 13 }}
//           >
//             Stop
//           </button>
//         </div>

//         <div className="reader-zoom-actions" style={{ flexWrap: "wrap" }}>
//           <label htmlFor="purchased-voice">Voice</label>

//           <select
//             id="purchased-voice"
//             value={selectedVoice}
//             onChange={(event) => setSelectedVoice(event.target.value)}
//             style={{ maxWidth: 220, padding: 8 }}
//           >
//             {speechVoices.map((voice) => (
//               <option key={voice.voiceURI} value={voice.voiceURI}>
//                 {voice.name} ({voice.lang})
//               </option>
//             ))}
//           </select>

//           <label htmlFor="purchased-speed">Speed</label>

//           <select
//             id="purchased-speed"
//             value={speechRate}
//             onChange={(event) => setSpeechRate(Number(event.target.value))}
//             style={{ padding: 8 }}
//           >
//             <option value={0.75}>0.75x</option>
//             <option value={0.9}>0.9x</option>
//             <option value={1}>1x</option>
//             <option value={1.15}>1.15x</option>
//           </select>
//         </div>

//         {speakingError && (
//           <p role="alert" style={{ color: "#b42318", width: "100%" }}>
//             {speakingError}
//           </p>
//         )}
//       </section>

//       <div className="reader-book-viewport">
//         <div
//           className="reader-book-zoom"
//           style={{ zoom: zoom / 100 }}
//         >
//           <section className="book-stage">
//             <HTMLFlipBook
//               key={productId}
//               ref={flipBookRef}
//               width={380}
//               height={520}
//               size="stretch"
//               minWidth={260}
//               maxWidth={760}
//               minHeight={360}
//               maxHeight={620}
//               showCover
//               usePortrait
//               mobileScrollSupport
//               drawShadow
//               flippingTime={650}
//               maxShadowOpacity={0.45}
//               // onFlip={(event) => setCurrentPage(event.data)}

//               onFlip={(event) => {
//                 const nextPage = event.data;
//                 setCurrentPage(nextPage);

//                 if (autoFlipTargetRef.current === nextPage) {
//                   autoFlipTargetRef.current = null;

//                   if (speechTimeoutRef.current) {
//                     clearTimeout(speechTimeoutRef.current);
//                     speechTimeoutRef.current = null;
//                   }

//                   const continuation = autoFlipContinuationRef.current;

//                   if (typeof continuation === "function") {
//                     continuation();
//                   }

//                   return;
//                 }

//                 if (speechStatusRef.current !== "idle") {
//                   stopSpeaking();
//                 }
//               }}

//               className="book-flip"
//             >
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <PurchasedPage
//                   key={`${productId}-${index}`}
//                   pdfDocument={pdfDocument}
//                   number={index + 1}
//                   shouldRender={Math.abs(index - currentPage) <= 3}
//                 />
//               ))}
//             </HTMLFlipBook>
//           </section>
//         </div>
//       </div>

//       <div className="reader-controls">
//         <button
//           type="button"
//           onClick={goPrevious}
//           disabled={currentPage === 0}
//         >
//           Previous
//         </button>

//         <span>
//           Page {currentPage + 1} of {totalPages}
//         </span>

//         <button
//           type="button"
//           onClick={goNext}
//           disabled={currentPage >= totalPages - 1}
//         >
//           Next
//         </button>

//         <button type="button" onClick={testCurrentPageText} disabled={!docxUrl}>
//           Test Speaking Text
//         </button>
//       </div>
//     </main>
//   );
// }







//////////////////// 14/11/2026 ///////////////////////////


import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "../../BookReader.css";
import Chant from "./Chant"

import {
  prepareMixedSpeechChunks,
} from "../../Services/MixedBookTextService";

import { getReadablePageText } from "../../Services/BookTextService";


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// const API_URL = "http://localhost:4000" || "https://sks-serverproject-new.onrender.com";
const API_URL = "https://sks-serverproject-new.onrender.com";

const BOOK_TTS_API_URL = "http://localhost:4000";

const BOOK_TTS_VOICES = [
  { id: "mr-IN-AarohiNeural", name: "Aarohi — Marathi Female" },
  { id: "mr-IN-ManoharNeural", name: "Manohar — Marathi Male" },
  { id: "hi-IN-SwaraNeural", name: "Swara — Hindi Female" },
  { id: "hi-IN-MadhurNeural", name: "Madhur — Hindi Male" },
  { id: "en-IN-NeerjaNeural", name: "Neerja — English Female" },
  { id: "en-IN-PrabhatNeural", name: "Prabhat — English Male" },
];

// const PurchasedPage = forwardRef(function PurchasedPage(
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
//         const page = await pdfDocument.getPage(number);
//         if (cancelled || !canvasRef.current) return;

//         const canvas = canvasRef.current;
//         const viewport = page.getViewport({ scale: 1.5 });

//         canvas.width = Math.ceil(viewport.width);
//         canvas.height = Math.ceil(viewport.height);

//         renderTask = page.render({
//           canvasContext: canvas.getContext("2d"),
//           viewport,
//         });

//         await renderTask.promise;
//       } catch (error) {
//         if (
//           error?.name !== "RenderingCancelledException" &&
//           !cancelled
//         ) {
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



const PurchasedPage = forwardRef(function PurchasedPage(
  { pdfDocument, number, shouldRender, zoom },
  ref
) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
          // Previous rendering was cancelled.
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

        const displayWidth =
          container.offsetWidth * (zoom / 100) * 1.5;

        if (displayWidth <= 0) return;

        const baseViewport = pdfPage.getViewport({ scale: 1 });

        const dpr = Math.min(
          Math.max(window.devicePixelRatio || 1, 2),
          2.5
        );

        const targetScale =
          (displayWidth / baseViewport.width) * dpr;

        const maxPixels = 12000000;
        const maxDimension = 4096;

        const scaleLimit = Math.min(
          maxDimension / baseViewport.width,
          maxDimension / baseViewport.height,
          Math.sqrt(
            maxPixels /
            (baseViewport.width * baseViewport.height)
          )
        );

        const renderScale = Math.min(
          targetScale,
          scaleLimit
        );

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
      } catch (error) {
        if (
          !cancelled &&
          version === renderVersion &&
          error?.name !== "RenderingCancelledException"
        ) {
          console.error("Purchased PDF rendering failed:", error);
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


export default function PurchasedBookReader() {



  const { productId } = useParams();

  const isMixedLanguageBook = Number(productId) === 9;
  const useStrictBoundaryRecovery = Number(productId) === 29;

  const flipBookRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [pdfDocument, setPdfDocument] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  // const [currentPage, setCurrentPage] = useState(0);

  const userId = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null")?.id;
    } catch {
      return null;
    }
  })();

  const progressKey = userId
    ? `sks_reading_progress_${userId}_${productId}`
    : null;

  const getSavedPage = () => {
    if (!progressKey) return 0;

    const saved = Number(localStorage.getItem(progressKey));

    return Number.isSafeInteger(saved) && saved >= 0 ? saved : 0;
  };


  const [currentPage, setCurrentPage] = useState(getSavedPage);
  const [zoom, setZoom] = useState(100);

  const [speakingStatus, setSpeakingStatus] = useState("idle");
  const [speakingError, setSpeakingError] = useState("");
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechVoices, setSpeechVoices] = useState([]);
  // const [selectedVoice, setSelectedVoice] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(
    "mr-IN-AarohiNeural"
  );

  const speechSessionRef = useRef(0);
  const speechPausedRef = useRef(false);
  const speechTimeoutRef = useRef(null);
  const speechUtteranceRef = useRef(null);
  const speechStatusRef = useRef("idle");

  const autoFlipTargetRef = useRef(null);

  // 

  const autoFlipTimeoutRef = useRef(null);
  const autoFlipRetryRef = useRef(0);

  const pagePreparationCacheRef = useRef(new Map());
  const pendingSpeechContinuationRef = useRef(null);

  const autoFlipContinuationRef = useRef(null);

  const [docxUrl, setDocxUrl] = useState("");

  const [isChantProduct, setIsChantProduct] = useState(false);

  const ttsAudioRef = useRef(null);
  const ttsAbortRef = useRef(null);
  const ttsAudioUrlRef = useRef(null);

  const ttsControllersRef = useRef(new Set());

  useEffect(() => {
    const controller = new AbortController();
    let loadingTask;
    let objectUrl;
    let docxObjectUrl;

    async function loadPurchasedBook() {
      pagePreparationCacheRef.current.clear();



      setLoading(true);
      setError("");
      setBookTitle("");
      setPdfDocument(null);
      setTotalPages(0);
      // setCurrentPage(0);
      setCurrentPage(getSavedPage());
      setDocxUrl("");
      setIsChantProduct(false);
      pagePreparationCacheRef.current.clear();

      try {
        const token = sessionStorage.getItem("authToken");

        if (!token) {
          throw new Error("Please log in to read your book.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const accessResponse = await axios.get(
          `${API_URL}/api/library/${productId}/access`,
          { headers, signal: controller.signal }
        );

        if (accessResponse.data?.data?.hasAccess !== true) {
          throw new Error("Purchase required to read this book.");
        }

        // Get the purchased book title.
        const booksResponse = await axios.get(
          `${API_URL}/api/library/my-books`,
          { headers, signal: controller.signal }
        );

        const purchasedBook = booksResponse.data?.data?.find(
          (book) => Number(book.product_id) === Number(productId)
        );

        setBookTitle(purchasedBook?.title || "My Purchased Book");

        if (Number(productId) === 1) {
          setIsChantProduct(true);
          return;
        }

        // Download the protected PDF with authentication.
        const pdfResponse = await axios.get(
          `${API_URL}/api/library/${productId}/pdf`,
          {
            headers,
            responseType: "blob",
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        objectUrl = URL.createObjectURL(pdfResponse.data);

        loadingTask = pdfjsLib.getDocument({
          url: objectUrl,
        });

        const pdf = await loadingTask.promise;

        if (controller.signal.aborted) return;


        // setPdfDocument(pdf);
        // setTotalPages(pdf.numPages);

        const restoredPage = Math.min(getSavedPage(), pdf.numPages - 1);

        setCurrentPage(restoredPage);
        setTotalPages(pdf.numPages);
        setPdfDocument(pdf);

        const docxResponse = await axios.get(
          `${API_URL}/api/library/${productId}/docx`,
          {
            headers,
            responseType: "blob",
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        const purchasedDocxUrl = URL.createObjectURL(docxResponse.data);
        docxObjectUrl = purchasedDocxUrl;
        setDocxUrl(purchasedDocxUrl);


      } catch (err) {
        if (
          controller.signal.aborted ||
          err.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error("Purchased book loading failed:", err);

        if (err.response?.status === 404) {
          setError("This book's PDF has not been uploaded yet.");
        } else if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else if (err.response?.status === 403) {
          setError("You do not have access to this book.");
        } else {
          setError(err.message || "Unable to load purchased book.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPurchasedBook();

    return () => {

      speechSessionRef.current += 1;

      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      ttsAbortRef.current?.abort();
      ttsAbortRef.current = null;

      for (const controller of ttsControllersRef.current) {
        controller.abort();
      }
      ttsControllersRef.current.clear();

      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current.onended = null;
        ttsAudioRef.current.onerror = null;
        ttsAudioRef.current = null;
      }

      if (ttsAudioUrlRef.current) {
        URL.revokeObjectURL(ttsAudioUrlRef.current);
        ttsAudioUrlRef.current = null;
      }

      controller.abort();
      loadingTask?.destroy();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (docxObjectUrl) URL.revokeObjectURL(docxObjectUrl);
    };
  }, [productId]);

  async function testCurrentPageText() {
    try {
      const pageNumber = currentPage + 1;

      const text = await getReadablePageText({
        docxUrl,
        pdfDocument,
        pageNumber,
        language: isMixedLanguageBook ? "mixed" : undefined,
        strictBoundaryRecovery: useStrictBoundaryRecovery,

      });

      console.log("PURCHASED BOOK PAGE:", pageNumber);
      console.log("MATCHED DOCX TEXT:", text);
      alert(`Page ${pageNumber}: ${text.length} characters matched.`);
    } catch (error) {
      console.error("Purchased page matching failed:", error);
      alert(error.message);
    }
  }

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setSpeakingError("Browser speech is not supported.");
      return;
    }

    function loadVoices() {
      const voices = window.speechSynthesis.getVoices();

      setSpeechVoices(voices);

      setSelectedVoice((previous) => {
        if (previous) return previous;

        const preferred =
          voices.find((voice) => voice.lang.toLowerCase() === "mr-in") ||
          voices.find((voice) => voice.lang.toLowerCase().startsWith("mr")) ||
          voices.find((voice) => voice.lang.toLowerCase() === "en-in") ||
          voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
          voices.find((voice) => voice.lang.toLowerCase().startsWith("hi")) ||
          voices[0];

        return preferred?.voiceURI || "";
      });
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);



  function stopSpeaking() {
    speechSessionRef.current += 1;

    ttsAbortRef.current?.abort();
    ttsAbortRef.current = null;

    for (const controller of ttsControllersRef.current) {
      controller.abort();
    }
    ttsControllersRef.current.clear();

    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current.onended = null;
      ttsAudioRef.current.onerror = null;
      ttsAudioRef.current = null;
    }

    if (ttsAudioUrlRef.current) {
      URL.revokeObjectURL(ttsAudioUrlRef.current);
      ttsAudioUrlRef.current = null;
    }





    autoFlipTargetRef.current = null;
    pendingSpeechContinuationRef.current = null;
    autoFlipContinuationRef.current = null;
    speechPausedRef.current = false;
    speechStatusRef.current = "idle";



    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }

    if (autoFlipTimeoutRef.current) {
      clearTimeout(autoFlipTimeoutRef.current);
      autoFlipTimeoutRef.current = null;
    }

    autoFlipRetryRef.current = 0;

    speechUtteranceRef.current = null;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeakingStatus("idle");
  }

  function pauseSpeaking() {
    if (!("speechSynthesis" in window)) return;
    if (speechStatusRef.current !== "speaking") return;

    speechPausedRef.current = true;
    speechStatusRef.current = "paused";

    window.speechSynthesis.pause();
    ttsAudioRef.current?.pause();
    setSpeakingStatus("paused");
  }

  function resumeSpeaking() {
    if (!("speechSynthesis" in window)) return;
    if (speechStatusRef.current !== "paused") return;

    speechPausedRef.current = false;
    speechStatusRef.current = "speaking";

    window.speechSynthesis.resume();
    // if (ttsAudioRef.current?.paused) {
    if (
      ttsAudioRef.current?.paused &&
      ttsAudioRef.current.currentTime > 0
    ) {
      ttsAudioRef.current.play().catch((error) => {
        console.error("TTS resume failed:", error);
        setSpeakingError("Unable to resume audio.");
      });
    }

    setSpeakingStatus("speaking");

    const continuation = pendingSpeechContinuationRef.current;

    if (typeof continuation === "function") {
      pendingSpeechContinuationRef.current = null;
      continuation();
    }
  }

  // function prepareSpeechChunks(text) {
  //   const normalized = String(text || "")
  //     .replace(/\r\n/g, "\n")
  //     .replace(/[ \t]+/g, " ")
  //     .trim();

  //   const paragraphs = normalized
  //     .split(/\n\s*\n/)
  //     .filter(Boolean);

  //   const chunks = [];

  //   for (const paragraph of paragraphs) {
  //     const sentences = paragraph
  //       .split(/(?<=[।॥.!?])\s+/u)
  //       .filter(Boolean);

  //     for (const sentence of sentences) {
  //       // Keep utterances reasonably short for browser TTS.
  //       const words = sentence.split(/\s+/);
  //       let buffer = "";

  //       for (const word of words) {
  //         if (buffer && (buffer + " " + word).length > 180) {
  //           chunks.push({
  //             text: buffer,
  //             // pauseMs: 180,
  //             pauseMs: 80,
  //           });
  //           buffer = word;
  //         } else {
  //           buffer = buffer ? `${buffer} ${word}` : word;
  //         }
  //       }

  //       if (buffer) {
  //         chunks.push({
  //           text: buffer,
  //           // pauseMs: 350,
  //           pauseMs: 150,
  //         });
  //       }
  //     }

  //     if (chunks.length) {
  //       // chunks[chunks.length - 1].pauseMs = 650;
  //       chunks[chunks.length - 1].pauseMs = 250;
  //     }
  //   }

  //   return chunks;
  // }



  function prepareSpeechChunks(text) {
    const normalized = String(text || "")
      .normalize("NFC")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/([^\n])\n(?!\n)/g, "$1 ")
      .replace(/\n{2,}/g, "\n\n")
      .trim();

    const paragraphs = normalized
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    const chunks = [];

    for (const paragraph of paragraphs) {
      const sentences = paragraph
        .split(/(?<=[।॥.!?])\s+/u)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

      for (const sentence of sentences) {
        const words = sentence.split(/\s+/);
        let buffer = "";

        for (const word of words) {
          if (buffer && (buffer + " " + word).length > 240) {
            chunks.push({
              text: buffer,
              pauseMs: 0,
            });
            buffer = word;
          } else {
            buffer = buffer ? `${buffer} ${word}` : word;
          }
        }

        if (buffer) {
          chunks.push({
            text: buffer,
            pauseMs: 80,
          });
        }
      }

      if (chunks.length) {
        chunks[chunks.length - 1].pauseMs = 150;
      }
    }

    return chunks;
  }

  // const selectedSpeechVoice = speechVoices.find(
  //   (item) => item.voiceURI === selectedVoice
  // );

  // const selectedOCRLanguage = selectedSpeechVoice?.lang || "mr-IN";

  const selectedSpeechVoice = speechVoices.find(
    (item) => item.voiceURI === selectedVoice
  );

  // OCR language is based on the book, not the selected TTS voice.
  // const selectedOCRLanguage = "mr-IN";


  // function preparePageForSpeech(pageNumber) {
  //   if (!docxUrl || !pdfDocument) {
  //     return Promise.reject(new Error("PDF or DOCX is not ready."));
  //   }

  //   const cache = pagePreparationCacheRef.current;

  //   if (cache.has(pageNumber)) {
  //     return cache.get(pageNumber);
  //   }

  //   const promise = getReadablePageText({
  //     docxUrl,
  //     pdfDocument,
  //     pageNumber,
  //     language: selectedOCRLanguage,
  //   })
  //     .then((text) => {
  //       if (!text?.trim()) {
  //         throw new Error(`Page ${pageNumber}: no verified text.`);
  //       }
  //       return text;
  //     })
  //     .catch((error) => {
  //       if (cache.get(pageNumber) === promise) {
  //         cache.delete(pageNumber);
  //       }
  //       throw error;
  //     });

  //   cache.set(pageNumber, promise);
  //   return promise;
  // }


  function preparePageForSpeech(pageNumber) {
    if (!docxUrl || !pdfDocument) {
      return Promise.reject(new Error("PDF or DOCX is not ready."));
    }

    // const language = selectedOCRLanguage;
    const cache = pagePreparationCacheRef.current;

    // const cacheKey = `${pageNumber}:${language}`;
    // const cacheKey = String(pageNumber);
    const cacheKey = `${docxUrl}:${pageNumber}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const promise = getReadablePageText({
      docxUrl,
      pdfDocument,
      pageNumber,
      language: isMixedLanguageBook ? "mixed" : undefined,
      strictBoundaryRecovery: useStrictBoundaryRecovery,

    })
      .then((text) => {
        if (!text?.trim()) {
          throw new Error(`Page ${pageNumber}: no verified text.`);
        }

        console.log(
          "PAGE OCR:",
          "Language automatically detected by BookTextService"
        );

        console.log(
          "PAGE EXTRACTED TEXT:",
          text.slice(0, 500)
        );

        return text;
      })
      .catch((error) => {
        if (cache.get(cacheKey) === promise) {
          cache.delete(cacheKey);
        }

        throw error;
      });

    cache.set(cacheKey, promise);

    return promise;
  }



  async function analyzeTtsSilence(blob, chunkNumber) {
    let audioContext;

    try {
      audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();

      const buffer = await blob.arrayBuffer();
      const decoded = await audioContext.decodeAudioData(buffer);

      const sampleRate = decoded.sampleRate;
      const channels = Array.from(
        { length: decoded.numberOfChannels },
        (_, index) => decoded.getChannelData(index)
      );

      // Diagnostic threshold only. Does not modify audio.
      const threshold = 0.003;
      const frameSize = Math.max(1, Math.round(sampleRate * 0.01));
      const totalFrames = Math.ceil(decoded.length / frameSize);

      function frameHasSound(frameIndex) {
        const start = frameIndex * frameSize;
        const end = Math.min(start + frameSize, decoded.length);

        for (const channel of channels) {
          for (let i = start; i < end; i++) {
            if (Math.abs(channel[i]) > threshold) {
              return true;
            }
          }
        }

        return false;
      }

      let firstSoundFrame = 0;

      while (
        firstSoundFrame < totalFrames &&
        !frameHasSound(firstSoundFrame)
      ) {
        firstSoundFrame++;
      }

      let lastSoundFrame = totalFrames - 1;

      while (
        lastSoundFrame >= firstSoundFrame &&
        !frameHasSound(lastSoundFrame)
      ) {
        lastSoundFrame--;
      }

      const leadingMs = firstSoundFrame * 10;
      const trailingMs =
        (totalFrames - 1 - lastSoundFrame) * 10;

      console.log("TTS SILENCE ANALYSIS:", {
        chunk: chunkNumber,
        durationMs: Math.round(decoded.duration * 1000),
        leadingSilenceMs: leadingMs,
        trailingSilenceMs: trailingMs,
        threshold
      });

    } catch (error) {
      console.warn("TTS silence analysis failed:", error);
    } finally {
      if (audioContext) {
        await audioContext.close().catch(() => { });
      }
    }
  }




  async function startSpeaking() {
    if (!("speechSynthesis" in window)) {
      setSpeakingError("Browser speech is not supported.");
      return;
    }

    if (!docxUrl || !pdfDocument) return;

    stopSpeaking();
    setSpeakingError("");

    const sessionId = speechSessionRef.current;
    const synth = window.speechSynthesis;
    const flip = flipBookRef.current?.pageFlip();

    const initialPage = flip?.getCurrentPageIndex() ?? currentPage;

    const voice = speechVoices.find(
      (item) => item.voiceURI === selectedVoice
    );

    function active() {
      return sessionId === speechSessionRef.current;
    }

    function fail(error, pageIndex) {
      if (!active()) return;
      stopSpeaking();
      setSpeakingError(
        `Page ${pageIndex + 1}: ${error.message || error}`
      );
      console.error("Continuous reading failed:", error);
    }

    // function waitWhilePaused(next) {
    //   if (!active()) return;

    //   // if (speechPausedRef.current) {
    //   //   pendingSpeechContinuationRef.current = next;
    //   //   speechStatusRef.current = "paused";
    //   //   setSpeakingStatus("paused");
    //   //   return;
    //   // }

    //   if (speechPausedRef.current) {
    //     pendingSpeechContinuationRef.current = () => {
    //       if (!active()) return;

    //       speechStatusRef.current = "speaking";
    //       setSpeakingStatus("speaking");

    //       audio.play().catch((error) => {
    //         fail(error, pageIndex);
    //       });
    //     };

    //     return;
    //   }

    //   pendingSpeechContinuationRef.current = null;
    //   next();
    // }


    // async function fetchTtsAudio(text, voice) {
    //   const token = sessionStorage.getItem("authToken");

    //   if (!token) {
    //     throw new Error("Please log in to listen to this book.");
    //   }

    //   const controller = new AbortController();
    //   ttsAbortRef.current = controller;

    //   try {
    //     const response = await fetch(
    //       `${BOOK_TTS_API_URL}/api/book-tts/${productId}/speak`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({ text, voice }),
    //         signal: controller.signal,
    //       }
    //     );

    //     if (!response.ok) {
    //       throw new Error(`TTS request failed: ${response.status}`);
    //     }

    //     return await response.blob();
    //   } finally {
    //     if (ttsAbortRef.current === controller) {
    //       ttsAbortRef.current = null;
    //     }
    //   }
    // }


    function waitWhilePaused(next) {
      if (!active()) return;

      if (speechPausedRef.current) {
        pendingSpeechContinuationRef.current = () => {
          if (!active()) return;
          next();
        };
        return;
      }

      pendingSpeechContinuationRef.current = null;
      next();
    }

    async function fetchTtsAudio(text, voice) {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        throw new Error("Please log in to listen to this book.");
      }

      const controller = new AbortController();
      ttsControllersRef.current.add(controller);

      const startedAt = performance.now();

      try {
        const response = await fetch(
          `${BOOK_TTS_API_URL}/api/book-tts/${productId}/speak`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text, voice }),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`TTS request failed: ${response.status}`);
        }

        const blob = await response.blob();

        console.log(
          "TTS FETCH:",
          voice,
          Math.round(performance.now() - startedAt),
          "ms"
        );

        return blob;
      } finally {
        ttsControllersRef.current.delete(controller);
      }
    }

    function scheduleNext(next, delay) {
      if (!active()) return;

      speechTimeoutRef.current = setTimeout(() => {
        speechTimeoutRef.current = null;
        waitWhilePaused(next);
      }, delay);
    }

    async function readPage(pageIndex) {
      if (!active()) return;

      speechStatusRef.current = "loading";
      setSpeakingStatus("loading");

      try {
        const text = await preparePageForSpeech(pageIndex + 1);
        console.log("TTS PAGE:", pageIndex + 1);
        console.log("TTS TEXT START:", text.slice(0, 500));

        if (!active()) return;

        // const chunks = prepareSpeechChunks(text);

        const chunks = isMixedLanguageBook
          ? prepareMixedSpeechChunks(text)
          : prepareSpeechChunks(text);

        if (!chunks.length) {
          throw new Error("No verified speaking text found.");
        }

        // Prepare next page while current page is speaking.
        if (pageIndex + 1 < totalPages) {
          preparePageForSpeech(pageIndex + 2).catch((error) => {
            if (active()) {
              console.warn(
                "Next page preparation failed:",
                pageIndex + 2,
                error
              );
            }
          });
        }

        let chunkIndex = 0;


        const prefetchedAudio = new Map();

        function getChunkVoice(chunk) {
          return isMixedLanguageBook
            ? chunk.language === "hi-IN"
              ? "hi-IN-SwaraNeural"
              : "en-IN-NeerjaNeural"
            : selectedVoice;
        }

        function getAudioForChunk(index) {
          if (!active()) {
            return Promise.reject(new Error("Reading stopped."));
          }

          if (index >= chunks.length) {
            return Promise.reject(new Error("Chunk not found."));
          }

          if (prefetchedAudio.has(index)) {
            return prefetchedAudio.get(index);
          }

          const chunk = chunks[index];



          // const promise = fetchTtsAudio(
          //   chunk.text,
          //   getChunkVoice(chunk)
          // );

          const startedAt = performance.now();

          const promise = fetchTtsAudio(
            chunk.text,
            getChunkVoice(chunk)
          ).then((blob) => {
            void analyzeTtsSilence(blob, index + 1);
            console.log("PREFETCH READY:", {

              chunk: index + 1,
              durationMs: Math.round(performance.now() - startedAt),
            });

            return blob;
          });

          prefetchedAudio.set(index, promise);

          return promise;
        }

        function prefetchNextChunk(index) {
          const nextIndex = index + 1;

          if (!active() || nextIndex >= chunks.length) return;

          const promise = getAudioForChunk(nextIndex);

          // Attach a rejection handler immediately to avoid
          // unhandled rejections if Stop cancels the request.
          promise.catch((error) => {
            if (active() && error.name !== "AbortError") {
              console.warn("TTS prefetch failed:", error);
            }
          });
        }

        function speakNext() {
          if (!active()) return;

          waitWhilePaused(() => {
            if (!active()) return;

            if (chunkIndex >= chunks.length) {
              advancePage(pageIndex);
              return;
            }

            const chunk = chunks[chunkIndex];
            // const utterance = new SpeechSynthesisUtterance(chunk.text);

            // if (voice) utterance.voice = voice;

            // utterance.lang = voice?.lang || "mr-IN";

            // const utterance = new SpeechSynthesisUtterance(chunk.text);

            // if (isMixedLanguageBook) {
            //   const targetVoice = speechVoices.find((item) =>
            //     item.lang.toLowerCase().startsWith(
            //       chunk.language === "hi-IN" ? "hi" : "en"
            //     )
            //   );

            //   if (targetVoice) {
            //     utterance.voice = targetVoice;
            //   }

            //   utterance.lang = chunk.language;
            // } else {
            //   if (voice) utterance.voice = voice;

            //   utterance.lang = voice?.lang || "mr-IN";
            // }

            // utterance.rate = speechRate;
            // utterance.pitch = 1;
            // utterance.volume = 1;

            // speechUtteranceRef.current = utterance;

            // utterance.onstart = () => {
            //   if (!active()) return;
            //   if (speechPausedRef.current) {
            //     synth.pause();
            //     return;
            //   }
            //   speechStatusRef.current = "speaking";
            //   setSpeakingStatus("speaking");
            // };

            // utterance.onend = () => {
            //   if (!active()) return;

            //   chunkIndex += 1;
            //   speechUtteranceRef.current = null;

            //   scheduleNext(speakNext, chunk.pauseMs);
            // };

            // utterance.onerror = (event) => {
            //   if (!active()) return;

            //   if (
            //     event.error === "canceled" ||
            //     event.error === "interrupted"
            //   ) return;

            //   fail(new Error(`Speech failed: ${event.error}`), pageIndex);
            // };

            // synth.speak(utterance);



            // const ttsVoice =
            //   isMixedLanguageBook && chunk.language === "hi-IN"
            //     ? "hi-IN-SwaraNeural"
            //     : "mr-IN-AarohiNeural";

            // const ttsVoice = isMixedLanguageBook
            //   ? chunk.language === "hi-IN"
            //     ? "hi-IN-SwaraNeural"
            //     : "en-IN-NeerjaNeural"
            //   : selectedVoice;

            // (async () => {
            //   try {
            //     const audioBlob = await fetchTtsAudio(chunk.text, ttsVoice);

            //     if (!active()) return;

            //     const audioUrl = URL.createObjectURL(audioBlob);
            //     ttsAudioUrlRef.current = audioUrl;

            //     const audio = new Audio(audioUrl);
            //     ttsAudioRef.current = audio;

            //     audio.playbackRate = speechRate;

            //     audio.onended = () => {
            //       if (!active()) return;

            //       URL.revokeObjectURL(audioUrl);
            //       ttsAudioUrlRef.current = null;
            //       ttsAudioRef.current = null;

            //       chunkIndex += 1;
            //       scheduleNext(speakNext, chunk.pauseMs);
            //     };

            //     audio.onerror = () => {
            //       if (!active()) return;
            //       fail(new Error("MP3 playback failed."), pageIndex);
            //     };

            //     if (speechPausedRef.current) {
            //       pendingSpeechContinuationRef.current = () => {
            //         if (!active()) return;
            //         speechStatusRef.current = "speaking";
            //         setSpeakingStatus("speaking");
            //         audio.play().catch((error) => fail(error, pageIndex));
            //       };
            //       return;
            //     }

            //     await audio.play();

            //     if (!active()) return;

            //     speechStatusRef.current = "speaking";
            //     setSpeakingStatus("speaking");
            //   } catch (error) {
            //     if (!active()) return;
            //     fail(error, pageIndex);
            //   }
            // })();

            (async () => {
              const playingIndex = chunkIndex;

              try {
                const audioBlob = await getAudioForChunk(playingIndex);

                if (!active()) return;

                prefetchedAudio.delete(playingIndex);

                const audioUrl = URL.createObjectURL(audioBlob);
                ttsAudioUrlRef.current = audioUrl;

                const audio = new Audio(audioUrl);
                ttsAudioRef.current = audio;
                audio.playbackRate = speechRate;

                // First-pass conservative boundary silence settings.
                // These values are in seconds of audio timeline.
                const LEADING_TRIM_SECONDS = 0.12;
                const TRAILING_TRIM_SECONDS = 0.65;

                // Skip only part of the measured leading quiet region.
                audio.addEventListener(
                  "loadedmetadata",
                  () => {
                    if (!active()) return;

                    if (
                      Number.isFinite(audio.duration) &&
                      audio.duration > LEADING_TRIM_SECONDS + 0.5
                    ) {
                      audio.currentTime = LEADING_TRIM_SECONDS;
                    }
                  },
                  { once: true }
                );


                let started = false;

                const playCurrentAudio = async () => {
                  if (!active() || started || speechPausedRef.current) return;

                  started = true;

                  try {
                    await audio.play();

                    if (!active()) return;

                    const gapStart = window.__lastTtsChunkEnd;

                    if (typeof gapStart === "number") {
                      console.log(
                        "AUDIO TRANSITION GAP:",
                        Math.round(performance.now() - gapStart),
                        "ms",
                        "chunk:",
                        playingIndex + 1
                      );
                    }

                    window.__lastTtsChunkEnd = null;

                    speechStatusRef.current = "speaking";
                    setSpeakingStatus("speaking");

                    // Generate next chunk while this one plays.
                    prefetchNextChunk(playingIndex);
                  } catch (error) {
                    if (active()) fail(error, pageIndex);
                  }
                };

                // audio.onended = () => {
                //   if (!active()) return;

                //   const endedAt = performance.now();

                //   console.log("AUDIO CHUNK ENDED:", {
                //     page: pageIndex + 1,
                //     chunk: playingIndex + 1,
                //     time: Math.round(endedAt),
                //   });

                //   window.__lastTtsChunkEnd = endedAt;

                //   audio.onended = null;
                //   audio.onerror = null;

                //   URL.revokeObjectURL(audioUrl);

                //   if (ttsAudioUrlRef.current === audioUrl) {
                //     ttsAudioUrlRef.current = null;
                //   }

                //   if (ttsAudioRef.current === audio) {
                //     ttsAudioRef.current = null;
                //   }

                //   chunkIndex = playingIndex + 1;

                //   // No artificial delay for ordinary chunk boundaries.
                //   // Natural punctuation pauses remain inside generated MP3.
                //   scheduleNext(speakNext, 0);
                // };


                let chunkFinished = false;

                const finishCurrentChunk = () => {
                  if (!active() || chunkFinished) return;

                  chunkFinished = true;

                  const endedAt = performance.now();

                  console.log("AUDIO CHUNK ENDED:", {
                    page: pageIndex + 1,
                    chunk: playingIndex + 1,
                    time: Math.round(endedAt),
                    earlyTrimmed: audio.currentTime < audio.duration,
                  });

                  window.__lastTtsChunkEnd = endedAt;

                  audio.onended = null;
                  audio.onerror = null;
                  audio.ontimeupdate = null;

                  audio.pause();

                  // Release media resources after playback.
                  audio.removeAttribute("src");
                  audio.load();

                  URL.revokeObjectURL(audioUrl);

                  if (ttsAudioUrlRef.current === audioUrl) {
                    ttsAudioUrlRef.current = null;
                  }

                  if (ttsAudioRef.current === audio) {
                    ttsAudioRef.current = null;
                  }

                  chunkIndex = playingIndex + 1;

                  // Keep existing pause-aware continuation mechanism.
                  scheduleNext(speakNext, 0);
                };

                audio.onended = finishCurrentChunk;

                // timeupdate fires periodically, not sample-accurately.
                // This is a conservative first-pass optimization.
                audio.ontimeupdate = () => {
                  if (!active() || chunkFinished || speechPausedRef.current) {
                    return;
                  }

                  if (
                    Number.isFinite(audio.duration) &&
                    audio.duration > TRAILING_TRIM_SECONDS + 0.5 &&
                    audio.currentTime >= audio.duration - TRAILING_TRIM_SECONDS
                  ) {
                    finishCurrentChunk();
                  }
                };


                audio.onerror = () => {
                  if (!active()) return;
                  fail(new Error("MP3 playback failed."), pageIndex);
                };

                if (speechPausedRef.current) {
                  pendingSpeechContinuationRef.current = playCurrentAudio;
                  return;
                }

                await playCurrentAudio();
              } catch (error) {
                if (!active()) return;
                fail(error, pageIndex);
              }
            })();
          });
        }

        waitWhilePaused(speakNext);
      } catch (error) {
        fail(error, pageIndex);
      }
    }


    function advancePage(pageIndex) {
      if (!active()) return;

      const nextIndex = pageIndex + 1;

      if (nextIndex >= totalPages) {
        speechStatusRef.current = "idle";
        setSpeakingStatus("idle");
        return;
      }

      waitWhilePaused(() => {
        if (!active()) return;

        const flip = flipBookRef.current?.pageFlip();

        if (!flip) {
          fail(new Error("Flipbook unavailable."), pageIndex);
          return;
        }

        const visiblePageIndices = flip.getPageCount
          ? (() => {
            const current = flip.getCurrentPageIndex();
            const isPortrait =
              flip.getSettings?.()?.usePortrait &&
              flip.getOrientation?.() === "portrait";

            if (isPortrait) return [current];

            // Desktop spread: cover occupies its own spread.
            if (current === 0) return [0];

            const spreadStart = current % 2 === 1
              ? current
              : current - 1;

            return [spreadStart, spreadStart + 1];
          })()
          : [pageIndex];

        // Next page already visible: read without flipping.
        if (visiblePageIndices.includes(nextIndex)) {
          readPage(nextIndex);
          return;
        }

        // Otherwise turn the physical book page.
        // const currentIndex = flip.getCurrentPageIndex();

        // // Target is the next visible spread's first page.
        // const expectedIndex =
        //   currentIndex === 0
        //     ? 1
        //     : currentIndex % 2 === 0
        //       ? currentIndex + 1
        //       : currentIndex + 2;

        // autoFlipTargetRef.current = expectedIndex;

        // autoFlipContinuationRef.current = () => {
        //   if (!active()) return;

        //   autoFlipContinuationRef.current = null;
        //   scheduleNext(() => readPage(nextIndex), 100);
        // };



        // flip.flipNext();

        // speechTimeoutRef.current = setTimeout(() => {
        //   if (!active()) return;

        //   if (autoFlipTargetRef.current !== null) {
        //     fail(
        //       new Error("Automatic page flip did not complete."),
        //       pageIndex
        //     );
        //   }
        // }, 2500);





        // Otherwise turn the physical book page.

        const getExpectedFlipIndex = () => {
          const currentIndex = flip.getCurrentPageIndex();

          const isPortrait =
            flip.getSettings?.()?.usePortrait &&
            flip.getOrientation?.() === "portrait";

          // Portrait: advance one page.
          if (isPortrait) {
            return currentIndex + 1;
          }

          // Landscape: advance to the next visible spread.
          if (currentIndex === 0) {
            return 1;
          }

          return currentIndex % 2 === 0
            ? currentIndex + 1
            : currentIndex + 2;
        };

        autoFlipTargetRef.current = getExpectedFlipIndex();
        autoFlipRetryRef.current = 0;

        autoFlipContinuationRef.current = () => {
          if (!active()) return;

          if (autoFlipTimeoutRef.current) {
            clearTimeout(autoFlipTimeoutRef.current);
            autoFlipTimeoutRef.current = null;
          }

          autoFlipTargetRef.current = null;
          autoFlipContinuationRef.current = null;
          autoFlipRetryRef.current = 0;

          scheduleNext(() => readPage(nextIndex), 150);
        };

        const attemptAutomaticFlip = () => {
          if (!active()) return;

          if (autoFlipTimeoutRef.current) {
            clearTimeout(autoFlipTimeoutRef.current);
            autoFlipTimeoutRef.current = null;
          }

          const targetIndex = autoFlipTargetRef.current;

          if (targetIndex === null) return;

          flip.flipNext();

          autoFlipTimeoutRef.current = setTimeout(() => {
            autoFlipTimeoutRef.current = null;

            if (!active()) return;

            const actualIndex = flip.getCurrentPageIndex();

            // Flip succeeded, even if the onFlip event was missed.
            if (actualIndex === targetIndex) {
              autoFlipContinuationRef.current?.();
              return;
            }

            // Retry only once.
            if (autoFlipRetryRef.current < 1) {
              autoFlipRetryRef.current += 1;

              console.warn(
                "Automatic page flip failed. Retrying...",
                {
                  expected: targetIndex,
                  actual: actualIndex,
                  retry: autoFlipRetryRef.current,
                }
              );

              autoFlipTargetRef.current = getExpectedFlipIndex();

              attemptAutomaticFlip();
              return;
            }

            // Do not terminate continuous reading.
            console.warn(
              "Automatic page flip failed after retry. Continuing speech.",
              {
                expected: autoFlipTargetRef.current,
                actual: actualIndex,
              }
            );

            autoFlipTargetRef.current = null;
            autoFlipContinuationRef.current = null;
            autoFlipRetryRef.current = 0;

            scheduleNext(() => readPage(nextIndex), 300);

          }, 2500);
        };

        attemptAutomaticFlip();


      });
    }


    // Used by the onFlip handler to continue the same speech session.
    // pendingSpeechContinuationRef.current = {
    //   onAutoFlip(nextIndex) {
    //     if (!active()) return;

    //     if (speechTimeoutRef.current) {
    //       clearTimeout(speechTimeoutRef.current);
    //       speechTimeoutRef.current = null;
    //     }

    //     scheduleNext(() => readPage(nextIndex), 100);
    //   },
    // };

    readPage(initialPage);
  }




  function goPrevious() {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }

  function goNext() {
    flipBookRef.current?.pageFlip()?.flipNext();
  }

  if (loading) {
    return (
      <div className="reader-message">
        Preparing your purchased book...
      </div>
    );
  }

  if (isChantProduct) {
    return <Chant />
  }

  if (error || !pdfDocument) {
    return (
      <div className="reader-message" role="alert">
        {error || "Unable to open this book."}
      </div>
    );
  }

  return (
    // <main className="reader-page purchased-reader-page">
    <main className={`reader-page purchased-reader-page ${zoom > 100 ? "zoomed-reading" : ""
      }`}>
      <section className="reader-heading">
        <p className="reader-eyebrow">MY DIGITAL LIBRARY</p>
        <h1>{bookTitle}</h1>
        <p>Enjoy reading your purchased eBook.</p>
      </section>

      <nav className="reader-zoom-toolbar">
        <span className="reader-zoom-label">Reading View</span>

        <div className="reader-zoom-actions">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(75, z - 25))}
            disabled={zoom <= 75}
          >
            -
          </button>

          <span className="reader-zoom-level">{zoom}%</span>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(200, z + 25))}
            disabled={zoom >= 200}
          >
            +
          </button>

          <button
            type="button"
            className="reader-zoom-reset"
            onClick={() => setZoom(100)}
          >
            Reset
          </button>
        </div>
      </nav>



      <section className="reader-zoom-toolbar" aria-label="Speaking controls">
        <span className="reader-zoom-label">
          Read Aloud — Page {currentPage + 1}
        </span>

        <div className="reader-zoom-actions" style={{ flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={startSpeaking}
            disabled={!docxUrl || speakingStatus === "loading"}
            style={{ fontSize: 13 }}
          >
            {speakingStatus === "loading" ? "Matching text..." : "🔊 Read Aloud"}
          </button>

          <button
            type="button"
            onClick={pauseSpeaking}
            disabled={speakingStatus !== "speaking"}
            style={{ fontSize: 13 }}
          >
            Pause
          </button>

          <button
            type="button"
            onClick={resumeSpeaking}
            disabled={speakingStatus !== "paused"}
            style={{ fontSize: 13 }}
          >
            Resume
          </button>

          <button
            type="button"
            onClick={stopSpeaking}
            disabled={speakingStatus === "idle"}
            style={{ fontSize: 13 }}
          >
            Stop
          </button>
        </div>

        <div className="reader-zoom-actions" style={{ flexWrap: "wrap" }}>
          <label htmlFor="purchased-voice">Voice</label>

          <select
            id="purchased-voice"
            value={selectedVoice}
            // onChange={(event) => setSelectedVoice(event.target.value)}
            onChange={(event) => {
              stopSpeaking();
              pagePreparationCacheRef.current.clear();
              setSelectedVoice(event.target.value);
              setSpeakingError("");
            }}
            style={{ maxWidth: 220, padding: 8 }}
          >
            {/* {speechVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))} */}

            {BOOK_TTS_VOICES.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
              </option>
            ))}
          </select>

          <label htmlFor="purchased-speed">Speed</label>

          <select
            id="purchased-speed"
            value={speechRate}
            onChange={(event) => setSpeechRate(Number(event.target.value))}
            style={{ padding: 8 }}
          >
            <option value={0.75}>0.75x</option>
            <option value={0.9}>0.9x</option>
            <option value={1}>1x</option>
            {/* <option value={1.15}>1.15x</option> */}
            <option value={1.25}>1.25x</option>
            <option value={1.50}>1.50x</option>
            <option value={1.75}>1.75x</option>
            <option value={2}>2x</option>

          </select>
        </div>

        {speakingError && (
          <p role="alert" style={{ color: "#b42318", width: "100%" }}>
            {speakingError}
          </p>
        )}
      </section>

      <div className="reader-book-viewport">
        <div
          className="reader-book-zoom"
          // style={{ zoom: zoom / 100 }}
          style={{ zoom: (zoom / 100) * 1.5 }}

        >
          <section className="book-stage">
            <HTMLFlipBook
              key={productId}

              startPage={Math.min(currentPage, Math.max(0, totalPages - 1))}
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
              // onFlip={(event) => setCurrentPage(event.data)}

              onFlip={(event) => {
                const nextPage = event.data;
                setCurrentPage(nextPage);

                if (progressKey && Number.isInteger(nextPage)) {
                  localStorage.setItem(progressKey, String(nextPage));
                }

                // if (autoFlipTargetRef.current === nextPage) {
                //   autoFlipTargetRef.current = null;

                //   if (speechTimeoutRef.current) {
                //     clearTimeout(speechTimeoutRef.current);
                //     speechTimeoutRef.current = null;
                //   }

                //   const continuation = autoFlipContinuationRef.current;

                //   if (typeof continuation === "function") {
                //     continuation();
                //   }

                //   return;
                // }

                if (autoFlipTargetRef.current === nextPage) {
                  if (autoFlipTimeoutRef.current) {
                    clearTimeout(autoFlipTimeoutRef.current);
                    autoFlipTimeoutRef.current = null;
                  }

                  const continuation = autoFlipContinuationRef.current;

                  if (typeof continuation === "function") {
                    continuation();
                  }

                  return;
                }

                if (speechStatusRef.current !== "idle") {
                  stopSpeaking();
                }
              }}

              className="book-flip"
            >
              {Array.from({ length: totalPages }, (_, index) => (
                <PurchasedPage
                  key={`${productId}-${index}`}
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

      <div className="reader-controls">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentPage === 0}
        >
          Previous
        </button>

        <span>
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          type="button"
          onClick={goNext}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>

        <button type="button" onClick={testCurrentPageText} disabled={!docxUrl}>
          Test Speaking Text
        </button>
      </div>
    </main>
  );
}
