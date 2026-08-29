import type { Vehicle, VehicleStats, VehicleStatus } from "../types/vehicle";

/** Tally vehicles by status for the summary pills. */
export function computeVehicleStats(vehicles: Vehicle[]): VehicleStats {
  return vehicles.reduce<VehicleStats>(
    (acc, vehicle) => {
      acc.total += 1;

      if (vehicle.status === "AVAILABLE") acc.available += 1;
      else if (vehicle.status === "IN_USE") acc.inUse += 1;
      else if (vehicle.status === "MAINTENANCE") acc.maintenance += 1;

      return acc;
    },
    { total: 0, available: 0, inUse: 0, maintenance: 0 },
  );
}

/** "IN_USE" -> "In Use" */
export function formatVehicleStatus(status: VehicleStatus | string): string {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "IN_USE":
      return "In Use";
    case "MAINTENANCE":
      return "Maintenance";
    default:
      return status;
  }
}

/** Renders an ISO date string as YYYY-MM-DD, matching the design. */
export function formatVehicleDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
