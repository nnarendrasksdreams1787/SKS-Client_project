
import { forwardRef, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { products } from "../Data/products";
import "../BookReader.css";

// import { translateToHindi } from "../Services/TranslationServices";

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



const FlipPage = forwardRef(function FlipPage(
  { pdfDocument, number, shouldRender },
  ref
) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!pdfDocument || !shouldRender) return;

    let cancelled = false;
    let renderTask;

    async function renderPage() {
      try {
        const pdfPage = await pdfDocument.getPage(number);

        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // const viewport = pdfPage.getViewport({ scale: 1.5 });
        // const context = canvas.getContext("2d");

        // canvas.width = Math.ceil(viewport.width);
        // canvas.height = Math.ceil(viewport.height);

        // renderTask = pdfPage.render({
        //   canvasContext: context,
        //   viewport,
        // });


        const context = canvas.getContext("2d");

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
        const viewport = pdfPage.getViewport({
          scale: 2 * pixelRatio,
        });

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        // canvas.style.width = "100%";
        // canvas.style.height = "100";

        canvas.style.width = "100%";
        canvas.style.height = "auto";

        renderTask = pdfPage.render({
          canvasContext: context,
          viewport,
        });

        await renderTask.promise;
      } catch (error) {
        if (error?.name !== "RenderingCancelledException") {
          console.error("Page rendering failed:", error);
        }
      }
    }

    renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDocument, number, shouldRender]);

  return (
    <div className="flip-page" ref={ref}>
      <div className="flip-page-content">
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

  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [zoom, setZoom] = useState(100);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [extracting, setExtracting] = useState(false);

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

  function zoomIn() {
    // setZoom((current) => Math.min(current + 25, 200));
    setZoom((current) => Math.min(current + 10, 100));
  }

  function zoomOut() {
    // setZoom((current) => Math.max(current - 25, 75));
    setZoom((current) => Math.max(current - 10, 30));
  }

  function resetZoom() {
    setZoom(100);
  }

  const product = products.find((item) => item.id === id);

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
        }))
      );
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let loadingTask;

    async function loadPdf() {
      setLoading(true);
      setError("");
      setPages([]);
      setCurrentPage(0);
      setPdfDocument(null);
      setTotalPages(0);

      if (!product?.pdfUrl) {
        setError("This book does not have a PDF available yet.");
        setLoading(false);
        return;
      }

      try {
        const pdfUrl = new URL(product.pdfUrl, window.location.origin).href;
        loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
        const pdf = await loadingTask.promise;

        if (cancelled) return;

        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);

        // const renderedPages = [];

        // for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        //   if (cancelled) return;

        //   const pdfPage = await pdf.getPage(pageNumber);
        //   const viewport = pdfPage.getViewport({ scale: 1.15 });
        //   const canvas = document.createElement("canvas");
        //   const context = canvas.getContext("2d");

        //   canvas.width = Math.ceil(viewport.width);
        //   canvas.height = Math.ceil(viewport.height);

        //   await pdfPage.render({
        //     canvasContext: context,
        //     viewport,
        //   }).promise;

        //   renderedPages.push(canvas.toDataURL("image/jpeg", 0.88));
        //   canvas.width = 0;
        //   canvas.height = 0;
        // }

        // if (!cancelled) setPages(renderedPages);
      } catch (err) {
        if (cancelled || err?.name === "AbortException") {
          return;
        }

        console.error("PDF loading failed:", err);

        setError(
          "We couldn't open this PDF. Check the file path and try again."
        );

      } finally {
        if (!cancelled) setLoading(false);
      }
    }




    loadPdf();

    return () => {
      cancelled = true;
      loadingTask?.destroy();
    };
  }, [product?.pdfUrl]);

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

  async function extractCurrentPageText() {
    if (!pdfDocument) return;

    try {
      setExtracting(true);

      // Clear previous results.
      setExtractedText("");
      setTranslatedText("");
      setTranslationError("");

      const pageNumber = currentPage + 1;

      const pdfPage = await pdfDocument.getPage(pageNumber);

      const textContent = await pdfPage.getTextContent();

      const lines = [];
      let currentLine = [];
      let previousY = null;

      for (const item of textContent.items) {
        if (typeof item.str !== "string") continue;

        const text = item.str.trim();

        if (!text) continue;

        // PDF.js stores text positions in transform.
        const currentY = item.transform?.[5];

        if (typeof currentY !== "number") {
          if (currentLine.length > 0) {
            lines.push(currentLine.join(" "));
            currentLine = [];
          }

          lines.push(text);
          previousY = null;
          continue;
        }

        // Detect when text moves to another line.
        const isNewLine =
          previousY !== null &&
          Math.abs(currentY - previousY) > 3;

        if (isNewLine && currentLine.length > 0) {
          lines.push(currentLine.join(" "));
          currentLine = [];
        }

        currentLine.push(text);

        previousY = currentY;

        // Some PDF.js text items explicitly end a line.
        if (item.hasEOL) {
          lines.push(currentLine.join(" "));
          currentLine = [];
          previousY = null;
        }
      }

      // Include any remaining text.
      if (currentLine.length > 0) {
        lines.push(currentLine.join(" "));
      }

      const structuredText = lines.join("\n");

      setExtractedText(structuredText);

      console.log("PDF PAGE:", pageNumber);
      console.log("STRUCTURED PDF TEXT:", structuredText);
      console.log("TEXT ITEMS:", textContent.items);

    } catch (error) {
      console.error("Text extraction failed:", error);
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


  async function handleSpeakPage() {
    if (!pdfDocument) return;

    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    const synth = window.speechSynthesis;

    // Resume from paused position.
    if (synth.paused) {
      synth.resume();
      setTtsStatus("playing");
      return;
    }

    // Avoid restarting speech when already playing.
    if (synth.speaking || ttsStatus === "loading") {
      return;
    }

    const sessionId = ++speechSessionRef.current;

    try {
      setTtsStatus("loading");

      const pageNumber = currentPage + 1;
      const pdfPage = await pdfDocument.getPage(pageNumber);
      const textContent = await pdfPage.getTextContent();

      console.table(
        textContent.items.slice(0, 30).map((item, index) => ({
          index,
          text: item.str,
          fontName: item.fontName,
          hasEOL: item.hasEOL,
        }))
      )

      if (sessionId !== speechSessionRef.current) return;

      const pageText = textContent.items
        .map((item) => item.str || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (!pageText) {
        setTtsStatus("idle");
        alert("No readable text found on this page.");
        return;
      }

      console.log("TTS PAGE:", pageNumber);
      console.log("TTS TEXT LENGTH: ", pageText.length);
      console.log("TTS TEXT:", pageText);

      // Divide text into smaller pieces.
      const maxChunkLength = 200;
      const chunks = [];
      let remainingText = pageText;

      while (remainingText.length > 0) {
        if (remainingText.length <= maxChunkLength) {
          chunks.push(remainingText);
          break;
        }

        let splitAt = remainingText.lastIndexOf(
          " ",
          maxChunkLength
        );

        if (splitAt <= 0) {
          splitAt = maxChunkLength;
        }

        const chunk = remainingText.slice(0, splitAt).trim();

        if (chunk) {
          chunks.push(chunk);
        }

        remainingText = remainingText.slice(splitAt).trim();
      }

      console.log("TOTAL TTS CHUNKS:", chunks.length);

      const voice =
        ttsVoices.find(
          (item) =>
            item.name === selectedVoice &&
            item.lang.toLowerCase().startsWith(
              ttsLanguage.split("-")[0].toLowerCase()
            )
        ) ||
        ttsVoices.find(
          (item) =>
            item.lang.toLowerCase() === ttsLanguage.toLowerCase()
        );

      let chunkIndex = 0;

      const speakNextChunk = () => {
        if (sessionId !== speechSessionRef.current) {
          return;
        }

        if (chunkIndex >= chunks.length) {
          setTtsStatus("idle");
          console.log("TTS PAGE COMPLETED");
          return;
        }


        const utterance = new SpeechSynthesisUtterance(
          chunks[chunkIndex]
        );

        utterance.lang = ttsLanguage;
        utterance.rate = ttsSpeed;
        utterance.pitch = 1;
        utterance.volume = 1;

        if (voice) {
          utterance.voice = voice;
        }

        utterance.onstart = () => {
          if (sessionId === speechSessionRef.current) {
            setTtsStatus("playing");
          }
        };

        utterance.onend = () => {
          if (sessionId !== speechSessionRef.current) {
            return;
          }

          chunkIndex += 1;

          speakNextChunk();
        };

        utterance.onerror = (event) => {
          if (sessionId !== speechSessionRef.current) {
            return;
          }

          console.error("TTS error:", event.error);
          setTtsStatus("idle");
        };

        console.log(
          `READING CHUNK ${chunkIndex + 1}/${chunks.length}`
        );

        synth.speak(utterance);
      };

      speakNextChunk();
    } catch (error) {
      if (sessionId !== speechSessionRef.current) return;

      console.error("TTS failed:", error);
      setTtsStatus("idle");
    }
  }

  function handlePauseSpeech() {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.pause();
    setTtsStatus("paused");
  }

  function handleStopSpeech() {
    if (!("speechSynthesis" in window)) return;

    // Invalidate pending and future chunks.
    speechSessionRef.current += 1;

    window.speechSynthesis.cancel();

    setTtsStatus("idle");
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
            `Translating ${completed} of ${total} chunks...`
          );
        }
      );

      setTranslatedText(translated);

      console.log("HINDI TRANSLATION:", translated);

    } catch (error) {
      console.error("Translation failed:", error);

      setTranslationError(
        error?.message || "Unable to translate this page."
      );

    } finally {
      setTranslating(false);
      setTranslationProgress("");
    }
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
                // disabled={zoom <= 75}
                disabled={zoom <= 30}
                aria-label="Zoom out"
              >
                -
              </button>

              <span className="reader-zoom-level">{zoom}%</span>

              <button
                type="button"
                onClick={zoomIn}
                // disabled={zoom >= 200}
                disabled={zoom >= 100}
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

          <div className="reader-book-viewport">
            {/* <div className="reader-book-zoom" style={{ zoom: zoom / 100 }}> */}

            <div className="reader-book-zoom" style={{ zoom: zoom / 100 }} >
              <section className="book-stage" aria-label="Interactive book">
                <HTMLFlipBook
                  ref={flipBookRef}
                  // width={380}
                  width={650}
                  // height={520}
                  height={850}
                  size="stretch"
                  minWidth={260}
                  // maxWidth={760}
                  maxWidth={900}
                  minHeight={360}
                  // maxHeight={620}
                  maxHeight={1100}
                  showCover
                  usePortrait
                  mobileScrollSupport
                  drawShadow
                  flippingTime={650}
                  maxShadowOpacity={0.45}
                  onFlip={(event) => {
                    // window.speechSynthesis.cancel();
                    handleStopSpeech();

                    setCurrentPage(event.data);
                    setExtractedText("");
                    setTranslatedText("");
                    setTranslationError("");
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
                    />
                  ))}

                </HTMLFlipBook>
              </section>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "20px 0" }} >
            <button
              type="button"
              onClick={extractCurrentPageText}
              disabled={extracting}
            >
              {extracting ? "Extracting..." : "Extract Page Text"}
            </button>

            <div style={{ marginTop: "15px" }}>

              <label htmlFor="pdf-language">
                Select Language:{" "}
              </label>

              <select id="pdf-language"
                value={selectedLanguage}
                onChange={(event) => {
                  setSelectedLanguage(event.target.value)
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
                >{
                    selectedLanguage === "hi" && translatedText
                      ? translatedText
                      : extractedText
                  }</p>

                {translationError && (
                  <p
                    style={{ color: "red", marginTop: "10px" }}
                  >{translationError}</p>
                )}

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
                  voice.lang.toLowerCase().startsWith(
                    ttsLanguage.split("-")[0].toLowerCase()
                  )
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
              onChange={(event) =>
                setTtsSpeed(Number(event.target.value))
              }
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