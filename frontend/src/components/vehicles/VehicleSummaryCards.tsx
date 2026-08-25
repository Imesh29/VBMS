import { FaCheckCircle, FaCarSide, FaWrench } from "react-icons/fa";

import type { VehicleStats } from "../../types/vehicle";

interface VehicleSummaryCardsProps {
  stats: VehicleStats;
  loading?: boolean;
}

const CARD_CONFIG = [
  {
    key: "available" as const,
    label: "Available",
    icon: <FaCheckCircle className="w-5 h-5 text-emerald-600" />,
    bg: "bg-emerald-50",
    iconBg: "bg-white",
    text: "text-emerald-700",
  },
  {
    key: "inUse" as const,
    label: "In Use",
    icon: <FaCarSide className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-50",
    iconBg: "bg-white",
    text: "text-blue-700",
  },
  {
    key: "maintenance" as const,
    label: "Maintenance",
    icon: <FaWrench className="w-5 h-5 text-amber-600" />,
    bg: "bg-amber-50",
    iconBg: "bg-white",
    text: "text-amber-700",
  },
];

export default function VehicleSummaryCards({
  stats,
  loading,
}: VehicleSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {CARD_CONFIG.map((card) => (
        <div
          key={card.key}
          className={`rounded-2xl px-6 py-5 flex items-center gap-4 ${card.bg}`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${card.iconBg}`}
          >
            {card.icon}
          </div>

          <div className="min-w-0">
            <p
              className={`text-2xl font-bold leading-none ${card.text}`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {loading ? "—" : stats[card.key]}
            </p>
            <p className={`text-sm font-medium mt-1.5 ${card.text}`}>
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
