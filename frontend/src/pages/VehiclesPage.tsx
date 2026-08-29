import { useState } from "react";

import AppShell from "../components/layout/AppShell";
import VehicleSummaryCards from "../components/vehicles/VehicleSummaryCards";
import VehicleTable from "../components/vehicles/VehicleTable";
import VehicleFormPanel from "../components/vehicles/VehicleFormPanel";

import { useVehicles } from "../hooks/useVehicles";
import type { Vehicle } from "../types/vehicle";

export default function VehiclesPage() {
  const {
    vehicles,
    allVehicles,
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
  } = useVehicles();

  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null);

  function openAdd() {
    setEditTarget(null);
    setPanelOpen(true);
  }

  function openEdit(vehicle: Vehicle) {
    setEditTarget(vehicle);
    setPanelOpen(true);
  }

  return (
    <AppShell
      title="Fleet Management"
      subtitle="View and manage the university vehicle fleet"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3.5 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={refetch}
            className="font-semibold hover:underline shrink-0 ml-4"
          >
            Retry
          </button>
        </div>
      )}

      <VehicleSummaryCards stats={stats} loading={loading} />

      <VehicleTable
        vehicles={vehicles}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        loading={loading}
        error={!loading ? error : null}
        onAddVehicle={openAdd}
        onEditVehicle={openEdit}
        onDeleteVehicle={(vehicle) => removeVehicle(vehicle.id)}
        onStatusChange={changeVehicleStatus}
      />

      <VehicleFormPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        editTarget={editTarget}
        existingPlates={allVehicles.map((v) => v.vehicle_number)}
        onAdd={addVehicle}
        onEdit={editVehicle}
      />
    </AppShell>
  );
}
