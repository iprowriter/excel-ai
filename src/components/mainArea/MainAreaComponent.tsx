import { useState } from "react";
import "./mainAreaComponent.css";
import { BarChart3, Activity, DollarSign, Sparkles } from 'lucide-react';
import { useStore } from "../../store/useStore"
import { parseAIReport, extractOverview } from "../../utils/parseReport";


function MainAreaComponent() {
  const { setFile, setAnalysis } = useStore();

  const [file, setLocalFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
    });

    setLoading(false);

   };

   const analysis = useStore((state) => state.analysis);

   console.log("Structured Analysis:", analysis);

   const parsed = analysis?.report ? parseAIReport(analysis.report) : []; 
   const aiHeadline = parsed.length > 0 ? parsed[0].content[0] : "";
   const overview = analysis?.report ? extractOverview(analysis.report) : "";


  const summary = analysis?.structured?.summary;

  return (
         <main className="main-content">
            {/* Dashboard Header */}
            <header className="dashboard-header">
                <div className="header-info">
                <div className="file-badge">XLSX</div>
                <h2>Q4_Sales_Report.xlsx</h2>
                </div>
                <div className="header-actions">
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setLocalFile(f);
                        if (f) setFile(f.name);
                    }}
                    />
                <button
                 className="secondary-btn"
                 disabled={!file || loading}
                 onClick={handleUpload}
                 > 
                 {loading ? "Processing..." : "Analyze Excel"}
                 </button>
                <button className="primary-btn">Share Report</button>
                </div>
            </header>

            {/* Summary Alert */}
           
            {analysis && (
                <div className="ai-summary-alert">
                    <Sparkles size={18} className="sparkle-icon" />
                    <p>
                    <strong>AI Insight:</strong> {overview}
                    </p>
                </div>
            )}



            {/* KPI Grid */}
            <section className="kpi-grid">
                <div className="kpi-card">
                <div className="kpi-top">
                    <span className="kpi-label">Total Rows</span>
                    <DollarSign size={16} className="kpi-icon blue" />
                </div>
                <div className="kpi-value"> {analysis?.structured?.rows ?? "--"}</div>
                <div className="kpi-trend positive">+14% vs last qtr</div>
                </div>

                <div className="kpi-card">
                <div className="kpi-top">
                    <span className="kpi-label">Total Columns</span>
                    <Activity size={16} className="kpi-icon purple" />
                </div>
                <div className="kpi-value">{analysis?.structured?.columns?.length ?? "--"}</div>
                <div className="kpi-trend positive">+3%</div>
                </div>

                {summary  &&
                    Object.entries(summary)
                        .filter(([_, v]: any) => v.type === "numeric")
                        .slice(0, 2)
                        .map(([key, v]: any) => (
                        <div className="kpi-card" key={key}>
                            <div className="kpi-top">
                            <span className="kpi-label">{key}</span>
                            </div>
                            <div className="kpi-value">{v.mean}</div>
                            <div className="kpi-trend">Min {v.min} / Max {v.max}</div>
                        </div>
                        ))}

            </section>

            {/* Charts Section */}
            <section className="charts-container">
                {analysis && (
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
                    )}

            </section>
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

        </main>
   
  );
}

export default MainAreaComponent;