
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useParams } from "react-router-dom";
import { products } from "../Data/products";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfQualityTest() {

    const { id } = useParams();

    const product = products.find((item) => item.id === id);

    const pdfUrl = product?.pdfUrl;

    if (!pdfUrl) {
        return <p>No PDF found for this book.</p>;
    }

    return (
        <div style={{ padding: 24, overflow: "auto" }}>
            <Document
                file={pdfUrl}
                suspense={false}
                loading="Loading PDF..."
                error="Unable to load PDF."
            >
                <Page
                    pageNumber={1}
                    width={600}
                    devicePixelRatio={2}
                    renderTextLayer={true}
                    renderAnnotationLayer={false}
                    suspense={false}
                />
            </Document>
        </div>
    );
}
