import { useState } from "react";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    requester: "",
    department: "",
    vehicle: "",
    driver: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    destination: "",
    purpose: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    alert("Booking submitted successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold mb-6">
        New Vehicle Booking
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Requester */}
        <div>
          <label className="block mb-2 font-medium">
            Requester
          </label>

          <input
            type="text"
            name="requester"
            value={formData.requester}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block mb-2 font-medium">
            Department
          </label>

          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Vehicle */}
        <div>
          <label className="block mb-2 font-medium">
            Vehicle
          </label>

          <select
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">Select Vehicle</option>
            <option>Toyota Prius</option>
            <option>Toyota Hiace</option>
            <option>Nissan Caravan</option>
            <option>Honda Vezel</option>
          </select>
        </div>

        {/* Driver */}
        <div>
          <label className="block mb-2 font-medium">
            Driver
          </label>

          <select
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">Select Driver</option>
            <option>Driver A</option>
            <option>Driver B</option>
            <option>Driver C</option>
          </select>
        </div>

        {/* Booking Date */}
        <div>
          <label className="block mb-2 font-medium">
            Booking Date
          </label>

          <input
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block mb-2 font-medium">
            Start Time
          </label>

          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block mb-2 font-medium">
            End Time
          </label>

          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block mb-2 font-medium">
            Destination
          </label>

          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

      </div>

      {/* Purpose */}
      <div className="mt-6">
        <label className="block mb-2 font-medium">
          Purpose
        </label>

        <textarea
          name="purpose"
          rows={4}
          value={formData.purpose}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-8">

        <button
          type="reset"
          className="px-6 py-3 rounded-lg border"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-[#5B1E1D] text-white hover:bg-[#491716]"
        >
          Submit Booking
        </button>

      </div>

    </form>
  );
}