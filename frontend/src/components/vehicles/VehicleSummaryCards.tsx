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
    icon: <FaCheckCircle className="h-5 w-5 text-emerald-600" />,
    bg: "#EAFBF4",
    border: "#C9F2E0",
    text: "#079669",
  },
  {
    key: "inUse" as const,
    label: "In Use",
    icon: <FaCarSide className="h-5 w-5 text-blue-600" />,
    bg: "#EEF5FF",
    border: "#D7E7FF",
    text: "#2563EB",
  },
  {
    key: "maintenance" as const,
    label: "Maintenance",
    icon: <FaWrench className="h-5 w-5 text-amber-600" />,
    bg: "#FFFAE9",
    border: "#F8E8A7",
    text: "#C65A06",
  },
];

export default function VehicleSummaryCards({
  stats,
  loading,
}: VehicleSummaryCardsProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3"
      style={{ gap: "20px", marginBottom: "15px" }}
    >
      {CARD_CONFIG.map((card) => (
        <div
          key={card.key}
          className="flex items-center rounded-[20px]"
          style={{
            minHeight: "102px",
            padding: "20px 22px",
            gap: "16px",
            backgroundColor: card.bg,
            border: `1px solid ${card.border}`,
          }}
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-full bg-white"
            style={{
              width: "50px",
              height: "50px",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
            }}
          >
            {card.icon}
          </div>

          <div className="min-w-0">
            <p
              className="font-bold leading-none"
              style={{
                color: card.text,
                fontSize: "28px",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {loading ? "—" : stats[card.key]}
            </p>
            <p
              className="font-medium"
              style={{ color: card.text, marginTop: "6px", fontSize: "14px" }}
            >
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
