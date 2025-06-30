import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the path to the worker file in the public folder
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

function MyPdfViewer() {
  return (
    <div>
      <h2>PDF Preview</h2>
      <Document file="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js">
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}

export default MyPdfViewer;
