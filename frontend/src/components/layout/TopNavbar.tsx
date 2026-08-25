import { useState } from "react";
import { FaBell } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import AccountPanel from "../common/AccountPanel";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

interface TopNavbarProps {
  title?: string;
  subtitle?: string;
}

export default function TopNavbar({
  title = "Dashboard",
  subtitle = "Overview of your vehicle booking system",
}: TopNavbarProps) {
  const { user } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);

  const displayName = user?.fullName || "User";
  const roleLabel =
    user?.role === "ADMIN"
      ? "Admin"
      : user?.role === "DEAN"
        ? "Faculty Dean"
        : "Staff";

  return (
    <>
      <header
        className="bg-white border-b border-black/[0.06] px-6 md:px-8 py-5 flex items-center justify-between shrink-0"
        style={{
          padding: "13px",
        }}
      >
        <div className="min-w-0">
          <h1
            className="text-xl md:text-2xl font-bold text-[#1C1C2E] truncate"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {title}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5 truncate">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button className="relative w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <FaBell className="w-4 h-4" />
            <span className="absolute top-2.5 right-3 w-2 h-2 bg-[#4C1D1D] rounded-full ring-2 ring-white" />
          </button>

          <button
            onClick={() => setAccountOpen(true)}
            className="flex items-center gap-3 pl-4 border-l border-gray-100 hover:opacity-80 transition-opacity"
            title="My Account"
          >
            <div className="w-11 h-11 rounded-full bg-[#4C1D1D] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials(displayName)}
            </div>

            <div
              className="hidden sm:block min-w-0 text-left"
              style={{
                marginRight: "8px",
              }}
            >
              <p className="text-sm font-semibold text-[#1C1C2E] leading-tight truncate max-w-[160px]">
                {displayName}
              </p>
              <p className="text-xs text-gray-400 leading-tight mt-0.5 truncate">
                {roleLabel}
              </p>
            </div>
          </button>
        </div>
      </header>

      <AccountPanel open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
