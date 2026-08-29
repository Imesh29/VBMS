import { useState } from "react";
import { FaBell } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import AccountPanel from "../common/AccountPanel";

/**
 * Generate user initials from the full name.
 *
 * Example:
 * "Imesh Daksitha" -> "ID"
 */
function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/**
 * Props used to customize the navbar title
 * depending on the current page.
 */
interface TopNavbarProps {
  title?: string;
  subtitle?: string;
}

/**
 * Top navigation bar used across the protected application pages.
 *
 * Features:
 * - Dynamic page title and subtitle
 * - Notification button
 * - Logged-in user information from AuthContext
 * - Role-aware label
 * - Account panel access
 */
export default function TopNavbar({
  title = "Dashboard",
  subtitle = "Overview of your vehicle booking system",
}: TopNavbarProps) {
  const { user } = useAuth();

  /**
   * Controls the visibility of the account side panel.
   */
  const [accountOpen, setAccountOpen] = useState(false);

  /**
   * Fallback user name in case authentication
   * information has not been loaded yet.
   */
  const displayName = user?.fullName || "User";

  /**
   * Convert backend role values into
   * user-friendly labels.
   */
  const roleLabel =
    user?.role === "ADMIN"
      ? "Admin"
      : user?.role === "DEAN"
        ? "Faculty Dean"
        : "Staff";

  return (
    <>
      {/* =====================================================
          TOP NAVIGATION BAR
      ====================================================== */}
      <header
        className="
          flex
          shrink-0
          items-center
          justify-between

          border-b
          border-black/[0.06]

          bg-white

          px-6
          py-5

          md:px-8
        "
        style={{
          padding: "13px",
        }}
      >
        {/* ===================================================
            PAGE TITLE
        ==================================================== */}
        <div className="min-w-0">
          <h1
            className="
              truncate

              text-xl
              font-bold

              text-[#1C1C2E]

              md:text-2xl
            "
            style={{
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {title}
          </h1>

          <p
            className="
              mt-0.5
              truncate

              text-sm
              text-gray-400
            "
          >
            {subtitle}
          </p>
        </div>

        {/* ===================================================
            RIGHT SIDE ACTIONS
        ==================================================== */}
        <div className="flex shrink-0 items-center gap-4">
          {/* =================================================
              NOTIFICATION BUTTON
          ================================================== */}
          <button
            type="button"
            title="Notifications"
            aria-label="Notifications"
            className="
              relative

              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-xl

              bg-gray-50
              text-gray-500

              transition-colors

              hover:bg-gray-100
            "
          >
            <FaBell className="h-4 w-4" />

            {/* Notification indicator */}
            <span
              className="
                absolute
                right-3
                top-2.5

                h-2
                w-2

                rounded-full

                bg-[#4C1D1D]

                ring-2
                ring-white
              "
            />
          </button>

          {/* =================================================
              USER ACCOUNT BUTTON
          ================================================== */}
          <button
            type="button"
            onClick={() => setAccountOpen(true)}
            title="My Account"
            className="
              flex
              items-center
              gap-3

              border-l
              border-gray-100

              pl-4

              transition-opacity

              hover:opacity-80
            "
          >
            {/* User avatar */}
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center

                rounded-full

                bg-[#4C1D1D]

                text-sm
                font-bold
                text-white
              "
            >
              {initials(displayName)}
            </div>

            {/* User information */}
            <div
              className="
                hidden
                min-w-0
                text-left

                sm:block
              "
              style={{
                marginRight: "8px",
              }}
            >
              <p
                className="
                  max-w-[160px]
                  truncate

                  text-sm
                  font-semibold
                  leading-tight

                  text-[#1C1C2E]
                "
              >
                {displayName}
              </p>

              <p
                className="
                  mt-0.5
                  truncate

                  text-xs
                  leading-tight

                  text-gray-400
                "
              >
                {roleLabel}
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* =====================================================
          ACCOUNT PANEL
      ====================================================== */}
      <AccountPanel
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
      />
    </>
  );
}