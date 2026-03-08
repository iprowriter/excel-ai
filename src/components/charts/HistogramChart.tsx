import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function HistogramChart({ values} : { values: number[] | null; }) {
  if (!values || values.length === 0) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const bins = 10;
  const step = (max - min) / bins;

  const histogram = Array.from({ length: bins }).map((_, i) => {
    const start = min + i * step;
    const end = start + step;
    const count = values.filter(v => v >= start && v < end).length;

    return {
      range: `${start.toFixed(0)} - ${end.toFixed(0)}`,
      count,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={histogram}>
        <XAxis dataKey="range" tick={{ fill: "#fff" }} />
        <YAxis tick={{ fill: "#fff" }} />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
