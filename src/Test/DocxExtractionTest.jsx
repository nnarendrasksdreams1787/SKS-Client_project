import { useState } from "react";
import * as mammoth from "mammoth/mammoth.browser";

export default function DocxExtractionTest() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const testExtraction = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. DOCX file frontend ke public folder se load karo
      const response = await fetch("/Books/Bhagvadgeeta2.docx");

      if (!response.ok) {
        throw new Error(`DOCX load failed: ${response.status}`);
      }

      // 2. DOCX ko ArrayBuffer mein convert karo
      const arrayBuffer = await response.arrayBuffer();

      console.log("DOCX RESPONSE URL:", response.url);

      console.log(
        "DOCX CONTENT TYPE:",
        response.headers.get("content-type")
      );

      console.log(
        "DOCX FILE SIZE:",
        arrayBuffer.byteLength
      );

      const firstBytes = new Uint8Array(arrayBuffer.slice(0, 8));

      console.log(
        "DOCX FIRST BYTES:",
        Array.from(firstBytes)
      );

      // 3. Mammoth se text extract karo
      const result = await mammoth.extractRawText({
        arrayBuffer,
      });

      const extractedText = result.value;

      setText(extractedText);

      console.log("DOCX EXTRACTION SUCCESSFUL");
      console.log("TOTAL TEXT LENGTH:", extractedText.length);
      console.log("MAMMOTH WARNINGS:", result.messages);

      // Marathi paragraph search
      const searchText = "माझा जन्म";
      const position = extractedText.indexOf(searchText);

      if (position !== -1) {
        console.log(
          "MARATHI TEXT SAMPLE:",
          extractedText.slice(position, position + 1000)
        );
      } else {
        console.log(
          "FIRST 1000 CHARACTERS:",
          extractedText.slice(0, 1000)
        );
      }
    } catch (err) {
      console.error("DOCX EXTRACTION ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>DOCX Text Extraction Test</h2>

      <button onClick={testExtraction} disabled={loading}>
        {loading ? "Extracting..." : "Test DOCX Extraction"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {text && (
        <div>
          <h3>Extraction Successful!</h3>
          <p>Total characters: {text.length}</p>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {text.slice(0, 2000)}
          </pre>
        </div>
      )}
    </div>
  );
}