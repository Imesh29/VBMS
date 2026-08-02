import { FaUserGraduate } from "react-icons/fa";

export default function RoleDropdown() {
  return (
    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-4">

      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <FaUserGraduate className="text-blue-600"/>
      </div>

      <div className="ml-4 flex-1">

        <h3 className="font-semibold">
          Staff / Lecturer
        </h3>

        <p className="text-sm text-gray-500">
          Create and manage trip bookings
        </p>

      </div>

      <select className="outline-none bg-transparent">

        <option>Staff</option>
        <option>Faculty Dean</option>
        <option>Admin</option>

      </select>

    </div>
  );
}