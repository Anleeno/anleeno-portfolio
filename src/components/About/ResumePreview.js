import React, { useEffect, useRef, useState } from "react";
import { HiOutlineDocumentDownload } from "react-icons/hi";

const resolvePublicAsset = (fileName) => new URL(fileName, document.baseURI).href;
const resumePdf = resolvePublicAsset("Anleeno-Xu-Resume.pdf");
const pdfModule = resolvePublicAsset("pdf.min.mjs");
const pdfWorker = resolvePublicAsset("pdf.worker.min.mjs");

function ResumePreview({ id }) {
  const previewRef = useRef(null);
  const pagesRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const preview = previewRef.current;
    const pages = pagesRef.current;
    if (!preview || !pages) return undefined;

    let disposed = false;
    let renderVersion = 0;
    let pdfDocument;
    const activeRenders = new Set();

    const renderPages = async () => {
      const version = ++renderVersion;
      activeRenders.forEach((task) => task.cancel());
      activeRenders.clear();
      pages.replaceChildren();

      const availableWidth = Math.min(preview.clientWidth, 900);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
        if (disposed || version !== renderVersion) return;
        const page = await pdfDocument.getPage(pageNumber);
        const naturalViewport = page.getViewport({ scale: 1 });
        const scale = availableWidth / naturalViewport.width;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.className = "about-resume-page";
        canvas.setAttribute("aria-label", `Resume page ${pageNumber}`);
        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        pages.appendChild(canvas);

        const task = page.render({
          canvasContext: context,
          viewport,
          transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0]
        });
        activeRenders.add(task);
        try {
          await task.promise;
        } catch (error) {
          if (error?.name !== "RenderingCancelledException") throw error;
        } finally {
          activeRenders.delete(task);
        }
      }

      if (!disposed && version === renderVersion) setStatus("ready");
    };

    let resizeTimer;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (pdfDocument && !disposed) renderPages();
      }, 120);
    });
    observer.observe(preview);

    import(/* webpackIgnore: true */ pdfModule)
      .then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
        return pdfjs.getDocument(resumePdf).promise;
      })
      .then((loadedDocument) => {
        if (disposed) return;
        pdfDocument = loadedDocument;
        return renderPages();
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });

    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      observer.disconnect();
      activeRenders.forEach((task) => task.cancel());
      if (pdfDocument) pdfDocument.destroy();
    };
  }, []);

  return (
    <section className="about-resume-preview" id={id} ref={previewRef} aria-label="Resume preview">
      <a className="about-resume-download" href={resumePdf} target="_blank" rel="noreferrer">
        <span className="about-resume-download-icon" aria-hidden="true">
          <HiOutlineDocumentDownload />
        </span>
        Download
      </a>
      {status === "error" && <p className="about-resume-loading">Resume preview could not be loaded.</p>}
      <div className="about-resume-pages" ref={pagesRef} aria-live="polite" />
    </section>
  );
}

export default ResumePreview;
