import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

export default function CategoryPieChart({
  data
}: {
  data: string[] | null;
}) {
  if (!data || data.length === 0) return null;

  const counts: Record<string, number> = {};

  data.forEach((v) => {
    counts[v] = (counts[v] || 0) + 1;
  });

  const chartData = Object.entries(counts).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
