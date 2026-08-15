import { FaBell } from "react-icons/fa";

export default function TopNavbar() {
  return (
    <header
      className="
        flex
        h-[80px]
        shrink-0
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-7
      "
    >
      {/* Page title */}
      <div>
        <h1 className="text-lg font-bold text-slate-900">
          Bookings
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage and track all booking requests
        </p>
      </div>

      {/* User area */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <button
          type="button"
          title="Notifications"
          aria-label="Notifications"
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-slate-50
            text-slate-500
            transition
            hover:bg-slate-100
          "
        >
          <FaBell size={14} />

          {/* Notification indicator */}
          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              rounded-full
              bg-[#5B1E1D]
            "
          />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200" />

        {/* User */}
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[#5B1E1D]
              text-xs
              font-bold
              text-white
            "
          >
            AZ
          </div>

          {/* User information */}
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Dr. Amirah
            </p>

            <p className="text-xs text-slate-400">
              Staff
            </p>
          </div>

        </div>

      </div>
    </header>
  );
}