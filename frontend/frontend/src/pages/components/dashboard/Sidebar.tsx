import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaCar,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaCarSide,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    icon: <FaTachometerAlt />,
    active: true,
  },
  {
    name: "Bookings",
    icon: <FaCalendarAlt />,
  },
  {
    name: "Vehicles",
    icon: <FaCar />,
  },
  {
    name: "Users",
    icon: <FaUsers />,
  },
  {
    name: "Reports",
    icon: <FaFileAlt />,
  },
  {
    name: "Settings",
    icon: <FaCog />,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#5B1E1D] text-white flex flex-col">

      {/* Logo */}

      <div className="border-b border-white/10 p-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">

            <FaCarSide className="text-xl" />

          </div>

          <div>

            <h2 className="font-bold text-xl">
              VBMS
            </h2>

            <p className="text-xs text-gray-300">
              Vehicle Booking System
            </p>

          </div>

        </div>

      </div>

      {/* User */}

      <div className="px-6 py-5">

        <div className="rounded-xl bg-white/10 p-4">

          <p className="text-xs text-gray-300">
            Logged in as
          </p>

          <h3 className="font-semibold mt-1">
            Department Admin
          </h3>

        </div>

      </div>

      {/* Navigation */}

      <div className="flex-1 px-4">

        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 px-3">
          Navigation
        </p>

        <nav className="space-y-2">

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition
              ${
                item.active
                  ? "bg-white text-[#5B1E1D] font-semibold shadow"
                  : "hover:bg-white/10"
              }`}
            >
              {item.icon}

              <span>{item.name}</span>

            </button>
          ))}

        </nav>

      </div>

      {/* Footer */}

      <div className="border-t border-white/10 p-6">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5B1E1D] font-bold">
            Z
          </div>

          <div>

            <h4 className="font-semibold">
              Mr. Zulkarnain
            </h4>

            <p className="text-xs text-gray-300">
              Vehicle Administrator
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}