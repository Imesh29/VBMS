import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { StatusBreakdownItem } from "../../types/dashboard";

interface BookingChartProps {
  data: StatusBreakdownItem[];
  loading?: boolean;
}

export default function BookingChart({ data, loading }: BookingChartProps) {
  return (
    <div
      className="h-full bg-white rounded-2xl p-6 border border-black/5 shadow-sm"
      style={{
        marginTop: "15px",
        marginBottom: "15px",
        padding: "20px",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className="text-lg font-bold text-[#1C1C2E]"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Booking Status Overview
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">Current data</p>
        </div>
      </div>

      {loading ? (
        <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
          Loading chart…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barSize={32} barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F1F2F6"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 13, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 13, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              width={32}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                fontSize: 13,
                padding: "10px 16px",
              }}
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
            />

            <Bar dataKey="value" name="Bookings" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="flex items-center flex-wrap gap-x-6 gap-y-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="w-3.5 h-2.5 rounded-sm"
              style={{ background: item.color }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
