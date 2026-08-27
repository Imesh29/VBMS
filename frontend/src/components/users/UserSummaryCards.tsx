import { FaUsers } from "react-icons/fa";

import type { UserStats } from "../../types/user";

interface UserSummaryCardsProps {
  stats: UserStats;
  loading?: boolean;
}

export default function UserSummaryCards({
  stats,
  loading = false,
}: UserSummaryCardsProps) {
  const cards = [
    {
      label: "Staffs",
      value: stats.staff,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Faculty Deans",
      value: stats.deans,
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      label: "Admins",
      value: stats.admins,
      iconStyle: "bg-red-50 text-[#4C1D1D]",
    },
  ];

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-5"
      style={{ marginBottom: "20px" }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className="
            bg-white
            border border-gray-200
            rounded-2xl
            shadow-sm
            px-5 py-6
            flex items-center
            min-h-[102px]
          "
          style={{ padding: "15px" }}
        >
          <div
            className={`
              w-12 h-12
              rounded-full
              flex items-center justify-center
              shrink-0
              ${card.iconStyle}
            `}
          >
            <FaUsers className="w-5 h-5" />
          </div>

          <div className="ml-4" style={{ margin: "15px" }}>
            {loading ? (
              <div className="w-8 h-7 bg-gray-100 rounded-md animate-pulse" />
            ) : (
              <p className="text-[28px] leading-none font-bold text-[#101426]">
                {card.value}
              </p>
            )}

            <p className="mt-2 text-sm text-gray-400">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
