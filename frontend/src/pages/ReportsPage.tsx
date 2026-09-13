import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  FaCalendarCheck,
  FaCar,
  FaChartLine,
  FaCheck,
  FaDownload,
  FaFilter,
  FaUsers,
} from "react-icons/fa";

import AppShell from "../components/layout/AppShell";
import * as reportApi from "../api/reportApi";

import type {
  BookingReportPreview,
  MonthlyActivityPreview,
  UserActivityPreview,
  VehicleReportPreview,
} from "../api/reportApi";

type ReportType =
  | "booking-summary"
  | "fleet-status"
  | "monthly-activity"
  | "user-activity";

type BookingStatusFilter =
  | "all"
  | "PENDING"
  | "APPROVED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

interface ReportDef {
  id: ReportType;
  title: string;
  description: string;
  icon: ReactNode;
  accent: string;
  soft: string;
}

const REPORT_DEFS: ReportDef[] = [
  {
    id: "booking-summary",
    title: "Booking Summary Report",
    description:
      "Full list of all bookings with status, requester, vehicle, destination, and dates.",
    icon: <FaCalendarCheck />,
    accent: "#2563EB",
    soft: "#EFF6FF",
  },
  {
    id: "fleet-status",
    title: "Fleet Status Report",
    description:
      "Current status of all university vehicles including driver, fuel type, and last service date.",
    icon: <FaCar />,
    accent: "#059669",
    soft: "#ECFDF5",
  },
  {
    id: "monthly-activity",
    title: "Monthly Activity Report",
    description:
      "Month-by-month booking counts broken down by completed, cancelled, and pending statuses.",
    icon: <FaChartLine />,
    accent: "#9333EA",
    soft: "#FAF5FF",
  },
  {
    id: "user-activity",
    title: "User Activity Report",
    description:
      "Booking counts and account status for all registered users in the system.",
    icon: <FaUsers />,
    accent: "#EA580C",
    soft: "#FFF7ED",
  },
];

const STATUS_TABS: { key: BookingStatusFilter; label: string }[] = [
  { key: "all", label: "All Statuses" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

const asNumber = (value: unknown) => Number(value || 0);

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-CA");
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.toLocaleDateString("en-CA")} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const prettyRole = (role: string) =>
  role === "USER" ? "Staff" : role.charAt(0) + role.slice(1).toLowerCase();

function KpiPill({ value, label }: { value: number; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        minHeight: "38px",
        padding: "0 14px",
        borderRadius: "999px",
        backgroundColor: "#F6F7F9",
        color: "#667085",
        fontSize: "12px",
        whiteSpace: "nowrap",
      }}
    >
      <strong style={{ fontSize: "14px", color: "#171A2B" }}>{value}</strong>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { bg: string; color: string; border: string; dot: string }
  > = {
    PENDING: {
      bg: "#FFFBEB",
      color: "#B45309",
      border: "#FDE68A",
      dot: "#F59E0B",
    },
    APPROVED: {
      bg: "#EFF6FF",
      color: "#1D4ED8",
      border: "#BFDBFE",
      dot: "#60A5FA",
    },
    CONFIRMED: {
      bg: "#ECFDF5",
      color: "#047857",
      border: "#A7F3D0",
      dot: "#10B981",
    },
    COMPLETED: {
      bg: "#F8FAFC",
      color: "#475467",
      border: "#E2E8F0",
      dot: "#94A3B8",
    },
    CANCELLED: {
      bg: "#FFF1F2",
      color: "#DC2626",
      border: "#FECDD3",
      dot: "#FB7185",
    },
    AVAILABLE: {
      bg: "#ECFDF5",
      color: "#047857",
      border: "#A7F3D0",
      dot: "#10B981",
    },
    IN_USE: {
      bg: "#EFF6FF",
      color: "#1D4ED8",
      border: "#BFDBFE",
      dot: "#60A5FA",
    },
    MAINTENANCE: {
      bg: "#FFFBEB",
      color: "#B45309",
      border: "#FDE68A",
      dot: "#F59E0B",
    },
  };
  const s = map[status] ?? map.COMPLETED;
  const label = status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        minHeight: "30px",
        padding: "0 11px",
        borderRadius: "999px",
        border: `1px solid ${s.border}`,
        backgroundColor: s.bg,
        color: s.color,
        fontSize: "12px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: s.dot,
        }}
      />
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "56px 24px",
        textAlign: "center",
        color: "#98A2B3",
        fontSize: 14,
      }}
    >
      No records are available for this report.
    </div>
  );
}

export default function ReportsPage() {
  const [selected, setSelected] = useState<ReportType>("booking-summary");
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("all");

  const [bookingData, setBookingData] = useState<BookingReportPreview | null>(
    null,
  );
  const [fleetData, setFleetData] = useState<VehicleReportPreview | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyActivityPreview | null>(
    null,
  );
  const [userData, setUserData] = useState<UserActivityPreview | null>(null);

  const [loading, setLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      setLoading(true);
      setPreviewError(null);

      try {
        if (selected === "booking-summary") {
          const data = await reportApi.getBookingReportPreview({
            status: statusFilter === "all" ? undefined : statusFilter,
          });
          if (!cancelled) setBookingData(data);
        } else if (selected === "fleet-status") {
          const data = await reportApi.getVehicleReportPreview();
          if (!cancelled) setFleetData(data);
        } else if (selected === "monthly-activity") {
          const data = await reportApi.getMonthlyActivityPreview();
          if (!cancelled) setMonthlyData(data);
        } else {
          const data = await reportApi.getUserActivityPreview();
          if (!cancelled) setUserData(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setPreviewError(
            err?.response?.data?.message ||
              "Could not load report preview. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadPreview();
    return () => {
      cancelled = true;
    };
  }, [selected, statusFilter]);

  const selectedDef = REPORT_DEFS.find((def) => def.id === selected)!;

  const maxUserBookings = useMemo(() => {
    if (!userData?.rows.length) return 1;
    return Math.max(
      1,
      ...userData.rows.map((row) => asNumber(row.bookings_count)),
    );
  }, [userData]);

  const maxMonthlyCompleted = useMemo(() => {
    if (!monthlyData?.rows.length) return 1;
    return Math.max(
      1,
      ...monthlyData.rows.map((row) => asNumber(row.completed)),
    );
  }, [monthlyData]);

  const handleDownload = async () => {
    setGenerating(true);
    setDownloadError(null);

    try {
      if (selected === "booking-summary") {
        await reportApi.downloadBookingReport({
          status: statusFilter === "all" ? undefined : statusFilter,
        });
      } else if (selected === "fleet-status") {
        await reportApi.downloadVehicleReport();
      } else if (selected === "monthly-activity") {
        await reportApi.downloadMonthlyActivityReport();
      } else {
        await reportApi.downloadUserActivityReport();
      }

      setLastGenerated(`${selectedDef.title} downloaded`);
    } catch (err: any) {
      setDownloadError(
        err?.response?.data?.message ||
          "Could not generate the PDF. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppShell
      title="Reports"
      subtitle="Generate and download PDF reports for analysis"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Report cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {REPORT_DEFS.map((def) => {
            const active = selected === def.id;

            return (
              <button
                key={def.id}
                type="button"
                onClick={() => {
                  setSelected(def.id);
                  setStatusFilter("all");
                  setDownloadError(null);
                  setLastGenerated(null);
                }}
                style={{
                  minHeight: 222,
                  padding: 22,
                  borderRadius: 22,
                  border: active ? "2px solid #5B1E1D" : "1px solid #E7EAF0",
                  backgroundColor: active ? "#F5F3F6" : "#FFFFFF",
                  boxShadow: active
                    ? "0 4px 14px rgba(91,30,29,0.07)"
                    : "0 2px 8px rgba(15,23,42,0.035)",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all .18s ease",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 18,
                    backgroundColor: def.soft,
                    color: def.accent,
                    fontSize: 20,
                    marginBottom: 18,
                  }}
                >
                  {def.icon}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    lineHeight: 1.35,
                    fontWeight: 700,
                    color: "#171A2B",
                  }}
                >
                  {def.title}
                </h3>

                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 13,
                    lineHeight: 1.75,
                    color: "#8B94A7",
                  }}
                >
                  {def.description}
                </p>

                {active && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 14,
                      padding: "5px 10px",
                      borderRadius: 999,
                      backgroundColor: "rgba(91,30,29,0.08)",
                      color: "#5B1E1D",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    <FaCheck size={9} /> Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter + download row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            {selected === "booking-summary" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#667085",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <FaFilter size={13} /> Filter by status:
                </span>

                {STATUS_TABS.map((tab) => {
                  const active = statusFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setStatusFilter(tab.key)}
                      style={{
                        height: 40,
                        padding: "0 15px",
                        borderRadius: 18,
                        border: active
                          ? "1px solid #5B1E1D"
                          : "1px solid #E4E7EC",
                        backgroundColor: active ? "#5B1E1D" : "#FFFFFF",
                        color: active ? "#FFFFFF" : "#667085",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {lastGenerated && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 13px",
                  borderRadius: 999,
                  border: "1px solid #A7F3D0",
                  backgroundColor: "#ECFDF5",
                  color: "#047857",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                <FaCheck size={10} /> {lastGenerated}
              </span>
            )}

            <button
              type="button"
              onClick={handleDownload}
              disabled={generating}
              style={{
                height: 50,
                minWidth: 188,
                padding: "0 22px",
                border: "none",
                borderRadius: 20,
                backgroundColor: generating ? "#A97676" : "#5B1E1D",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 700,
                cursor: generating ? "not-allowed" : "pointer",
                boxShadow: generating
                  ? "none"
                  : "0 5px 14px rgba(91,30,29,0.18)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
              }}
            >
              <FaDownload size={13} />
              {generating ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>

        {downloadError && (
          <div
            style={{
              borderRadius: 16,
              border: "1px solid #FECACA",
              backgroundColor: "#FEF2F2",
              padding: "13px 16px",
              color: "#B91C1C",
              fontSize: 13,
            }}
          >
            {downloadError}
          </div>
        )}

        {/* Preview card */}
        <section
          style={{
            overflow: "hidden",
            borderRadius: 22,
            border: "1px solid #E7EAF0",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 3px 12px rgba(15,23,42,0.045)",
          }}
        >
          <div
            style={{
              minHeight: 84,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              borderBottom: "1px solid #EEF0F4",
              backgroundColor: "#FCFCFD",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedDef.soft,
                  color: selectedDef.accent,
                  fontSize: 17,
                }}
              >
                {selectedDef.icon}
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#171A2B",
                  }}
                >
                  {selectedDef.title}
                </h3>
                <p
                  style={{ margin: "4px 0 0", fontSize: 12, color: "#98A2B3" }}
                >
                  Preview — data included in PDF
                </p>
              </div>
            </div>

            {!loading && !previewError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {selected === "booking-summary" && bookingData && (
                  <>
                    <KpiPill
                      value={asNumber(bookingData.summary.total_bookings)}
                      label="Total Records"
                    />
                    <KpiPill
                      value={asNumber(bookingData.summary.pending)}
                      label="Pending"
                    />
                    <KpiPill
                      value={asNumber(bookingData.summary.approved)}
                      label="Approved"
                    />
                    <KpiPill
                      value={asNumber(bookingData.summary.confirmed)}
                      label="Confirmed"
                    />
                    <KpiPill
                      value={asNumber(bookingData.summary.completed)}
                      label="Completed"
                    />
                  </>
                )}

                {selected === "fleet-status" && fleetData && (
                  <>
                    <KpiPill
                      value={asNumber(fleetData.summary.total_vehicles)}
                      label="Total Vehicles"
                    />
                    <KpiPill
                      value={asNumber(fleetData.summary.available)}
                      label="Available"
                    />
                    <KpiPill
                      value={asNumber(fleetData.summary.in_use)}
                      label="In Use"
                    />
                    <KpiPill
                      value={asNumber(fleetData.summary.maintenance)}
                      label="Maintenance"
                    />
                  </>
                )}

                {selected === "monthly-activity" && monthlyData && (
                  <>
                    <KpiPill
                      value={asNumber(monthlyData.summary.months_covered)}
                      label="Months Covered"
                    />
                    <KpiPill
                      value={asNumber(monthlyData.summary.total_trips)}
                      label="Total Trips"
                    />
                    <KpiPill
                      value={asNumber(monthlyData.summary.cancelled)}
                      label="Cancelled"
                    />
                    <KpiPill
                      value={asNumber(monthlyData.summary.pending)}
                      label="Pending"
                    />
                  </>
                )}

                {selected === "user-activity" && userData && (
                  <>
                    <KpiPill
                      value={asNumber(userData.summary.total_users)}
                      label="Total Users"
                    />
                    <KpiPill
                      value={asNumber(userData.summary.active)}
                      label="Active"
                    />
                    <KpiPill
                      value={asNumber(userData.summary.inactive)}
                      label="Inactive"
                    />
                    <KpiPill
                      value={asNumber(userData.summary.staff)}
                      label="Staff"
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div
              style={{
                padding: "56px 24px",
                textAlign: "center",
                color: "#98A2B3",
                fontSize: 14,
              }}
            >
              Loading report preview…
            </div>
          ) : previewError ? (
            <div style={{ padding: 24 }}>
              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid #FECACA",
                  backgroundColor: "#FEF2F2",
                  padding: "13px 16px",
                  color: "#B91C1C",
                  fontSize: 13,
                }}
              >
                {previewError}
              </div>
            </div>
          ) : selected === "booking-summary" ? (
            <BookingPreview data={bookingData} />
          ) : selected === "fleet-status" ? (
            <FleetPreview data={fleetData} />
          ) : selected === "monthly-activity" ? (
            <MonthlyPreview
              data={monthlyData}
              maxCompleted={maxMonthlyCompleted}
            />
          ) : (
            <UserPreview data={userData} maxBookings={maxUserBookings} />
          )}
        </section>
      </div>
    </AppShell>
  );
}

function BookingPreview({ data }: { data: BookingReportPreview | null }) {
  if (!data?.rows.length) return <EmptyState />;

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", minWidth: 1180, borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={headRowStyle}>
            {[
              "Ref No.",
              "Requester",
              "Department",
              "Vehicle",
              "Destination",
              "Departure",
              "Return",
              "Pax",
              "Status",
            ].map((h) => (
              <th key={h} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.id || row.booking_reference} style={bodyRowStyle}>
              <td style={{ ...tdStyle, fontWeight: 700, color: "#5B1E1D" }}>
                {row.booking_reference}
              </td>
              <td style={{ ...tdStyle, fontWeight: 600, color: "#171A2B" }}>
                {row.full_name}
              </td>
              <td style={tdStyle}>{row.department || "—"}</td>
              <td style={tdStyle}>{row.vehicle_name}</td>
              <td
                style={{
                  ...tdStyle,
                  maxWidth: 190,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={row.destination}
              >
                {row.destination}
              </td>
              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                {formatDateTime(row.departure_date)}
              </td>
              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                {formatDateTime(row.return_date)}
              </td>
              <td style={{ ...tdStyle, fontWeight: 700, color: "#171A2B" }}>
                {row.passenger_count}
              </td>
              <td style={tdStyle}>
                <StatusBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FleetPreview({ data }: { data: VehicleReportPreview | null }) {
  if (!data?.rows.length) return <EmptyState />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", minWidth: 1050, borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={headRowStyle}>
            {[
              "Vehicle",
              "Type",
              "Plate No.",
              "Capacity",
              "Fuel",
              "Driver",
              "Status",
              "Last Service",
            ].map((h) => (
              <th key={h} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.id || row.vehicle_number} style={bodyRowStyle}>
              <td style={{ ...tdStyle, fontWeight: 700, color: "#171A2B" }}>
                {row.vehicle_name}
              </td>
              <td style={tdStyle}>{row.vehicle_type}</td>
              <td style={tdStyle}>
                <span
                  style={{
                    padding: "4px 9px",
                    borderRadius: 999,
                    background: "#FEF2F2",
                    color: "#5B1E1D",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {row.vehicle_number}
                </span>
              </td>
              <td style={tdStyle}>{row.capacity} pax</td>
              <td style={tdStyle}>{row.fuel_type || "—"}</td>
              <td style={tdStyle}>{row.driver_name || "—"}</td>
              <td style={tdStyle}>
                <StatusBadge status={row.status} />
              </td>
              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                {formatDate(row.last_service_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MonthlyPreview({
  data,
  maxCompleted,
}: {
  data: MonthlyActivityPreview | null;
  maxCompleted: number;
}) {
  if (!data?.rows.length) return <EmptyState />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", minWidth: 960, borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={headRowStyle}>
            {[
              "Month",
              "Completed Trips",
              "Cancelled",
              "Pending",
              "Total Bookings",
              "Completion Rate",
            ].map((h) => (
              <th key={h} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => {
            const completed = asNumber(row.completed);
            const rate = Number(row.completion_rate || 0);
            return (
              <tr key={row.month_start} style={bodyRowStyle}>
                <td style={{ ...tdStyle, fontWeight: 700, color: "#171A2B" }}>
                  {row.month_label}
                </td>
                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 120,
                    }}
                  >
                    <strong style={{ width: 24, color: "#5B1E1D" }}>
                      {completed}
                    </strong>
                    <div
                      style={{
                        width: 78,
                        height: 8,
                        borderRadius: 999,
                        background: "#F0F1F4",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.max(4, (completed / maxCompleted) * 100)}%`,
                          borderRadius: 999,
                          background: "#5B1E1D",
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td style={{ ...tdStyle, color: "#EF4444", fontWeight: 600 }}>
                  {row.cancelled}
                </td>
                <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>
                  {row.pending}
                </td>
                <td style={{ ...tdStyle, fontWeight: 700, color: "#171A2B" }}>
                  {row.total_bookings}
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: 999,
                      background: "#ECFDF5",
                      color: "#047857",
                      fontWeight: 700,
                    }}
                  >
                    {rate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function UserPreview({
  data,
  maxBookings,
}: {
  data: UserActivityPreview | null;
  maxBookings: number;
}) {
  if (!data?.rows.length) return <EmptyState />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", minWidth: 1050, borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={headRowStyle}>
            {[
              "User",
              "Email",
              "Role",
              "Department",
              "Joined",
              "Total Bookings",
              "Status",
            ].map((h) => (
              <th key={h} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => {
            const count = asNumber(row.bookings_count);
            return (
              <tr key={row.id} style={bodyRowStyle}>
                <td style={tdStyle}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#5B1E1D",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {initials(row.full_name)}
                    </span>
                    <span style={{ fontWeight: 700, color: "#171A2B" }}>
                      {row.full_name}
                    </span>
                  </div>
                </td>
                <td style={tdStyle}>{row.email}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: 999,
                      background: "#EFF6FF",
                      color: "#1D4ED8",
                      fontWeight: 700,
                    }}
                  >
                    {prettyRole(row.role)}
                  </span>
                </td>
                <td style={tdStyle}>{row.department || "—"}</td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {formatDate(row.created_at)}
                </td>
                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 115,
                    }}
                  >
                    <strong style={{ width: 24, color: "#171A2B" }}>
                      {count}
                    </strong>
                    <div
                      style={{
                        width: 66,
                        height: 8,
                        borderRadius: 999,
                        background: "#F0F1F4",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${count === 0 ? 0 : Math.max(5, (count / maxBookings) * 100)}%`,
                          borderRadius: 999,
                          background: "#5B1E1D",
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: 999,
                      background: row.is_active ? "#ECFDF5" : "#F2F4F7",
                      color: row.is_active ? "#047857" : "#667085",
                      fontWeight: 700,
                    }}
                  >
                    {row.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const headRowStyle: React.CSSProperties = {
  backgroundColor: "#FCFCFD",
  borderBottom: "1px solid #EEF0F4",
};
const thStyle: React.CSSProperties = {
  padding: "15px 20px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#98A2B3",
  whiteSpace: "nowrap",
};
const bodyRowStyle: React.CSSProperties = {
  minHeight: 66,
  borderBottom: "1px solid #F0F2F5",
};
const tdStyle: React.CSSProperties = {
  padding: "18px 20px",
  fontSize: 13,
  lineHeight: 1.5,
  color: "#475467",
  verticalAlign: "middle",
};
