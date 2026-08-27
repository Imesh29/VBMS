import { useState } from "react";

import VehicleCard from "./VehicleCard";

import {
  vehicles,
  type Vehicle,
} from "../../data/vehicleData";

export default function BookingForm() {
  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  const [destination, setDestination] =
    useState("");

  const [purpose, setPurpose] =
    useState("");

  const [departureDate, setDepartureDate] =
    useState("");

  const [departureTime, setDepartureTime] =
    useState("08:00");

  const [returnDate, setReturnDate] =
    useState("");

  const [returnTime, setReturnTime] =
    useState("17:00");

  const [passengers, setPassengers] =
    useState(1);

  const [notes, setNotes] =
    useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedVehicle) {
      alert("Please select a vehicle.");
      return;
    }

    if (!destination || !purpose) {
      alert("Please complete the required fields.");
      return;
    }

    console.log({
      selectedVehicle,
      destination,
      purpose,
      departureDate,
      departureTime,
      returnDate,
      returnTime,
      passengers,
      notes,
    });

    alert("Booking request submitted successfully!");
  };

  const handleClear = () => {
    setSelectedVehicle(null);
    setDestination("");
    setPurpose("");
    setDepartureDate("");
    setDepartureTime("08:00");
    setReturnDate("");
    setReturnTime("17:00");
    setPassengers(1);
    setNotes("");
  };

  return (
    <>

      <div className="min-h-full bg-[#F1F3F9] p-6">

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="
            mx-auto
            w-full
            max-w-[760px]
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          {/* Form Header */}
          <div className="border-b border-slate-100 px-6 py-5">

            <h1 className="text-lg font-bold text-slate-900">
              New Vehicle Booking Request
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              All fields marked with * are required.
              Requests are reviewed by the Faculty Dean.
            </p>

          </div>

          {/* Form Body */}
          <div className="space-y-5 p-6">

            {/* Vehicle */}
            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-700">
                SELECT VEHICLE *
              </label>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    selected={
                      selectedVehicle?.id === vehicle.id
                    }
                    onSelect={setSelectedVehicle}
                  />
                ))}

              </div>

            </div>

            {/* Destination + Purpose */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  DESTINATION *
                </label>

                <input
                  type="text"
                  value={destination}
                  onChange={(e) =>
                    setDestination(e.target.value)
                  }
                  placeholder="e.g. Ministry of Education, Putrajaya"
                  required
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-sm
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    focus:border-[#5B1E1D]
                    focus:ring-2
                    focus:ring-[#5B1E1D]/10
                  "
                />

              </div>

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  PURPOSE *
                </label>

                <input
                  type="text"
                  value={purpose}
                  onChange={(e) =>
                    setPurpose(e.target.value)
                  }
                  placeholder="e.g. Annual Conference, Field Study"
                  required
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-sm
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    focus:border-[#5B1E1D]
                    focus:ring-2
                    focus:ring-[#5B1E1D]/10
                  "
                />

              </div>

            </div>

            {/* Departure / Return */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

              {/* Departure date */}
              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  DEP. DATE *
                </label>

                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) =>
                    setDepartureDate(e.target.value)
                  }
                  required
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    text-sm
                    text-slate-600
                    outline-none
                    focus:border-[#5B1E1D]
                  "
                />

              </div>

              {/* Departure time */}
              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  DEP. TIME
                </label>

                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) =>
                    setDepartureTime(e.target.value)
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    text-sm
                    text-slate-600
                    outline-none
                    focus:border-[#5B1E1D]
                  "
                />

              </div>

              {/* Return date */}
              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  RET. DATE *
                </label>

                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) =>
                    setReturnDate(e.target.value)
                  }
                  required
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    text-sm
                    text-slate-600
                    outline-none
                    focus:border-[#5B1E1D]
                  "
                />

              </div>

              {/* Return time */}
              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  RET. TIME
                </label>

                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) =>
                    setReturnTime(e.target.value)
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    text-sm
                    text-slate-600
                    outline-none
                    focus:border-[#5B1E1D]
                  "
                />

              </div>

            </div>

            {/* Passengers */}
            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-700">
                NO. OF PASSENGERS *
              </label>

              <input
                type="number"
                min="1"
                max={
                  selectedVehicle?.seats ?? 50
                }
                value={passengers}
                onChange={(e) =>
                  setPassengers(
                    Number(e.target.value)
                  )
                }
                required
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-[#5B1E1D]
                  focus:ring-2
                  focus:ring-[#5B1E1D]/10
                "
              />

            </div>

            {/* Notes */}
            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-700">
                ADDITIONAL NOTES
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows={3}
                placeholder="Any special requirements, overnight stays, or additional information..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  text-slate-700
                  outline-none
                  placeholder:text-slate-400
                  focus:border-[#5B1E1D]
                  focus:ring-2
                  focus:ring-[#5B1E1D]/10
                "
              />

            </div>

          </div>

          {/* Buttons */}
          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-slate-100
              bg-white
              px-6
              py-4
              sm:flex-row
            "
          >

            <button
              type="button"
              onClick={handleClear}
              className="
                h-11
                flex-1
                rounded-xl
                border
                border-slate-200
                bg-white
                text-sm
                font-semibold
                text-slate-600
                hover:bg-slate-50
              "
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="
                h-11
                flex-1
                rounded-xl
                bg-[#5B1E1D]
                text-sm
                font-semibold
                text-white
                shadow-sm
                hover:bg-[#461616]
              "
            >
              Submit Booking Request
            </button>

          </div>

        </form>

      </div>

    </>
  );
}