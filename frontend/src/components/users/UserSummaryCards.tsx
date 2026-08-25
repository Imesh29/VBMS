import { FaUsers } from "react-icons/fa";

import type { UserStats } from "../../types/user";

interface UserSummaryCardsProps {
  stats: UserStats;
  loading?: boolean;
}

export default function UserSummaryCards({
  stats,
  loading,
}: UserSummaryCardsProps) {
  const cards = [
    {
      key: "staff",
      icon: <FaUsers className="w-4 h-4" />,
      colorClass: "bg-blue-50 text-blue-700",
      value: stats.staff,
      label: "Staffs",
    },
    {
      key: "deans",
      icon: <FaUsers className="w-4 h-4" />,
      colorClass: "bg-purple-50 text-purple-700",
      value: stats.deans,
      label: "Faculty Deans",
    },
    {
      key: "admins",
      icon: <FaUsers className="w-4 h-4" />,
      colorClass: "bg-red-50 text-[#4C1D1D]",
      value: stats.admins,
      label: "Admins",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm h-[84px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.key}
          className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm flex items-center gap-3"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.colorClass}`}
          >
            {c.icon}
          </div>
          <div>
            <p
              className="text-2xl font-bold text-[#1C1C2E]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {c.value}
            </p>
            <p className="text-xs text-gray-400">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
