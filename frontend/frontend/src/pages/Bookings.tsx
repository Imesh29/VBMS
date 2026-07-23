function BookingTable() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-gray-500">Booking table component not found.</p>
    </div>
  );
}

export default function Bookings() {
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="p-8">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Vehicle Bookings
            </h1>

            <p className="text-gray-500">
              Manage all vehicle booking requests
            </p>
          </div>

          <button className="bg-[#5B1E1D] text-white px-6 py-3 rounded-xl hover:bg-[#4A1817]">
            + New Booking
          </button>

        </div>

        <BookingTable />

      </div>

    </div>
  );
}