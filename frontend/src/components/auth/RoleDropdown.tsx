import { useEffect, useRef, useState } from "react";

import {
  FaUserGraduate,
  FaShieldAlt,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
} from "react-icons/fa";

export type LoginRole = "USER" | "DEAN" | "ADMIN";

interface RoleDropdownProps {
  value: LoginRole;
  onChange: (role: LoginRole) => void;
}

const ROLE_OPTIONS = [
  {
    value: "USER" as LoginRole,
    title: "Staff / Lecturer",
    description: "Create and manage trip bookings",
    icon: FaUserGraduate,
    iconBackground: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    value: "DEAN" as LoginRole,
    title: "Faculty Dean",
    description: "Review and approve booking requests",
    icon: FaShieldAlt,
    iconBackground: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    value: "ADMIN" as LoginRole,
    title: "Department Admin",
    description: "Full fleet and booking management",
    icon: FaChartBar,
    iconBackground: "bg-red-100",
    iconColor: "text-red-500",
  },
];

export default function RoleDropdown({ value, onChange }: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /*
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedRole =
    ROLE_OPTIONS.find((role) => role.value === value) || ROLE_OPTIONS[0];

  const SelectedIcon = selectedRole.icon;

  const handleSelect = (role: LoginRole) => {
    onChange(role);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* =====================================================
          SELECTED ROLE
      ====================================================== */}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex
          h-[76px]
          w-full
          items-center

          rounded-2xl

          border-2
          border-[#D9D4D4]

          bg-white

          px-5

          text-left

          transition-all
          duration-200

          ${isOpen ? "border-[#C8BDBD]" : "hover:border-[#CFC6C6]"}
        `}
      >
        {/* Icon */}

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center

            rounded-full

            ${selectedRole.iconBackground}
          `}
        >
          <SelectedIcon
            className={`
              text-lg
              ${selectedRole.iconColor}
            `}
          />
        </div>

        {/* Text */}

        <div className="ml-4 min-w-0 flex-1">
          <p
            className="
              text-base
              font-semibold
              leading-tight
              text-gray-900
            "
          >
            {selectedRole.title}
          </p>

          <p
            className="
              mt-1

              truncate

              text-xs
              text-gray-400
            "
          >
            {selectedRole.description}
          </p>
        </div>

        {/* Arrow */}

        <div
          className="
            ml-3
            shrink-0
            text-gray-400
          "
        >
          {isOpen ? (
            <FaChevronUp className="text-sm" />
          ) : (
            <FaChevronDown className="text-sm" />
          )}
        </div>
      </button>

      {/* =====================================================
          DROPDOWN OPTIONS
      ====================================================== */}

      {isOpen && (
        <div
          className="
            absolute
            left-0
            right-0
            top-[84px]
            z-50

            overflow-hidden

            rounded-2xl

            border
            border-gray-100

            bg-white

            shadow-[0_12px_35px_rgba(0,0,0,0.12)]
          "
        >
          {ROLE_OPTIONS.map((role) => {
            const Icon = role.icon;

            const isSelected = role.value === value;

            return (
              <button
                key={role.value}
                type="button"
                onClick={() => handleSelect(role.value)}
                className={`
                    flex
                    min-h-[66px]
                    w-full
                    items-center

                    px-5
                    py-4

                    text-left

                    transition-colors

                    ${isSelected ? "bg-[#FAF8F8]" : "bg-white hover:bg-gray-50"}
                  `}
              >
                {/* Icon */}

                <div
                  className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      ${role.iconBackground}
                    `}
                >
                  <Icon
                    className={`
                        text-base
                        ${role.iconColor}
                      `}
                  />
                </div>

                {/* Text */}

                <div className="ml-4 min-w-0 flex-1">
                  <p
                    className="
                        text-base
                        font-medium
                        text-gray-900
                      "
                  >
                    {role.title}
                  </p>

                  <p
                    className="
                        mt-1
                        text-xs
                        text-gray-400
                      "
                  >
                    {role.description}
                  </p>
                </div>

                {/* Check */}

                {isSelected && (
                  <FaCheck
                    className="
                        ml-3
                        shrink-0

                        text-[#5B1E1D]

                        text-sm
                      "
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
