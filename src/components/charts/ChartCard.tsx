import "./chartCard.css";

export default function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h4>{title}</h4>
      </div>
      <div className="chart-body">{children}</div>
    </div>
  );
}
