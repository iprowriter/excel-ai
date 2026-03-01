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
            {/* <div className="ai-summary-alert">
                <Sparkles size={18} className="sparkle-icon" />
                <p><strong>AI Insight:</strong> Q4 Revenue exceeded targets by 14% (+$240K). Product 'Aero' drove 60% of growth.</p>
            </div> */}
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

                {analysis &&
                    Object.entries(analysis.structured.summary)
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
                            {Object.entries(analysis.structured.summary)
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











// return (
//          <main className="main-content">
//             {/* Dashboard Header */}
//             <header className="dashboard-header">
//                 <div className="header-info">
//                 <div className="file-badge">XLSX</div>
//                 <h2>Q4_Sales_Report.xlsx</h2>
//                 </div>
//                 <div className="header-actions">
//                 <input
//                     type="file"
//                     accept=".xlsx"
//                     onChange={(e) => {
//                         const f = e.target.files?.[0] || null;
//                         setLocalFile(f);
//                         if (f) setFile(f.name);
//                     }}
//                     />
//                 <button
//                  className="secondary-btn"
//                  disabled={!file || loading}
//                  onClick={handleUpload}
//                  > 
//                  {loading ? "Processing..." : "Analyze Excel"}
//                  </button>
//                 <button className="primary-btn">Share Report</button>
//                 </div>
//             </header>

//             {/* Summary Alert */}
//             <div className="ai-summary-alert">
//                 <Sparkles size={18} className="sparkle-icon" />
//                 <p><strong>AI Insight:</strong> Q4 Revenue exceeded targets by 14% (+$240K). Product 'Aero' drove 60% of growth.</p>
//             </div>

//             {/* KPI Grid */}
//             <section className="kpi-grid">
//                 <div className="kpi-card">
//                 <div className="kpi-top">
//                     <span className="kpi-label">Total Revenue</span>
//                     <DollarSign size={16} className="kpi-icon blue" />
//                 </div>
//                 <div className="kpi-value">$1.85M</div>
//                 <div className="kpi-trend positive">+14% vs last qtr</div>
//                 </div>

//                 <div className="kpi-card">
//                 <div className="kpi-top">
//                     <span className="kpi-label">Avg. Order Value</span>
//                     <Activity size={16} className="kpi-icon purple" />
//                 </div>
//                 <div className="kpi-value">$415</div>
//                 <div className="kpi-trend positive">+3%</div>
//                 </div>

//                 <div className="kpi-card">
//                 <div className="kpi-top">
//                     <span className="kpi-label">Customer Growth</span>
//                     <Users size={16} className="kpi-icon green" />
//                 </div>
//                 <div className="kpi-value">+850</div>
//                 <div className="kpi-trend positive">+9%</div>
//                 </div>

//                 <div className="kpi-card">
//                 <div className="kpi-top">
//                     <span className="kpi-label">Churn Rate</span>
//                     <TrendingUp size={16} className="kpi-icon red" />
//                 </div>
//                 <div className="kpi-value">2.1%</div>
//                 <div className="kpi-trend negative">-0.5%</div>
//                 </div>
//             </section>

//             {/* Charts Section */}
//             <section className="charts-container">
//                 <div className="chart-card">
//                 <div className="chart-header">
//                     <BarChart3 size={18} />
//                     <span>Revenue by Region (Q4)</span>
//                 </div>
//                 <div className="chart-placeholder">
//                     {/* You can integrate Recharts/Chart.js here later */}
//                     <div className="bar-container">
//                     <div className="bar" style={{ height: '80%' }}><span>NA</span></div>
//                     <div className="bar" style={{ height: '60%' }}><span>EU</span></div>
//                     <div className="bar" style={{ height: '40%' }}><span>APAC</span></div>
//                     <div className="bar" style={{ height: '20%' }}><span>SA</span></div>
//                     </div>
//                 </div>
//                 <p className="chart-ai-note">AI Note: North America remains the strongest region.</p>
//                 </div>

//                 <div className="chart-card">
//                 <div className="chart-header">
//                     <PieChartIcon size={18} />
//                     <span>Product Performance</span>
//                 </div>
//                 <div className="chart-placeholder flex-center">
//                     <div className="mock-pie"></div>
//                     <div className="legend">
//                         <div><span className="dot aero"></span> Aero</div>
//                         <div><span className="dot volt"></span> Volt</div>
//                     </div>
//                 </div>
//                 <p className="chart-ai-note">AI Note: 'Aero' continues dominant growth curve.</p>
//                 </div>
//             </section>
//         </main>
   
//   );
// }