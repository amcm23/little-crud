import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "./pdf";

export default function MovieList() {
  const [year, setYear] = useState("");
  const [movieDetails, setDetails] = useState([]);
  const [show, setHide] = useState(false);

  return (
    <div className="container">
      <button onClick={() => setHide(true)}></button>
      <h2>Descargar pdf</h2>
      {show && (
        <PDFDownloadLink
          document={<PdfDocument />}
          fileName="facturaso.pdf"
          style={{
            textDecoration: "none",
            padding: "10px",
            color: "#4a4a4a",
            backgroundColor: "#f2f2f2",
            border: "1px solid #4a4a4a"
          }}>
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download Pdf"
          }
        </PDFDownloadLink>
      )}
    </div>
  );
}
