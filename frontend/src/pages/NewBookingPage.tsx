import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCar, FaCheck, FaExclamationCircle } from "react-icons/fa";

import AppShell from "../components/layout/AppShell";
import { getAvailableVehicles } from "../api/vehicleApi";
import { createBooking, getBooking, updateBooking } from "../api/bookingApi";
import type { Vehicle } from "../types/vehicle";

const initialForm = {
  destination: "",
  purpose: "",
  departureDate: "",
  departureTime: "08:00",
  returnDate: "",
  returnTime: "17:00",
  passengerCount: "1",
  remarks: "",
};

export default function NewBookingPage() {
  const navigate = useNavigate();
  const { id: bookingId } = useParams<{ id: string }>();
  const isEditMode = Boolean(bookingId);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      setLoadingVehicles(true);
      setError("");

      try {
        const availableVehicles = await getAvailableVehicles();

        if (!active) return;

        setVehicles(availableVehicles);

        if (bookingId) {
          const booking = await getBooking(bookingId);

          if (!active) return;

          if (booking.status !== "PENDING") {
            setError("Only pending booking requests can be updated.");
            return;
          }

          // Keep the currently selected vehicle visible even if its fleet
          // availability changed after the original request was submitted.
          if (
            booking.vehicle_id &&
            !availableVehicles.some((vehicle) => vehicle.id === booking.vehicle_id)
          ) {
            setVehicles((current) => [
              {
                id: booking.vehicle_id as string,
                vehicle_number: booking.vehicle_number || "—",
                vehicle_name: booking.vehicle_name || "Current vehicle",
                vehicle_type: booking.vehicle_type || "Vehicle",
                capacity: Number(booking.capacity || booking.passenger_count || 1),
                fuel_type: booking.fuel_type || "—",
                driver_name: booking.driver_name || null,
                status: booking.vehicle_status || "UNAVAILABLE",
              } as Vehicle,
              ...current,
            ]);
          }

          const departure = splitDateTime(booking.departure_date);
          const returning = splitDateTime(booking.return_date);

          setVehicleId(booking.vehicle_id || "");
          setForm({
            destination: booking.destination || "",
            purpose: booking.purpose || "",
            departureDate: departure.date,
            departureTime: departure.time,
            returnDate: returning.date,
            returnTime: returning.time,
            passengerCount: String(booking.passenger_count || 1),
            remarks: booking.remarks || "",
          });
        }
      } catch (err: any) {
        if (!active) return;
        setError(
          err?.response?.data?.message ||
            (isEditMode
              ? "Unable to load this booking request."
              : "Unable to load available vehicles."),
        );
      } finally {
        if (active) setLoadingVehicles(false);
      }
    };

    void loadPage();

    return () => {
      active = false;
    };
  }, [bookingId, isEditMode]);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === vehicleId),
    [vehicles, vehicleId],
  );

  const valid = Boolean(
    vehicleId &&
    form.destination.trim() &&
    form.purpose.trim() &&
    form.departureDate &&
    form.departureTime &&
    form.returnDate &&
    form.returnTime &&
    Number(form.passengerCount) >= 1,
  );

  const setField = (name: keyof typeof form, value: string) => {
    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  };

  const resetForm = () => {
    if (isEditMode) {
      navigate("/bookings");
      return;
    }

    setVehicleId("");
    setForm(initialForm);
    setError("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!valid) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      selectedVehicle &&
      Number(form.passengerCount) > Number(selectedVehicle.capacity)
    ) {
      setError(
        `Passenger count exceeds ${selectedVehicle.vehicle_name}'s capacity of ${selectedVehicle.capacity}.`,
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        vehicleId,
        destination: form.destination.trim(),
        purpose: form.purpose.trim(),
        departureDate: `${form.departureDate}T${form.departureTime}:00`,
        returnDate: `${form.returnDate}T${form.returnTime}:00`,
        passengerCount: Number(form.passengerCount),
        remarks: form.remarks.trim() || undefined,
      };

      if (isEditMode && bookingId) {
        await updateBooking(bookingId, payload);
      } else {
        await createBooking(payload);
      }

      navigate("/bookings", {
        replace: true,
        state: {
          success: isEditMode
            ? "Pending booking request updated successfully."
            : "Booking request submitted successfully.",
        },
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.msg ||
          "Unable to submit booking request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell
      title={isEditMode ? "Edit Booking" : "New Booking"}
      subtitle={
        isEditMode
          ? "Update your pending request before Dean approval"
          : "Submit a vehicle booking request for Dean approval"
      }
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "28px 24px 48px",
          boxSizing: "border-box",
        }}
      >
        <form
          onSubmit={submit}
          style={{
            width: "100%",
            maxWidth: "900px",
            overflow: "hidden",
            borderRadius: "24px",
            border: "1px solid #E6E9EF",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 6px 22px rgba(15, 23, 42, 0.06)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "28px 30px 24px",
              borderBottom: "1px solid #EEF0F4",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                lineHeight: 1.25,
                fontWeight: 700,
                color: "#111426",
              }}
            >
              {isEditMode ? "Edit Pending Booking Request" : "New Vehicle Booking Request"}
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#98A2B3",
              }}
            >
              {isEditMode
                ? "You can update this request while it is still pending. Once the Dean approves it, editing is disabled."
                : "All fields marked with * are required. Requests are reviewed by the Faculty Dean."}
            </p>
          </div>

          {/* Body */}
          <div
            style={{
              padding: "28px 30px 30px",
            }}
          >
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  marginBottom: "22px",
                  borderRadius: "16px",
                  border: "1px solid #FECACA",
                  backgroundColor: "#FEF2F2",
                  padding: "12px 14px",
                  fontSize: "13px",
                  color: "#DC2626",
                }}
              >
                <FaExclamationCircle />
                {error}
              </div>
            )}

            {/* Vehicle selection */}
            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>
                Select Vehicle <span style={{ color: "#EF4444" }}>*</span>
              </label>

              {loadingVehicles ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#98A2B3",
                  }}
                >
                  Loading available vehicles...
                </p>
              ) : vehicles.length === 0 ? (
                <div
                  style={{
                    borderRadius: "16px",
                    backgroundColor: "#F8FAFC",
                    padding: "16px",
                    fontSize: "13px",
                    color: "#667085",
                  }}
                >
                  No vehicles are currently available.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "14px",
                  }}
                >
                  {vehicles.map((vehicle) => {
                    const selected = vehicleId === vehicle.id;

                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => setVehicleId(vehicle.id)}
                        style={{
                          position: "relative",
                          minHeight: "118px",
                          width: "100%",
                          borderRadius: "20px",
                          border: selected
                            ? "1.5px solid #5B1E1D"
                            : "1px solid #E5E8EE",
                          backgroundColor: selected ? "#FCF7F7" : "#FAFBFC",
                          padding: "18px",
                          textAlign: "left",
                          cursor: "pointer",
                          boxShadow: selected
                            ? "0 3px 10px rgba(91, 30, 29, 0.08)"
                            : "none",
                        }}
                      >
                        {selected && (
                          <span
                            style={{
                              position: "absolute",
                              top: "14px",
                              right: "14px",
                              display: "flex",
                              width: "24px",
                              height: "24px",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              backgroundColor: "#5B1E1D",
                              color: "#FFFFFF",
                            }}
                          >
                            <FaCheck size={10} />
                          </span>
                        )}

                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "13px",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              width: "42px",
                              height: "42px",
                              flexShrink: 0,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              backgroundColor: selected ? "#F3E9E9" : "#EEF2F6",
                              color: selected ? "#5B1E1D" : "#758094",
                            }}
                          >
                            <FaCar size={14} />
                          </span>

                          <div
                            style={{
                              minWidth: 0,
                              paddingRight: selected ? "26px" : 0,
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                fontSize: "15px",
                                fontWeight: 700,
                                color: "#171A2B",
                              }}
                            >
                              {vehicle.vehicle_name}
                            </p>

                            <p style={vehicleMetaStyle}>
                              {vehicle.vehicle_type} • {vehicle.capacity} seats
                              {" • "}
                              {vehicle.vehicle_number}
                            </p>

                            <p style={vehicleMetaStyle}>
                              {vehicle.fuel_type} • Driver:{" "}
                              {vehicle.driver_name || "Not assigned"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Destination + Purpose */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <Field label="Destination *">
                <input
                  value={form.destination}
                  onChange={(event) =>
                    setField("destination", event.target.value)
                  }
                  placeholder="e.g. Ministry of Education, Putrajaya"
                  style={inputStyle}
                />
              </Field>

              <Field label="Purpose *">
                <input
                  value={form.purpose}
                  onChange={(event) => setField("purpose", event.target.value)}
                  placeholder="e.g. Annual Conference, Field Study"
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* Departure / Return */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <Field label="Dep. Date *">
                <input
                  type="date"
                  value={form.departureDate}
                  onChange={(event) =>
                    setField("departureDate", event.target.value)
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Dep. Time *">
                <input
                  type="time"
                  value={form.departureTime}
                  onChange={(event) =>
                    setField("departureTime", event.target.value)
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Ret. Date *">
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={(event) =>
                    setField("returnDate", event.target.value)
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Ret. Time *">
                <input
                  type="time"
                  value={form.returnTime}
                  onChange={(event) =>
                    setField("returnTime", event.target.value)
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* Passengers */}
            <div style={{ marginBottom: "20px" }}>
              <Field label="No. of Passengers *">
                <input
                  type="number"
                  min="1"
                  max={selectedVehicle?.capacity}
                  value={form.passengerCount}
                  onChange={(event) =>
                    setField("passengerCount", event.target.value)
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* Notes */}
            <Field label="Additional Notes">
              <textarea
                rows={4}
                value={form.remarks}
                onChange={(event) => setField("remarks", event.target.value)}
                placeholder="Any special requirements, overnight stays, or additional information..."
                style={{
                  width: "100%",
                  minHeight: "122px",
                  resize: "vertical",
                  borderRadius: "18px",
                  border: "1px solid #E1E5EB",
                  backgroundColor: "#FAFBFC",
                  padding: "15px 16px",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#303647",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </Field>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
              padding: "18px 30px 22px",
              borderTop: "1px solid #EEF0F4",
              backgroundColor: "#FCFCFD",
            }}
          >
            <button
              type="button"
              onClick={resetForm}
              style={{
                height: "48px",
                borderRadius: "18px",
                border: "1px solid #E0E4EA",
                backgroundColor: "#FFFFFF",
                color: "#566174",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isEditMode ? "Cancel Editing" : "Clear Form"}
            </button>

            <button
              type="submit"
              disabled={!valid || submitting}
              style={{
                height: "48px",
                borderRadius: "18px",
                border: "none",
                backgroundColor: !valid || submitting ? "#D6BFC0" : "#5B1E1D",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 700,
                cursor: !valid || submitting ? "not-allowed" : "pointer",
                boxShadow:
                  !valid || submitting
                    ? "none"
                    : "0 5px 14px rgba(91,30,29,0.16)",
              }}
            >
              {submitting
                ? isEditMode
                  ? "Updating..."
                  : "Submitting..."
                : isEditMode
                  ? "Update Booking Request"
                  : "Submit Booking Request"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function splitDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    const [datePart = "", timePart = ""] = value.split("T");
    return { date: datePart, time: timePart.slice(0, 5) };
  }

  const pad = (part: number) => String(part).padStart(2, "0");

  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.025em",
  color: "#566174",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "52px",
  borderRadius: "18px",
  border: "1px solid #E1E5EB",
  backgroundColor: "#FAFBFC",
  padding: "0 16px",
  fontSize: "14px",
  color: "#303647",
  outline: "none",
  boxSizing: "border-box",
};

const vehicleMetaStyle: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: "12px",
  lineHeight: 1.45,
  color: "#8F98AA",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}
