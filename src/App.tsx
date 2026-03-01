import { useState } from "react";
import "./App.css";

interface AnalysisResult {
  rows: number;
  columns: string[];
  summary: Record<string, any>;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    const res = await fetch("http://localhost:4000/api/sheet/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Excel Intelligence</h1>
      <p className="subtitle">
        Upload an Excel file (.xlsx) and receive a structured JSON analysis.
      </p>

      <div className="card">
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="upload-btn"
        >
          {loading ? "Processing..." : "Analyze Excel"}
        </button>
      </div>

      {result && (
        <pre className="output">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
