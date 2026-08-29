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
    bg: "#EAFBF4",
    text: "#07865D",
    border: "#D1F4E3",
    dot: "#11B981",
  },
  IN_USE: {
    bg: "#EEF5FF",
    text: "#2563EB",
    border: "#DCE9FF",
    dot: "#60A5FA",
  },
  MAINTENANCE: {
    bg: "#FFF8E6",
    text: "#C65A06",
    border: "#FBE9B7",
    dot: "#F5B400",
  },
};

function StatusBadge({ status }: { status: VehicleStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.AVAILABLE;

  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full font-medium"
      style={{
        gap: "7px",
        padding: "6px 12px",
        fontSize: "13px",
        color: s.text,
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      <span
        className="rounded-full"
        style={{ width: "7px", height: "7px", backgroundColor: s.dot }}
      />
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
    <div className="flex flex-col" style={{ gap: "22px" }}>
      {/* Search + filters + add vehicle — sits outside the table card */}
      <div
        className="flex flex-col xl:flex-row xl:items-center"
        style={{ gap: "14px" }}
      >
        <div className="relative min-w-0 flex-1">
          <FaSearch
            className="absolute top-1/2 -translate-y-1/2 text-[#A7B0C0]"
            style={{ left: "18px", width: "17px", height: "17px" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, plate, driver..."
            className="w-full outline-none transition-all"
            style={{
              height: "54px",
              borderRadius: "22px",
              border: "1px solid #E5E8EE",
              backgroundColor: "#FFFFFF",
              padding: "0 18px 0 50px",
              fontSize: "15px",
              color: "#4B5563",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center" style={{ gap: "10px" }}>
          {FILTER_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onStatusFilterChange(tab.key)}
                className="whitespace-nowrap font-semibold transition-colors"
                style={{
                  height: "54px",
                  padding: "0 20px",
                  borderRadius: "22px",
                  fontSize: "14px",
                  border: isActive ? "1px solid #5A1E1E" : "1px solid #E5E8EE",
                  backgroundColor: isActive ? "#5A1E1E" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#667085",
                }}
              >
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={onAddVehicle}
            className="flex shrink-0 items-center justify-center whitespace-nowrap font-bold text-white transition-colors"
            style={{
              height: "54px",
              padding: "0 22px",
              gap: "9px",
              borderRadius: "22px",
              backgroundColor: "#5A1E1E",
              boxShadow: "0 4px 10px rgba(90, 30, 30, 0.14)",
              fontSize: "14px",
            }}
          >
            <FaPlusCircle style={{ width: "16px", height: "16px" }} />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Data table card */}
      <div
        className="overflow-hidden bg-white"
        style={{
          borderRadius: "22px",
          border: "1px solid #E7EAF0",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.035)",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #F0F2F5",
          }}
        >
          <p style={{ fontSize: "13px", color: "#98A2B3" }}>
            <span className="font-bold" style={{ color: "#25283B" }}>
              {vehicles.length}
            </span>{" "}
            vehicle{vehicles.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: "#FBFCFD" }}>
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
                    className="whitespace-nowrap text-left font-semibold uppercase"
                    style={{
                      padding: "15px 24px",
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      color: "#98A2B3",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: "44px 24px",
                      textAlign: "center",
                      color: "#98A2B3",
                      fontSize: "14px",
                    }}
                  >
                    Loading vehicles…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: "44px 24px",
                      textAlign: "center",
                      color: "#EF4444",
                      fontSize: "14px",
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: "44px 24px",
                      textAlign: "center",
                      color: "#98A2B3",
                      fontSize: "14px",
                    }}
                  >
                    No vehicles match your search.
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="transition-colors hover:bg-[#FCFCFD]"
                    style={{ borderTop: "1px solid #F1F3F6" }}
                  >
                    <td style={{ padding: "18px 24px" }}>
                      <div
                        className="flex items-center"
                        style={{ gap: "12px" }}
                      >
                        <div
                          className="flex shrink-0 items-center justify-center rounded-full"
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#F7F1F1",
                          }}
                        >
                          <FaCar
                            style={{
                              width: "15px",
                              height: "15px",
                              color: "#5A1E1E",
                            }}
                          />
                        </div>
                        <span
                          className="whitespace-nowrap font-bold"
                          style={{ fontSize: "14px", color: "#1F2434" }}
                        >
                          {vehicle.vehicle_name}
                        </span>
                      </div>
                    </td>

                    <td
                      className="whitespace-nowrap"
                      style={{
                        padding: "18px 24px",
                        fontSize: "13px",
                        color: "#667085",
                      }}
                    >
                      {vehicle.vehicle_type}
                    </td>

                    <td style={{ padding: "18px 24px" }}>
                      <span
                        className="whitespace-nowrap font-mono font-bold"
                        style={{
                          padding: "4px 9px",
                          borderRadius: "10px",
                          fontSize: "11px",
                          color: "#5A1E1E",
                          backgroundColor: "#FFF1F1",
                        }}
                      >
                        {vehicle.vehicle_number}
                      </span>
                    </td>

                    <td
                      className="whitespace-nowrap"
                      style={{
                        padding: "18px 24px",
                        fontSize: "13px",
                        color: "#667085",
                      }}
                    >
                      {vehicle.capacity} pax
                    </td>

                    <td
                      className="whitespace-nowrap"
                      style={{
                        padding: "18px 24px",
                        fontSize: "13px",
                        color: "#667085",
                      }}
                    >
                      {vehicle.fuel_type}
                    </td>

                    <td
                      className="whitespace-nowrap"
                      style={{
                        padding: "18px 24px",
                        fontSize: "13px",
                        color: "#667085",
                      }}
                    >
                      {vehicle.driver_name}
                    </td>

                    <td
                      className="whitespace-nowrap"
                      style={{
                        padding: "18px 24px",
                        fontSize: "13px",
                        color: "#7C8799",
                      }}
                    >
                      {formatVehicleDate(vehicle.last_service_date)}
                    </td>

                    <td style={{ padding: "18px 24px" }}>
                      <StatusBadge status={vehicle.status} />
                    </td>

                    <td style={{ padding: "18px 24px" }}>
                      <select
                        value={vehicle.status}
                        disabled={updatingId === vehicle.id}
                        onChange={(e) =>
                          handleStatusChange(
                            vehicle,
                            e.target.value as VehicleStatus,
                          )
                        }
                        className="outline-none disabled:opacity-50"
                        style={{
                          minWidth: "132px",
                          height: "38px",
                          padding: "0 12px",
                          borderRadius: "13px",
                          border: "1px solid #E1E5EA",
                          backgroundColor: "#FFFFFF",
                          fontSize: "12px",
                          color: "#536071",
                        }}
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="IN_USE">In Use</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                    </td>

                    <td style={{ padding: "18px 24px" }}>
                      {deleteId === vehicle.id ? (
                        <div
                          className="flex items-center"
                          style={{ gap: "6px" }}
                        >
                          <span style={{ fontSize: "10px", color: "#667085" }}>
                            Delete?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(vehicle)}
                            disabled={deletingId === vehicle.id}
                            className="font-bold text-white disabled:opacity-60"
                            style={{
                              padding: "5px 8px",
                              borderRadius: "8px",
                              backgroundColor: "#DC2626",
                              fontSize: "10px",
                            }}
                          >
                            {deletingId === vehicle.id ? "…" : "Yes"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(null)}
                            className="font-semibold"
                            style={{
                              padding: "5px 8px",
                              borderRadius: "8px",
                              backgroundColor: "#F2F4F7",
                              color: "#667085",
                              fontSize: "10px",
                            }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center"
                          style={{ gap: "8px" }}
                        >
                          <button
                            type="button"
                            onClick={() => onEditVehicle(vehicle)}
                            title="Edit"
                            className="flex items-center justify-center transition-colors"
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "12px",
                              backgroundColor: "#EFF6FF",
                              color: "#2563EB",
                            }}
                          >
                            <FaPen style={{ width: "12px", height: "12px" }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(vehicle.id)}
                            title="Delete"
                            className="flex items-center justify-center transition-colors"
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "12px",
                              backgroundColor: "#FFF1F2",
                              color: "#F04438",
                            }}
                          >
                            <FaTrash
                              style={{ width: "12px", height: "12px" }}
                            />
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
    </div>
  );
}
