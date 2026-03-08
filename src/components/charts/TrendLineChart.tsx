import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TrendLineChart({ data, column }: { data: any[] | null; column: string }) {

      if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" tick={{ fill: "#fff" }} />
        <YAxis tick={{ fill: "#fff" }} />
        <Tooltip />
        <Line type="monotone" dataKey={column} stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  );
}
