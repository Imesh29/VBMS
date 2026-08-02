// Fallback local BookingForm to avoid missing module import error.
const BookingForm = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-xl font-semibold mb-4">New Booking</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input type="date" className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        </div>
      </form>
    </div>
  );
};

export default function NewBooking() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <BookingForm />
    </div>
  );
}