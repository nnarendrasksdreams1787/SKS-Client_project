
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
