import { useCallback, useEffect, useMemo, useState } from "react";

import * as vehicleApi from "../api/vehicleApi";
import type { Vehicle, VehiclePayload, VehicleStatus } from "../types/vehicle";
import { computeVehicleStats } from "../utils/vehicle";

export type VehicleStatusFilter =
  | "ALL"
  | "AVAILABLE"
  | "IN_USE"
  | "MAINTENANCE";

/**
 * Loads the full fleet (Admin only) once, then exposes fast
 * client-side search + status filtering on top of it.
 */
export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatusFilter>("ALL");
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await vehicleApi.getVehicles({
          limit: 1000,
          sort: "vehicle_name",
          order: "ASC",
        });

        if (!cancelled) setVehicles(result.items);
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Failed to load vehicles. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const stats = useMemo(() => computeVehicleStats(vehicles), [vehicles]);

  const addVehicle = useCallback(async (payload: VehiclePayload) => {
    const created = await vehicleApi.createVehicle(payload);
    setVehicles((prev) => [created, ...prev]);
    return created;
  }, []);

  const editVehicle = useCallback(
    async (id: string, payload: VehiclePayload) => {
      const updated = await vehicleApi.updateVehicle(id, payload);
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      return updated;
    },
    [],
  );

  const removeVehicle = useCallback(async (id: string) => {
    await vehicleApi.deleteVehicle(id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const changeVehicleStatus = useCallback(
    async (vehicle: Vehicle, status: VehicleStatus) => {
      const previous = vehicle.status;
      // Optimistic update — the status dropdown should feel instant.
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? { ...v, status } : v)),
      );

      try {
        const updated = await vehicleApi.updateVehicle(vehicle.id, {
          vehicleNumber: vehicle.vehicle_number,
          vehicleName: vehicle.vehicle_name,
          vehicleType: vehicle.vehicle_type,
          capacity: vehicle.capacity,
          fuelType: vehicle.fuel_type,
          driverName: vehicle.driver_name,
          lastServiceDate: vehicle.last_service_date,
          status,
        });
        setVehicles((prev) =>
          prev.map((v) => (v.id === vehicle.id ? updated : v)),
        );
      } catch (err) {
        // Roll back on failure.
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === vehicle.id ? { ...v, status: previous } : v,
          ),
        );
        throw err;
      }
    },
    [],
  );

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesStatus =
        statusFilter === "ALL" || vehicle.status === statusFilter;

      const matchesSearch =
        !query ||
        vehicle.vehicle_name.toLowerCase().includes(query) ||
        vehicle.vehicle_number.toLowerCase().includes(query) ||
        vehicle.vehicle_type.toLowerCase().includes(query) ||
        vehicle.driver_name.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [vehicles, search, statusFilter]);

  return {
    vehicles: filteredVehicles,
    allVehicles: vehicles,
    stats,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    refetch,
    addVehicle,
    editVehicle,
    removeVehicle,
    changeVehicleStatus,
  };
}
