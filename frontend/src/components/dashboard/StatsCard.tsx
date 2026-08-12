import type { ReactNode } from "react";
import { FaArrowUp } from "react-icons/fa";

interface StatsCardProps {
  icon: ReactNode;
  colorClass: string;
  title: string;
  value: string | number;
  caption?: string;
  trend?: { value: string; up: boolean };
}

export default function StatsCard({
  icon,
  colorClass,
  title,
  value,
  caption,
  trend,
}: StatsCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col gap-5 hover:shadow-md transition-shadow"
      style={{
        margin: "8px",
        padding: "20px",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center ${colorClass}`}
        >
          {icon}
        </div>

        {trend && (
          <span
            className={`flex items-center gap-1 text-sm font-semibold ${
              trend.up ? "text-emerald-600" : "text-red-500"
            }`}
          >
            <FaArrowUp
              className={`w-3.5 h-3.5 ${!trend.up ? "rotate-180" : ""}`}
            />
            {trend.value}
          </span>
        )}
      </div>

      <div>
        <p
          className="text-3xl md:text-[2rem] font-bold text-[#1C1C2E] leading-none tracking-tight"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {value}
        </p>

        <p className="text-sm text-gray-500 mt-2">{title}</p>

        {caption && <p className="text-xs text-gray-400 mt-1">{caption}</p>}
      </div>
    </div>
  );
}
