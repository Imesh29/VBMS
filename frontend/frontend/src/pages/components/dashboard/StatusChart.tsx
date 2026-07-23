import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Approved", value: 60 },
  { name: "Pending", value: 25 },
  { name: "Rejected", value: 15 },
];

const COLORS = ["#22C55E", "#FACC15", "#EF4444"];

export default function StatusChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full">

      <h2 className="text-xl font-bold text-gray-800">
        Booking Status
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Current booking distribution
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}