import { useState, type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaCar,
  FaUsers,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

/**
 * `path: null` means the page doesn't exist yet — the item renders
 * disabled instead of navigating to a dead route.
 */
const NAV_ITEMS: {
  id: string;
  label: string;
  icon: ReactElement;
  path: string | null;
  roles?: Array<"USER" | "DEAN" | "ADMIN">;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt className="text-lg" />,
    path: "/dashboard",
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: <FaCalendarCheck className="text-lg" />,
    path: null,
  },
  {
    id: "vehicles",
    label: "Vehicles",
    icon: <FaCar className="text-lg" />,
    path: "/vehicles",
    roles: ["ADMIN"],
  },
  {
    id: "users",
    label: "Users",
    icon: <FaUsers className="text-lg" />,
    path: "/users",
    roles: ["ADMIN"],
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FaFileAlt className="text-lg" />,
    path: "/reports",
    roles: ["ADMIN", "DEAN"],
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role)),
  );

  const displayName = user?.fullName || "User";
  const roleLabel =
    user?.role === "ADMIN"
      ? "Dept. Admin"
      : user?.role === "DEAN"
        ? "Faculty Dean"
        : "Staff";

  return (
    <aside
      className="h-screen flex flex-col bg-[#4C1D1D] shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
      style={{ width: collapsed ? 84 : 288 }}
    >
      {/* Logo row */}
      <div
        className={`flex items-center gap-3 px-5 py-6 border-b border-white/[0.08] shrink-0 ${
          collapsed ? "justify-center" : ""
        }`}
        style={{
          padding: "14px",
        }}
      >
        <div className="w-10 h-10 bg-white/[0.15] rounded-xl flex items-center justify-center shrink-0">
          <FaCar className="w-5 h-5 text-white" />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p
              className="text-white font-bold text-lg tracking-wide leading-none"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              VBMS
            </p>
            <p className="text-white/40 text-xs mt-1 leading-tight truncate">
              Vehicle Booking Mgmt
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/30 hover:text-white/70 transition-colors shrink-0 ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <FaChevronRight className="w-4 h-4" />
          ) : (
            <FaChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Role indicator */}
      {!collapsed && (
        <div
          className="px-4 pt-5 shrink-0"
          style={{
            margin: "10px",
          }}
        >
          <div className="bg-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
              style={{
                marginLeft: "10px",
              }}
            />
            <span
              className="text-white/70 text-sm font-medium truncate"
              style={{
                margin: "5px",
              }}
            >
              {roleLabel}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav
        className="flex-1 px-3.5 py-5 space-y-2 overflow-y-auto"
        style={{
          margin: "6px",
        }}
      >
        {!collapsed && (
          <p
            className="text-white/30 text-xs uppercase tracking-widest px-3.5 mb-3 font-semibold"
            style={{
              marginLeft: "20px",
              marginBottom: "15px",
            }}
          >
            Navigation
          </p>
        )}

        {visibleNavItems.map((item) => {
          const isActive = item.path
            ? location.pathname.startsWith(item.path)
            : false;
          const isDisabled = !item.path;

          return (
            <button
              key={item.id}
              onClick={() => item.path && navigate(item.path)}
              disabled={isDisabled}
              title={
                isDisabled
                  ? "Coming soon"
                  : collapsed
                    ? item.label
                    : undefined
              }
              className={`w-full flex items-center gap-3.5 rounded-xl transition-all duration-150 text-left
                ${collapsed ? "justify-center px-0 py-3.5" : "px-4 py-3.5"}
                ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
                ${
                  isActive
                    ? "bg-white/[0.15] text-white"
                    : "text-white/55 hover:bg-white/[0.07] hover:text-white/85"
                }`}
            >
              <span
                className="shrink-0"
                style={{
                  marginLeft: "10px",
                }}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <span
                  className="text-sm font-semibold flex-1"
                  style={{
                    margin: "11px",
                  }}
                >
                  {item.label}
                </span>
              )}

              {!collapsed && isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0"
                  style={{
                    marginRight: "10px",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="border-t border-white/[0.08] p-4 shrink-0"
        style={{
          margin: "10px",
        }}
      >
        <div
          className={`flex items-center gap-3 ${
            collapsed ? "justify-center" : ""
          }`}
          style={{
            margin: "5px",
          }}
        >
          <div className="w-10 h-10 rounded-full bg-white/[0.18] flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials(displayName)}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">
                  {displayName}
                </p>
                <p className="text-white/40 text-xs truncate mt-0.5">
                  {user?.department || "Vehicle Mgmt Dept."}
                </p>
              </div>

              <button
                onClick={() => logout()}
                title="Log out"
                className="text-white/30 hover:text-white/70 transition-colors shrink-0"
              >
                <FaSignOutAlt className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
