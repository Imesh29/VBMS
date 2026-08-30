import { FaSearch } from "react-icons/fa";
import StatusFilters from "./StatusFilters";
import type { BookingStatus } from "../../data/bookingData";

interface BookingToolbarProps {
  search: string;
  setSearch: (value: string) => void;

  activeFilter: "All" | BookingStatus;

  onFilterChange: (
    filter: "All" | BookingStatus
  ) => void;
}

export default function BookingToolbar({
  search,
  setSearch,
  activeFilter,
  onFilterChange,
}: BookingToolbarProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
      
      {/* Search */}
      <div className="relative flex-1">
        <FaSearch
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
          size={15}
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search booking, name, destination..."
          className="
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-white
            py-3.5
            pl-11
            pr-4
            text-sm
            text-slate-700
            outline-none
            transition
            focus:border-[#5B1E1D]
            focus:ring-2
            focus:ring-[#5B1E1D]/10
          "
        />
      </div>

      {/* Filters */}
      <StatusFilters
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}