import { useState } from "react";
import { FaSearch, FaCar, FaPlusCircle, FaPen, FaTrash } from "react-icons/fa";

import type { Vehicle, VehicleStatus } from "../../types/vehicle";
import type { VehicleStatusFilter } from "../../hooks/useVehicles";
import { formatVehicleDate, formatVehicleStatus } from "../../utils/vehicle";

const STATUS_STYLES: Record<
  VehicleStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  AVAILABLE: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  IN_USE: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
  MAINTENANCE: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
};

function StatusBadge({ status }: { status: VehicleStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.AVAILABLE;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {formatVehicleStatus(status)}
    </span>
  );
}

const FILTER_TABS: { key: VehicleStatusFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "AVAILABLE", label: "Available" },
  { key: "IN_USE", label: "In Use" },
  { key: "MAINTENANCE", label: "Maintenance" },
];

interface VehicleTableProps {
  vehicles: Vehicle[];
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: VehicleStatusFilter;
  onStatusFilterChange: (value: VehicleStatusFilter) => void;
  loading?: boolean;
  error?: string | null;
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicle: Vehicle) => Promise<unknown>;
  onStatusChange: (vehicle: Vehicle, status: VehicleStatus) => Promise<unknown>;
}

export default function VehicleTable({
  vehicles,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  loading,
  error,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onStatusChange,
}: VehicleTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleConfirmDelete(vehicle: Vehicle) {
    setDeletingId(vehicle.id);
    try {
      await onDeleteVehicle(vehicle);
    } finally {
      setDeletingId(null);
      setDeleteId(null);
    }
  }

  async function handleStatusChange(vehicle: Vehicle, status: VehicleStatus) {
    setUpdatingId(vehicle.id);
    try {
      await onStatusChange(vehicle, status);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      {/* Search + filters + Add */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 border-b border-gray-50">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, plate, driver..."
            className="w-full bg-gray-50 border border-transparent focus:border-[#4C1D1D]/20 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onStatusFilterChange(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#4C1D1D] text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={onAddVehicle}
          className="flex items-center gap-2 px-4 py-3 bg-[#4C1D1D] text-white rounded-xl text-sm font-bold hover:bg-[#3A1515] transition-colors shadow-sm shadow-[#4C1D1D]/20 whitespace-nowrap shrink-0"
        >
          <FaPlusCircle className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      <div className="px-6 py-3 border-b border-gray-50">
        <p className="text-xs text-gray-400">
          <span className="font-bold text-[#1C1C2E]">{vehicles.length}</span>{" "}
          vehicle{vehicles.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60">
              {[
                "Vehicle",
                "Type",
                "Plate No.",
                "Capacity",
                "Fuel",
                "Driver",
                "Last Service",
                "Status",
                "Update",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-10 text-center text-sm text-gray-400"
                >
                  Loading vehicles…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-10 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-10 text-center text-sm text-gray-400"
                >
                  No vehicles match your search.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="hover:bg-gray-50/40 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#4C1D1D]/[0.07] rounded-lg flex items-center justify-center shrink-0">
                        <FaCar className="w-3.5 h-3.5 text-[#4C1D1D]" />
                      </div>
                      <span className="text-sm font-bold text-[#1C1C2E] whitespace-nowrap">
                        {vehicle.vehicle_name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {vehicle.vehicle_type}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-bold text-[#4C1D1D] bg-red-50 px-2 py-0.5 rounded-lg whitespace-nowrap">
                      {vehicle.vehicle_number}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {vehicle.capacity} pax
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {vehicle.fuel_type}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {vehicle.driver_name}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatVehicleDate(vehicle.last_service_date)}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={vehicle.status} />
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={vehicle.status}
                      disabled={updatingId === vehicle.id}
                      onChange={(e) =>
                        handleStatusChange(
                          vehicle,
                          e.target.value as VehicleStatus,
                        )
                      }
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#4C1D1D]/15 text-gray-700 disabled:opacity-50"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="IN_USE">In Use</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </td>

                  <td className="px-5 py-4">
                    {deleteId === vehicle.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 mr-0.5">
                          Delete?
                        </span>
                        <button
                          onClick={() => handleConfirmDelete(vehicle)}
                          disabled={deletingId === vehicle.id}
                          className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                        >
                          {deletingId === vehicle.id ? "…" : "Yes"}
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEditVehicle(vehicle)}
                          className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FaPen className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteId(vehicle.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
