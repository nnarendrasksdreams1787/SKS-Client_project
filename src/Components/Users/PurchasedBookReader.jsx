
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

import { getReadablePageText } from "../../Services/BookTextService";


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const API_URL = "http://localhost:4000";

const PurchasedPage = forwardRef(function PurchasedPage(
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
        const page = await pdfDocument.getPage(number);
        if (cancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        renderTask = page.render({
          canvasContext: canvas.getContext("2d"),
          viewport,
        });

        await renderTask.promise;
      } catch (error) {
        if (
          error?.name !== "RenderingCancelledException" &&
          !cancelled
        ) {
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

export default function PurchasedBookReader() {
  const { productId } = useParams();
  const flipBookRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [pdfDocument, setPdfDocument] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);


  const [speakingStatus, setSpeakingStatus] = useState("idle");
  const [speakingError, setSpeakingError] = useState("");
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechVoices, setSpeechVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  const speechSessionRef = useRef(0);
  const speechPausedRef = useRef(false);
  const speechTimeoutRef = useRef(null);
  const speechUtteranceRef = useRef(null);
  const speechStatusRef = useRef("idle");

  const [docxUrl, setDocxUrl] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let loadingTask;
    let objectUrl;
    let docxObjectUrl;

    async function loadPurchasedBook() {
      setLoading(true);
      setError("");
      setBookTitle("");
      setPdfDocument(null);
      setTotalPages(0);
      setCurrentPage(0);
      setDocxUrl("");

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

        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);

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
          voices.find((voice) => voice.lang.toLowerCase() === "hi-in") ||
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
    speechPausedRef.current = false;
    speechStatusRef.current = "idle";

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }

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
    setSpeakingStatus("paused");
  }

  function resumeSpeaking() {
    if (!("speechSynthesis" in window)) return;
    if (speechStatusRef.current !== "paused") return;

    speechPausedRef.current = false;
    speechStatusRef.current = "speaking";

    window.speechSynthesis.resume();
    setSpeakingStatus("speaking");
  }

  function prepareSpeechChunks(text) {
    const normalized = String(text || "")
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    const paragraphs = normalized
      .split(/\n\s*\n/)
      .filter(Boolean);

    const chunks = [];

    for (const paragraph of paragraphs) {
      const sentences = paragraph
        .split(/(?<=[।॥.!?])\s+/u)
        .filter(Boolean);

      for (const sentence of sentences) {
        // Keep utterances reasonably short for browser TTS.
        const words = sentence.split(/\s+/);
        let buffer = "";

        for (const word of words) {
          if (buffer && (buffer + " " + word).length > 180) {
            chunks.push({
              text: buffer,
              pauseMs: 180,
            });
            buffer = word;
          } else {
            buffer = buffer ? `${buffer} ${word}` : word;
          }
        }

        if (buffer) {
          chunks.push({
            text: buffer,
            pauseMs: 350,
          });
        }
      }

      if (chunks.length) {
        chunks[chunks.length - 1].pauseMs = 650;
      }
    }

    return chunks;
  }

  async function startSpeaking() {
    if (!("speechSynthesis" in window)) {
      setSpeakingError("Browser speech is not supported.");
      return;
    }

    stopSpeaking();

    const sessionId = speechSessionRef.current;
    const pageNumber = currentPage + 1;

    setSpeakingError("");
    setSpeakingStatus("loading");
    speechStatusRef.current = "loading";

    try {
      const matchedText = await getReadablePageText({
        docxUrl,
        pdfDocument,
        pageNumber,
      });

      if (sessionId !== speechSessionRef.current) return;

      if (!matchedText || !String(matchedText).trim()) {
        throw new Error("No verified text found for this page.");
      }

      const chunks = prepareSpeechChunks(matchedText);

      if (!chunks.length) {
        throw new Error("No readable sentences found.");
      }

      const voice = speechVoices.find(
        (item) => item.voiceURI === selectedVoice
      );

      let index = 0;

      function speakNext() {
        if (sessionId !== speechSessionRef.current) return;

        if (speechPausedRef.current) {
          speechTimeoutRef.current = setTimeout(speakNext, 100);
          return;
        }

        if (index >= chunks.length) {
          speechStatusRef.current = "idle";
          setSpeakingStatus("idle");
          speechUtteranceRef.current = null;
          return;
        }

        const chunk = chunks[index++];
        const utterance = new SpeechSynthesisUtterance(chunk.text);

        utterance.voice = voice || null;
        utterance.lang = voice?.lang || "mr-IN";
        utterance.rate = speechRate;
        utterance.pitch = 1;
        utterance.volume = 1;

        speechUtteranceRef.current = utterance;

        utterance.onstart = () => {
          if (sessionId !== speechSessionRef.current) return;

          speechStatusRef.current = "speaking";
          setSpeakingStatus("speaking");
        };

        utterance.onerror = (event) => {
          if (sessionId !== speechSessionRef.current) return;

          if (event.error === "canceled" || event.error === "interrupted") {
            return;
          }

          setSpeakingError(`Speech failed: ${event.error}`);
          stopSpeaking();
        };

        utterance.onend = () => {
          if (sessionId !== speechSessionRef.current) return;

          speechTimeoutRef.current = setTimeout(
            speakNext,
            chunk.pauseMs
          );
        };

        window.speechSynthesis.speak(utterance);
      }

      speakNext();
    } catch (error) {
      if (sessionId !== speechSessionRef.current) return;

      console.error("Read aloud failed:", error);
      setSpeakingError(error.message || "Unable to read this page.");
      speechStatusRef.current = "idle";
      setSpeakingStatus("idle");
    }
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

  if (error || !pdfDocument) {
    return (
      <div className="reader-message" role="alert">
        {error || "Unable to open this book."}
      </div>
    );
  }

  return (
    <main className="reader-page">
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
            onChange={(event) => setSelectedVoice(event.target.value)}
            style={{ maxWidth: 220, padding: 8 }}
          >
            {speechVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
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
            <option value={1.15}>1.15x</option>
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
          style={{ zoom: zoom / 100 }}
        >
          <section className="book-stage">
            <HTMLFlipBook
              key={productId}
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
              onFlip={(event) => setCurrentPage(event.data)}
              className="book-flip"
            >
              {Array.from({ length: totalPages }, (_, index) => (
                <PurchasedPage
                  key={`${productId}-${index}`}
                  pdfDocument={pdfDocument}
                  number={index + 1}
                  shouldRender={Math.abs(index - currentPage) <= 3}
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
