import { useState, type ReactNode } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaUserGraduate,
  FaUserShield,
  FaBuilding,
} from "react-icons/fa";

interface Role {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
}

const roles: Role[] = [
  {
    id: 1,
    title: "Staff/Lecturer",
    description: "Create and manage trip bookings",
    icon: <FaUserGraduate className="text-blue-600" />,
  },
  {
    id: 2,
    title: "Faculty Dean",
    description: "Review and approve booking requests",
    icon: <FaUserShield className="text-purple-600" />,
  },
  {
    id: 3,
    title: "Department Admin",
    description: "Full fleet and booking management",
    icon: <FaBuilding className="text-red-500" />,
  },
];

export default function RoleDropdown() {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">

      {/* Label */}

      {/* Selected Role */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-2xl px-4 py-4 shadow-sm hover:border-[#5B1E1D] transition"
      >
        <div className="flex items-center gap-4">

          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            {selectedRole.icon}
          </div>

          <div className="text-left">
            <h3 className="font-semibold text-gray-800">
              {selectedRole.title}
            </h3>

            <p className="text-xs text-gray-500">
              {selectedRole.description}
            </p>
          </div>

        </div>

        {isOpen ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">

          {roles.map((role) => (

            <button
              key={role.id}
              type="button"
              onClick={() => handleSelect(role)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {role.icon}
                </div>

                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">
                    {role.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {role.description}
                  </p>
                </div>

              </div>

              {selectedRole.id === role.id && (
                <FaCheck className="text-[#5B1E1D]" />
              )}
            </button>

          ))}

        </div>
      )}

    </div>
  );
}