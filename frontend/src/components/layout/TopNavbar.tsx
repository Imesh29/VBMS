import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

export default function TopNavbar() {
  const today = new Date();

  return (
    <header className="h-20 bg-white shadow-sm border-b flex items-center justify-between px-8">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Overview of your vehicle booking system
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Search */}

        <div className="relative">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-[#5B1E1D]"
          />

        </div>

        {/* Notification */}

        <button className="relative h-11 w-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">

          <FaBell />

          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        {/* Date */}

        <div className="hidden md:block text-right">

          <p className="text-xs text-gray-500">
            TODAY
          </p>

          <p className="font-semibold">
            {today.toLocaleDateString()}
          </p>

        </div>

        {/* Profile */}

        <div className="flex items-center gap-3">

          <FaUserCircle
            size={42}
            className="text-[#5B1E1D]"
          />

          <div>

            <h3 className="font-semibold">
              Admin User
            </h3>

            <p className="text-sm text-gray-500">
              Vehicle Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}