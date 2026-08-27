import { FaCheck, FaCar } from "react-icons/fa";

import type { Vehicle } from "../../data/vehicleData";

interface VehicleCardProps {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleCard({
  vehicle,
  selected,
  onSelect,
}: VehicleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(vehicle)}
      className={`
        relative
        w-full
        rounded-2xl
        border
        p-4
        text-left
        transition
        ${
          selected
            ? "border-[#5B1E1D] bg-[#5B1E1D]/5 ring-2 ring-[#5B1E1D]/10"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }
      `}
    >
      {/* Selected */}
      {selected && (
        <span
          className="
            absolute
            right-3
            top-3
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-[#5B1E1D]
            text-white
          "
        >
          <FaCheck size={9} />
        </span>
      )}

      {/* Vehicle icon */}
      <div className="flex items-start gap-3">

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-slate-100
            text-slate-500
          "
        >
          <FaCar size={14} />
        </div>

        <div className="min-w-0">

          <h3 className="text-sm font-semibold text-slate-900">
            {vehicle.name}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {vehicle.type} • {vehicle.seats} seats • {vehicle.registration}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {vehicle.fuel} • Driver: {vehicle.driver}
          </p>

        </div>

      </div>
    </button>
  );
}