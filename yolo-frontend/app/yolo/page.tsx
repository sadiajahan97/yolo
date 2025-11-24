"use client";

import {
  useState,
  useRef,
  useEffect,
  MouseEvent,
  DragEvent,
  ChangeEvent,
} from "react";
import Image from "next/image";

interface TableRow {
  object: string;
  confidence: number;
  boundingBox: string;
}

export default function YoloPage() {
  const [previewImage, setPreviewImage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [sortColumn, setSortColumn] = useState<0 | 1 | 2 | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [tableData, setTableData] = useState<TableRow[]>([
    { object: "Car", confidence: 94, boundingBox: "(80, 120, 260, 280)" },
    { object: "Person", confidence: 89, boundingBox: "(340, 80, 480, 260)" },
    { object: "Bike", confidence: 87, boundingBox: "(150, 260, 250, 340)" },
    { object: "Tree", confidence: 82, boundingBox: "(20, 30, 100, 90)" },
    { object: "Sign", confidence: 76, boundingBox: "(380, 280, 500, 370)" },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) =>
        setPreviewImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAreaClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== fileInputRef.current) fileInputRef.current?.click();
  };

  const handleUploadButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreviewImage("");
  };

  const handleSortTable = (columnIndex: 0 | 1 | 2 | null) => {
    const isAscending = sortColumn === columnIndex && sortDirection === "asc";
    setSortColumn(columnIndex);
    setSortDirection(isAscending ? "desc" : "asc");
    setTableData(
      [...tableData].sort((a, b) => {
        switch (columnIndex) {
          case 0:
            return isAscending
              ? b.object.localeCompare(a.object)
              : a.object.localeCompare(b.object);
          case 1:
            return isAscending
              ? a.confidence - b.confidence
              : b.confidence - a.confidence;
          case 2:
            return isAscending
              ? b.boundingBox.localeCompare(a.boundingBox)
              : a.boundingBox.localeCompare(b.boundingBox);
          default:
            return 0;
        }
      })
    );
  };

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <h1>AI Vision Platform</h1>
          </div>
          <div className="user-menu">
            <div className="user-info">
              <div className="avatar">JD</div>
              <div className="user-details">
                <div className="user-name">John Doe</div>
                <div className="user-email">john.doe@example.com</div>
              </div>
            </div>
            <button className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="upload-section">
          <h2 className="section-title">Upload Image for Detection</h2>
          <p className="section-subtitle">
            Upload an image to detect objects using our advanced YOLO model
          </p>

          <div
            className={`upload-area ${isDragOver ? "dragover" : ""}`}
            onClick={handleUploadAreaClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">
              <svg viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="upload-text">Drop your image here</div>
            <div className="upload-subtext">
              or click to browse (PNG, JPG, JPEG up to 10MB)
            </div>
            <button className="upload-btn" onClick={handleUploadButtonClick}>
              Select Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="file-input"
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </div>

          <div className={`image-preview ${previewImage ? "active" : ""}`}>
            <div className="preview-container">
              <div className="preview-image-wrapper">
                <Image
                  src={previewImage}
                  alt="Preview"
                  className="preview-image"
                />
              </div>
              <div className="preview-actions">
                <button className="action-btn detect-btn">
                  Detect Objects
                </button>
                <button
                  className="action-btn remove-btn"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="results-section active" id="resultsSection">
          <div className="results-grid">
            <div className="result-card">
              <div className="card-header">
                <h3 className="card-title">Annotated Image</h3>
                <span className="card-badge">5 Objects</span>
              </div>
              <div className="annotated-image-wrapper">
                <Image
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23f1f5f9' width='600' height='400'/%3E%3Crect x='80' y='120' width='180' height='160' fill='none' stroke='%2310b981' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='90' y='145' font-family='Arial' font-size='14' font-weight='bold' fill='%2310b981'%3ECar (0.94)%3C/text%3E%3Crect x='340' y='80' width='140' height='180' fill='none' stroke='%232563eb' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='350' y='105' font-family='Arial' font-size='14' font-weight='bold' fill='%232563eb'%3EPerson (0.89)%3C/text%3E%3Crect x='150' y='260' width='100' height='80' fill='none' stroke='%23f59e0b' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='160' y='285' font-family='Arial' font-size='14' font-weight='bold' fill='%23f59e0b'%3EBike (0.87)%3C/text%3E%3Crect x='380' y='280' width='120' height='90' fill='none' stroke='%23ec4899' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='390' y='305' font-family='Arial' font-size='14' font-weight='bold' fill='%23ec4899'%3ESign (0.76)%3C/text%3E%3Crect x='20' y='30' width='80' height='60' fill='none' stroke='%238b5cf6' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='30' y='55' font-family='Arial' font-size='14' font-weight='bold' fill='%238b5cf6'%3ETree (0.82)%3C/text%3E%3C/svg%3E"
                  alt="Annotated"
                  className="annotated-image"
                />
              </div>
            </div>

            <div className="result-card">
              <div className="card-header">
                <h3 className="card-title">Detection Results</h3>
                <span className="card-badge">Sortable</span>
              </div>
              <div className="table-wrapper">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSortTable(0)}
                        className={sortColumn === 0 ? "sorted" : ""}
                      >
                        Object
                        <span className="sort-icon">
                          {sortColumn === 0
                            ? sortDirection === "asc"
                              ? "▲"
                              : "▼"
                            : "▼"}
                        </span>
                      </th>
                      <th
                        onClick={() => handleSortTable(1)}
                        className={sortColumn === 1 ? "sorted" : ""}
                      >
                        Confidence
                        <span className="sort-icon">
                          {sortColumn === 1
                            ? sortDirection === "asc"
                              ? "▲"
                              : "▼"
                            : "▼"}
                        </span>
                      </th>
                      <th
                        onClick={() => handleSortTable(2)}
                        className={sortColumn === 2 ? "sorted" : ""}
                      >
                        Bounding Box
                        <span className="sort-icon">
                          {sortColumn === 2
                            ? sortDirection === "asc"
                              ? "▲"
                              : "▼"
                            : "▼"}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <span className="object-class">{row.object}</span>
                        </td>
                        <td>
                          <div className="confidence-bar">
                            <div className="confidence-progress">
                              <div
                                className="confidence-fill"
                                style={{ width: `${row.confidence}%` }}
                              />
                            </div>
                            <span className="confidence-value">
                              {row.confidence}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="boundingBox-coords">
                            {row.boundingBox}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="qa-section">
            <div className="qa-header">
              <div className="qa-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div>
                <h3 className="card-title">Ask Questions About Results</h3>
                <p className="section-subtitle" style={{ margin: 0 }}>
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            </div>

            <div className="chat-container" ref={chatContainerRef}>
              <div className="chat-message user">
                <div className="message-avatar user">JD</div>
                <div className="message-content">
                  What is the confidence score of the largest object?
                </div>
              </div>
              <div className="chat-message ai">
                <div className="message-avatar ai">AI</div>
                <div className="message-content">
                  Based on the detection results, the largest object is the Car
                  with a bounding box of (80, 120, 260, 280), which has
                  dimensions of 180x160 pixels. This car has a confidence score
                  of 94%, making it the most confidently detected object in the
                  image.
                </div>
              </div>
              <div className="chat-message user">
                <div className="message-avatar user">JD</div>
                <div className="message-content">
                  How many objects were detected with confidence above 85%?
                </div>
              </div>
              <div className="chat-message ai">
                <div className="message-avatar ai">AI</div>
                <div className="message-content">
                  There are 3 objects detected with confidence above 85%: Car
                  (94%), Person (89%), and Bike (87%). These represent the most
                  reliable detections in your image.
                </div>
              </div>
            </div>

            <div className="qa-input-wrapper">
              <input
                type="text"
                className="qa-input"
                placeholder="Ask a question about the detected objects..."
              />
              <button className="qa-submit">Send</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
