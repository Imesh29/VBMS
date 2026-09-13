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
      colorClass: "bg-blue-50 text-blue-700",
      value: stats.staff,
      label: "Staffs",
    },
    {
      key: "deans",
      colorClass: "bg-purple-50 text-purple-700",
      value: stats.deans,
      label: "Faculty Deans",
    },
    {
      key: "admins",
      colorClass: "bg-red-50 text-[#4C1D1D]",
      value: stats.admins,
      label: "Admins",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-[104px] animate-pulse rounded-[20px] border border-slate-200 bg-white shadow-sm"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.key}
          className="flex min-h-[104px] items-center gap-4 rounded-[20px] border border-slate-200/90 bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.colorClass}`}
          >
            <FaUsers className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p
              className="text-[26px] font-bold leading-none text-[#131526]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {card.value}
            </p>
            <p className="mt-2 text-sm text-slate-400">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
