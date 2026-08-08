import { FaUserGraduate } from "react-icons/fa";

export type LoginRole = "USER" | "DEAN" | "ADMIN";

interface RoleDropdownProps {
  value: LoginRole;
  onChange: (role: LoginRole) => void;
}

export default function RoleDropdown({ value, onChange }: RoleDropdownProps) {
  return (
    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
        <FaUserGraduate className="text-blue-600" />
      </div>

      <div className="ml-4 flex-1">
        <h3 className="font-semibold">
          {value === "USER"
            ? "Staff / Lecturer"
            : value === "DEAN"
              ? "Faculty Dean"
              : "Administrator"}
        </h3>

        <p className="text-sm text-gray-500">Select your system role</p>
      </div>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as LoginRole)}
        className="bg-transparent outline-none"
      >
        <option value="USER">Staff</option>

        <option value="DEAN">Faculty Dean</option>

        <option value="ADMIN">Admin</option>
      </select>
    </div>
  );
}
