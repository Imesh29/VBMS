import { useState } from "react";
import {
  FaCarSide,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaBuilding,
} from "react-icons/fa";

const VEHICLES = [
  {
    value: "Toyota Prius",
    name: "Toyota Prius",
    meta: "Sedan • 4 seats",
  },
  {
    value: "Toyota Hiace",
    name: "Toyota Hiace",
    meta: "Van • 12 seats",
  },
  {
    value: "Nissan Caravan",
    name: "Nissan Caravan",
    meta: "Van • 10 seats",
  },
  {
    value: "Honda Vezel",
    name: "Honda Vezel",
    meta: "SUV • 5 seats",
  },
];

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
};

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
    >,
  ) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVehicleSelect = (vehicle: string) => {
    setFormData((current) => ({
      ...current,
      vehicle,
    }));
  };

  const handleClear = () => {
    setFormData({
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);
    alert("Booking submitted successfully!");
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "34px 28px 56px",
        boxSizing: "border-box",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "980px",
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
            padding: "28px 32px 24px",
            borderBottom: "1px solid #EEF0F4",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              lineHeight: 1.2,
              fontWeight: 700,
              color: "#111426",
            }}
          >
            New Vehicle Booking Request
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#98A2B3",
            }}
          >
            All fields marked with * are required. Requests are reviewed by the
            Faculty Dean.
          </p>
        </div>

        {/* Form body */}
        <div
          style={{
            padding: "30px 32px 32px",
          }}
        >
          {/* Vehicle selection */}
          <div style={{ marginBottom: "30px" }}>
            <label style={labelStyle}>
              Select Vehicle <span style={{ color: "#EF4444" }}>*</span>
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "16px",
              }}
            >
              {VEHICLES.map((vehicle) => {
                const selected = formData.vehicle === vehicle.value;

                return (
                  <button
                    key={vehicle.value}
                    type="button"
                    onClick={() => handleVehicleSelect(vehicle.value)}
                    style={{
                      minHeight: "108px",
                      padding: "18px",
                      borderRadius: "20px",
                      border: selected
                        ? "1.5px solid #5B1E1D"
                        : "1px solid #E6E9EF",
                      backgroundColor: selected ? "#FCF7F7" : "#FAFBFC",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      textAlign: "left",
                      cursor: "pointer",
                      boxShadow: selected
                        ? "0 3px 10px rgba(91,30,29,0.08)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: selected ? "#5B1E1D" : "#EEF2F6",
                        color: selected ? "#FFFFFF" : "#758094",
                      }}
                    >
                      <FaCarSide style={{ width: "16px", height: "16px" }} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#171A2B",
                        }}
                      >
                        {vehicle.name}
                      </p>

                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: "12px",
                          color: "#8F98AA",
                        }}
                      >
                        {vehicle.meta}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Requester + department */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Requester <span style={{ color: "#EF4444" }}>*</span>
              </label>

              <div style={{ position: "relative" }}>
                <FaUser
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "14px",
                    height: "14px",
                    color: "#A3ABBA",
                  }}
                />

                <input
                  type="text"
                  name="requester"
                  value={formData.requester}
                  onChange={handleChange}
                  placeholder="Requester name"
                  required
                  style={{
                    ...inputStyle,
                    paddingLeft: "44px",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Department <span style={{ color: "#EF4444" }}>*</span>
              </label>

              <div style={{ position: "relative" }}>
                <FaBuilding
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "14px",
                    height: "14px",
                    color: "#A3ABBA",
                  }}
                />

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Department"
                  required
                  style={{
                    ...inputStyle,
                    paddingLeft: "44px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Destination + driver */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Destination <span style={{ color: "#EF4444" }}>*</span>
              </label>

              <div style={{ position: "relative" }}>
                <FaMapMarkerAlt
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "14px",
                    height: "14px",
                    color: "#A3ABBA",
                  }}
                />

                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Ministry of Education, Putrajaya"
                  required
                  style={{
                    ...inputStyle,
                    paddingLeft: "44px",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Driver <span style={{ color: "#EF4444" }}>*</span>
              </label>

              <select
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select driver</option>
                <option>Driver A</option>
                <option>Driver B</option>
                <option>Driver C</option>
              </select>
            </div>
          </div>

          {/* Date + time */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Booking Date <span style={{ color: "#EF4444" }}>*</span>
              </label>

              <div style={{ position: "relative" }}>
                <FaCalendarAlt
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "14px",
                    height: "14px",
                    color: "#A3ABBA",
                  }}
                />

                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                  style={{
                    ...inputStyle,
                    paddingLeft: "44px",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Start Time <span style={{ color: "#EF4444" }}>*</span>
              </label>

              <div style={{ position: "relative" }}>
                <FaClock
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "14px",
                    height: "14px",
                    color: "#A3ABBA",
                  }}
                />

                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  style={{
                    ...inputStyle,
                    paddingLeft: "44px",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                End Time <span style={{ color: "#EF4444" }}>*</span>
              </label>

              <div style={{ position: "relative" }}>
                <FaClock
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "14px",
                    height: "14px",
                    color: "#A3ABBA",
                  }}
                />

                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  style={{
                    ...inputStyle,
                    paddingLeft: "44px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label style={labelStyle}>
              Purpose <span style={{ color: "#EF4444" }}>*</span>
            </label>

            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g. Annual Conference, Field Study"
              required
              style={{
                width: "100%",
                minHeight: "132px",
                resize: "none",
                borderRadius: "20px",
                border: "1px solid #E1E5EB",
                backgroundColor: "#FAFBFC",
                padding: "16px",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#303647",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "16px",
            padding: "18px 32px 22px",
            borderTop: "1px solid #EEF0F4",
            backgroundColor: "#FCFCFD",
          }}
        >
          <button
            type="button"
            onClick={handleClear}
            style={{
              height: "48px",
              borderRadius: "18px",
              border: "1px solid #E0E4EA",
              backgroundColor: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              color: "#566174",
              cursor: "pointer",
            }}
          >
            Clear Form
          </button>

          <button
            type="submit"
            style={{
              height: "48px",
              borderRadius: "18px",
              border: "none",
              backgroundColor: "#5B1E1D",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 5px 14px rgba(91,30,29,0.16)",
            }}
          >
            Submit Booking Request
          </button>
        </div>
      </form>
    </div>
  );
}
