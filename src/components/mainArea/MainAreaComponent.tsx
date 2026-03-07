import { useEffect, useState } from "react";
import "./mainAreaComponent.css";
import { BarChart3, Activity, DollarSign, Paperclip } from 'lucide-react';
import { useStore } from "../../store/useStore"
import { parseAIReport } from "../../utils/parseReport";




function MainAreaComponent() {
  const { setFile, setAnalysis } = useStore();

  const [file, setLocalFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const fileName = useStore((state) => state.fileName);


  useEffect(() => {
     if (!loading) return; 
     const interval = setInterval(() => { 
        setLoadingIndex((i) => (i + 1) % loadingMessages.length); 
     }, 2000); 
     return () => clearInterval(interval); 
    },  [loading]
  );


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

    setAnalysis({
      sessionId: data.sessionId,
      structured: data.structured,
      report: data.report,
      fileName: useStore.getState().fileName
    });

    setLoading(false);

   };

   const analysis = useStore((state) => state.analysis);

   console.log("Structured Analysis:", analysis);

   const parsed = analysis?.report ? parseAIReport(analysis.report) : []; 
 //  const aiHeadline = parsed.length > 0 ? parsed[0].content[0] : "";
 //  const overview = analysis?.report ? extractOverview(analysis.report) : "";


  const summary = analysis?.structured?.summary;

  return  (
    <main className="main-content">

      {/* ALWAYS VISIBLE HEADER */}
      <header className="dashboard-header">
        <div className="header-info">
          <div className="file-badge">XLSX</div>
          <h2>{fileName ?? "No file uploaded"}</h2>
        </div>

        <div className="header-actions">
          <label className="upload-box">
            <input
              type="file"
              accept=".xlsx"
              className="upload-input"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setLocalFile(f);
                if (f) setFile(f.name);
              }}
            />
            <Paperclip size={16} style={{ marginRight: 6 }} />
            <span className="upload-text">Upload Excel File</span>
          </label>

          <button
            className="secondary-btn"
            disabled={!file || loading}
            onClick={handleUpload}
          >
            {loading ? "Processing..." : "Analyze Excel"}
          </button>

          {/* <button className="primary-btn">Download</button> */}
        </div>
      </header>

      {/* CONTENT AREA SWITCHES BELOW */}
      {loading ? (
        // LOADING SCREEN
        <div className="loading-screen">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">{loadingMessages[loadingIndex]}</p>
          </div>
        </div>
      ) : !analysis ? (
        // EMPTY STATE
        <div className="empty-state">
          <div className="empty-message">
            <h2>Upload an Excel file to begin</h2>
            <p>I’ll analyze it and generate insights for you.</p>
          </div>
        </div>
      ) : (
        // DASHBOARD CONTENT
        <>
          {/* KPI GRID */}
          <section className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Rows</span>
                <DollarSign size={16} className="kpi-icon blue" />
              </div>
              <div className="kpi-value">{analysis?.structured?.rows ?? "--"}</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Columns</span>
                <Activity size={16} className="kpi-icon purple" />
              </div>
              <div className="kpi-value">
                {analysis?.structured?.columns?.length ?? "--"}
              </div>
            </div>

            {summary &&
              Object.entries(summary)
                .filter(([_, v]: any) => v.type === "numeric")
                .slice(0, 2)
                .map(([key, v]: any) => (
                  <div className="kpi-card" key={key}>
                    <div className="kpi-top">
                      <span className="kpi-label">{key}</span>
                    </div>
                    <div className="kpi-value">{v.mean}</div>
                    <div className="kpi-trend">
                      Min {v.min} / Max {v.max}
                    </div>
                  </div>
                ))}
          </section>

          {/* CHARTS */}
          <section className="charts-container">
            <div className="chart-card">
              <div className="chart-header">
                <BarChart3 size={18} />
                <span>Numeric Columns Overview</span>
              </div>

              <div className="chart-placeholder">
                <div className="bar-container">
                  {Object.entries(analysis?.structured?.summary)
                    .filter(([_, v]: any) => v.type === "numeric")
                    .map(([key, v]: any) => (
                      <div
                        key={key}
                        className="bar"
                        style={{ height: `${(v.mean / v.max) * 100}%` }}
                      >
                        <span>{key}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* REPORT */}
           <section className="report-section">
                <h3>Executive Report</h3>

                <div className="report-body">
                    {parsed.map((section, idx) => (
                    <div key={idx} className="report-section-block">
                        {section.title && <h4 className="report-section-title">{section.title}</h4>}

                        {section.content.map((line, i) => {
                        const isBullet = line.startsWith("*") || line.startsWith("•") || line.match(/^\d+\./);

                        return isBullet ? (
                            <li key={i} className="report-bullet">
                            {line.replace(/^[*•]\s*/, "").replace(/^\d+\.\s*/, "")}
                            </li>
                        ) : (
                            <p key={i} className="report-paragraph">{line}</p>
                        );
                        })}
                    </div>
                    ))}
                </div>
            </section>
        </>
      )}
    </main>
  );
}

export default MainAreaComponent;



const loadingMessages = [ 
    "Contacting server…", 
    "Analyzing your document…", 
    "Processing spreadsheet…",
    "Calculating statistics…",
    "Generating report…",
    "Checking column structure…", 
    "Validating data integrity…",
    "Mapping relationships in the data…", 
    "Optimizing for clarity…",
    "Understanding trends and patterns…", 
    "Extracting insights…", 
 ];

