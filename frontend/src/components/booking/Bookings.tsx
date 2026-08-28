import { useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";

import BookingToolbar from "./BookingToolbar";
import BookingTable from "./BookingTable";

import {
  bookings,
  type BookingStatus,
} from "../../data/bookingData";

export default function Bookings() {
  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<"All" | BookingStatus>("All");

  const filteredBookings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      // Status filter
      const matchesFilter =
        activeFilter === "All" ||
        booking.status === activeFilter;

      // Search filter
      const matchesSearch =
        searchText === "" ||
        booking.id.toLowerCase().includes(searchText) ||
        booking.vehicle.toLowerCase().includes(searchText) ||
        booking.destination.toLowerCase().includes(searchText) ||
        booking.purpose.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  return (
    <MainLayout>
      <div className="min-h-full bg-[#F1F3F9] p-6">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Bookings
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage and track all booking requests
          </p>
        </div>

        {/* Toolbar */}
        <BookingToolbar
          search={search}
          setSearch={setSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Table Card */}
        <section
          className="
            mt-5
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          {/* Count */}
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-800">
                {filteredBookings.length}
              </span>{" "}
              bookings found
            </p>
          </div>

          {/* Table */}
          <BookingTable bookings={filteredBookings} />
        </section>
        //HAs
      </div>
    </MainLayout>
  );
}