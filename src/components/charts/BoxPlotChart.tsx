import { ResponsiveContainer, ComposedChart, Line, Scatter, XAxis, YAxis, Tooltip } from "recharts";

export default function BoxPlotChart({ stats, column } : { stats: any; column: string }) {
  const { min, q1, median, q3, max } = stats;

  const data = [
    { label: "Min", value: min },
    { label: "Q1", value: q1 },
    { label: "Median", value: median },
    { label: "Q3", value: q3 },
    { label: "Max", value: max },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <XAxis dataKey="label" tick={{ fill: "#fff" }} />
        <YAxis tick={{ fill: "#fff" }} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" />
        <Scatter dataKey="value" fill="#fff" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
