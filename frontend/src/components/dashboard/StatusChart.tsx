import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import type { StatusBreakdownItem } from "../../types/dashboard";

interface StatusChartProps {
  data: StatusBreakdownItem[];
  loading?: boolean;
}

export default function StatusChart({ data, loading }: StatusChartProps) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div
      className="h-full bg-white rounded-2xl p-6 border border-black/5 shadow-sm"
      style={{
        marginTop: "15px",
        marginBottom: "15px",
        padding: "20px",
      }}
    >
      <h3
        className="text-lg font-bold text-[#1C1C2E] mb-0.5"
        style={{ fontFamily: "Outfit, sans-serif" }}
      >
        Status Breakdown
      </h3>
      <p className="text-sm text-gray-400 mb-4">Current period</p>

      {loading ? (
        <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">
          Loading chart…
        </div>
      ) : !hasData ? (
        <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">
          No bookings yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={94}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "none",
                fontSize: 13,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="space-y-2.5 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: d.color }}
              />
              <span className="text-sm text-gray-600">{d.name}</span>
            </div>
            <span className="text-sm font-bold text-[#1C1C2E]">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
