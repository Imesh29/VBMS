import {
  FaThLarge,
  FaCalendarAlt,
  FaPlusCircle,
  FaChevronLeft,
  FaSignOutAlt,
  FaCar,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: FaThLarge,
  },
  {
    name: "Bookings",
    path: "/bookings",
    icon: FaCalendarAlt,
  },
  {
    name: "Add Booking",
    path: "/bookings/add",
    icon: FaPlusCircle,
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
        hidden
        lg:flex
        w-[280px]
        min-h-screen
        flex-col
        bg-[#511D1D]
        text-white
        shrink-0
      "
    >

      {/* Logo */}
      <div className="h-[80px] border-b border-white/10 px-5 flex items-center">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white/10
          "
        >
          <FaCar size={17} />
        </div>

        <div className="ml-3 flex-1">
          <h1 className="font-bold text-lg">
            VBMS
          </h1>

          <p className="text-[11px] text-white/50">
            Vehicle Booking Mgmt
          </p>
        </div>

        <FaChevronLeft
          className="text-white/40"
          size={12}
        />

      </div>

      {/* User role */}
      <div className="px-3 pt-5">

        <div
          className="
            flex
            items-center
            rounded-full
            bg-white/10
            px-4
            py-2
          "
        >
          <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-sm text-white/80">
            Staff
          </span>
        </div>

      </div>

      {/* Navigation */}
      <div className="px-3 pt-5">

        <p className="px-3 text-xs uppercase tracking-wider text-white/40">
          Navigation
        </p>

        <nav className="mt-4 space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  transition-all
                  ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }
                  `
                }
              >
                <Icon size={17} />

                <span className="flex-1">
                  {item.name}
                </span>

                {item.name === "Bookings" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                )}
              </NavLink>
            );
          })}

        </nav>

      </div>

      {/* Bottom profile */}
      <div className="mt-auto border-t border-white/10 p-4">

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/15
              text-sm
              font-semibold
            "
          >
            AZ
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold">
              Dr. Amirah
            </p>

            <p className="truncate text-xs text-white/50">
              Computer Science
            </p>

          </div>

          <button
            type="button"
            title="Logout"
            className="text-white/50 hover:text-white"
          >
            <FaSignOutAlt size={15} />
          </button>

        </div>

      </div>

    </aside>
  );
}