type BookingStatus = "Pending" | "Approved" | "Confirmed" | "Completed" | "Cancelled";

interface StatusFiltersProps {
  activeFilter: "All" | BookingStatus;
  onFilterChange: (
    filter: "All" | BookingStatus
  ) => void;
}

const filters: ("All" | BookingStatus)[] = [
  "All",
  "Pending",
  "Approved",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export default function StatusFilters({
  activeFilter,
  onFilterChange,
}: StatusFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => {
        const active = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`
              whitespace-nowrap
              rounded-full
              px-5
              py-3
              text-sm
              font-medium
              transition-all
              duration-200
              ${
                active
                  ? "bg-[#5B1E1D] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-[#5B1E1D] hover:text-[#5B1E1D]"
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}