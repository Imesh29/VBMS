import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CHART_DATA = [
  { month: "Jan", completed: 12, cancelled: 2, pending: 1 },
  { month: "Feb", completed: 18, cancelled: 3, pending: 2 },
  { month: "Mar", completed: 15, cancelled: 1, pending: 3 },
  { month: "Apr", completed: 22, cancelled: 4, pending: 2 },
  { month: "May", completed: 19, cancelled: 2, pending: 4 },
  { month: "Jun", completed: 8, cancelled: 1, pending: 6 },
];

const LEGEND = [
  { c: "#4C1D1D", l: "Completed" },
  { c: "#EF4444", l: "Cancelled" },
  { c: "#F59E0B", l: "Pending" },
];

export default function BookingChart() {
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
            Monthly Booking Activity
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">January – June 2024</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={CHART_DATA}
          barSize={12}
          barGap={4}
          barCategoryGap="30%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F1F2F6"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 13, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 13, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            width={32}
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

          <Bar
            dataKey="completed"
            name="Completed"
            fill="#4C1D1D"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="cancelled"
            name="Cancelled"
            fill="#EF4444"
            radius={[4, 4, 0, 0]}
            opacity={0.65}
          />
          <Bar
            dataKey="pending"
            name="Pending"
            fill="#F59E0B"
            radius={[4, 4, 0, 0]}
            opacity={0.75}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-6 mt-4">
        {LEGEND.map((item) => (
          <div key={item.l} className="flex items-center gap-2">
            <span
              className="w-3.5 h-2.5 rounded-sm"
              style={{ background: item.c }}
            />
            <span className="text-sm text-gray-600">{item.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
