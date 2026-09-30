import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import "./styles.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

type Word = { text: string; x: number; y: number; width: number; height: number };

async function extractPdf(file: File) {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages = [];

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();

    const words: Word[] = content.items
      .filter((item): item is any => "str" in item)
      .map((item: any) => {
        const [a, b, c, d, e, f] = item.transform;
        return {
          text: item.str,
          x: e,
          y: f,
          width: item.width ?? 0,
          height: Math.abs(d) || Math.abs(a) || 0
        };
      });

    pages.push({
      pageNo,
      text: words.map(w => w.text).join(" "),
      words
    });
  }

  return { pages };
}

function App() {
  const [result, setResult] = useState<any>();
  const [error, setError] = useState("");

  async function onFile(file?: File) {
    if (!file) return;
    setError("");
    setResult(undefined);

    try {
      setResult(await extractPdf(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <main>
      <h1>BodyLens — PDF.js POC</h1>
      <p className="subtitle">
        Client-side extraction test for Cult Smart Scale Pro reports.
      </p>

      <label className="upload">
        Select Cult PDF
        <input
          type="file"
          accept="application/pdf"
          onChange={e => onFile(e.target.files?.[0])}
        />
      </label>

      {error && <pre className="error">{error}</pre>}

      {result && (
        <section>
          <h2>Extraction result</h2>
          {result.pages.map((page: any) => (
            <article key={page.pageNo}>
              <h3>Page {page.pageNo}</h3>
              <h4>Extracted text</h4>
              <pre>{page.text}</pre>

              <h4>Text items with coordinates</h4>
              <table>
                <thead>
                  <tr>
                    <th>Text</th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Width</th>
                  </tr>
                </thead>
                <tbody>
                  {page.words.map((w: Word, i: number) => (
                    <tr key={i}>
                      <td>{w.text}</td>
                      <td>{w.x.toFixed(2)}</td>
                      <td>{w.y.toFixed(2)}</td>
                      <td>{w.width.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);
