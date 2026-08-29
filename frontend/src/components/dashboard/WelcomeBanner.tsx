import { FaCar } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface WelcomeBannerProps {
  totalBookings?: number;
}

export default function WelcomeBanner({
  totalBookings = 0,
}: WelcomeBannerProps) {
  const { user } = useAuth();

  const formattedDate = new Date().toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="relative bg-[#4C1D1D] rounded-2xl px-6 md:px-8 py-6 md:py-7 overflow-hidden flex items-center justify-between"
      style={{
        padding: "20px",
        marginTop: "15px",
        marginBottom: "15px",
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse at 90% 50%, #fff 0%, transparent 70%)",
        }}
      />

      {/* Watermark icon */}
      <div className="absolute right-8 bottom-0 opacity-[0.07] pointer-events-none">
        <FaCar className="w-32 h-32 text-white" />
      </div>

      {/* Left */}
      <div className="relative z-10 min-w-0">
        <p className="text-white/50 text-sm">{getGreeting()},</p>

        <h2
          className="text-white text-2xl md:text-3xl font-bold mt-1 leading-tight truncate"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {user?.fullName || "there"}
        </h2>

        <p className="text-white/40 text-sm mt-2">
          {totalBookings} total bookings across the system
        </p>
      </div>

      {/* Right */}
      <div className="relative z-10 hidden sm:flex items-center gap-2 shrink-0 rounded-xl bg-white/[0.06] px-4 py-3">
        <div className="text-right">
          <p className="text-white/40 text-xs uppercase tracking-widest">
            Today
          </p>
          <p className="text-white/90 text-base font-semibold whitespace-nowrap">
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
}
