import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaCar,
  FaChartLine,
  FaCheck,
  FaDownload,
  FaFilter,
} from "react-icons/fa";

import AppShell from "../components/layout/AppShell";
import { useAuth } from "../context/AuthContext";

import * as dashboardApi from "../api/dashboardApi";
import * as reportApi from "../api/reportApi";

import type { AdminDashboardData, DeanDashboardData } from "../types/dashboard";
import { toNumber } from "../utils/dashboard";

type ReportType = "booking-summary" | "fleet-status" | "activity-summary";

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
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
}

const REPORT_DEFS: ReportDef[] = [
  {
    id: "booking-summary",
    title: "Booking Summary Report",
    description:
      "Full list of all bookings with status, requester, vehicle, destination, and dates.",
    icon: <FaCalendarCheck className="h-5 w-5" />,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "fleet-status",
    title: "Fleet Status Report",
    description:
      "Current status of all university vehicles including driver, fuel type, and last service date.",
    icon: <FaCar className="h-5 w-5" />,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    id: "activity-summary",
    title: "Activity Summary Report",
    description:
      "Combined snapshot of booking and fleet activity across the system.",
    icon: <FaChartLine className="h-5 w-5" />,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
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

export default function ReportsPage() {
  const { user } = useAuth();
  const role = user?.role;

  const [selected, setSelected] = useState<ReportType>("booking-summary");
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("all");

  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const [dashboardData, setDashboardData] = useState<
    AdminDashboardData | DeanDashboardData | null
  >(null);

  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setDashboardLoading(true);

      try {
        const data =
          role === "ADMIN"
            ? await dashboardApi.getAdminDashboard()
            : await dashboardApi.getDeanDashboard();

        if (!cancelled) {
          setDashboardData(data);
        }
      } catch {
        // Report download can still work even if preview totals fail.
      } finally {
        if (!cancelled) {
          setDashboardLoading(false);
        }
      }
    }

    if (role === "ADMIN" || role === "DEAN") {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [role]);

  const pendingLabel =
    role === "DEAN"
      ? (dashboardData as DeanDashboardData)?.pending_approvals
      : (dashboardData as AdminDashboardData)?.pending_bookings;

  const bookingPreview = useMemo(
    () => [
      {
        label: "Pending",
        value: toNumber(pendingLabel),
      },
      {
        label: "Approved",
        value: toNumber(dashboardData?.approved_bookings),
      },
      {
        label: "Confirmed",
        value: toNumber(dashboardData?.confirmed_bookings),
      },
      {
        label: "Completed",
        value: toNumber(dashboardData?.completed_bookings),
      },
      {
        label: "Cancelled",
        value: toNumber(dashboardData?.cancelled_bookings),
      },
    ],
    [dashboardData, pendingLabel],
  );

  const fleetPreview = useMemo(() => {
    if (role !== "ADMIN" || !dashboardData) {
      return null;
    }

    const d = dashboardData as AdminDashboardData;

    return [
      {
        label: "Total Vehicles",
        value: toNumber(d.total_vehicles),
      },
      {
        label: "Available",
        value: toNumber(d.available_vehicles),
      },
      {
        label: "In Use",
        value: toNumber(d.vehicles_in_use),
      },
      {
        label: "Maintenance",
        value: toNumber(d.vehicles_under_maintenance),
      },
    ];
  }, [dashboardData, role]);

  async function handleGenerate() {
    setGenerating(true);
    setDownloadError(null);

    try {
      if (selected === "booking-summary") {
        await reportApi.downloadBookingReport({
          status: statusFilter === "all" ? undefined : statusFilter,
        });
      } else if (selected === "fleet-status") {
        await reportApi.downloadVehicleReport();
      } else {
        await reportApi.downloadDashboardReport();
      }

      const def = REPORT_DEFS.find((d) => d.id === selected)!;

      setLastGenerated(`${def.title} downloaded`);
    } catch (err: any) {
      setDownloadError(
        err?.response?.data?.message ||
          "Could not generate the report. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  }

  const selectedDef = REPORT_DEFS.find((d) => d.id === selected)!;

  return (
    <AppShell
      title="Reports"
      subtitle="Generate and download PDF reports for analysis"
    >
      <div className="flex flex-col gap-6">
        {/* Report cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                }}
                className={[
                  "min-h-[220px] rounded-[22px] bg-white p-6 text-left",
                  "transition-all duration-200",
                  active
                    ? "border-2 border-[#5A1E1E] bg-[#5A1E1E]/[0.025] shadow-sm"
                    : "border border-[#E8EAF0] hover:-translate-y-[1px] hover:shadow-md",
                ].join(" ")}
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${def.iconBg} ${def.iconColor}`}
                >
                  {def.icon}
                </div>

                <h3 className="text-[17px] font-bold leading-6 text-[#171A2B]">
                  {def.title}
                </h3>

                <p className="mt-2 max-w-[360px] text-[14px] leading-6 text-[#8B94A7]">
                  {def.description}
                </p>

                {active && (
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#5A1E1E]/10 px-3 py-1 text-[11px] font-semibold text-[#5A1E1E]">
                    <FaCheck className="h-2.5 w-2.5" />
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters + Download */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            {selected === "booking-summary" && (
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="mr-1 flex shrink-0 items-center gap-2 text-[13px] font-semibold text-[#667085]">
                  <FaFilter className="h-3.5 w-3.5" />
                  Filter by status:
                </span>

                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={[
                      "h-10 rounded-[18px] px-4 text-[13px] font-semibold transition-all",
                      statusFilter === tab.key
                        ? "bg-[#5A1E1E] text-white shadow-sm"
                        : "border border-[#E4E7EC] bg-white text-[#667085] hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {lastGenerated && (
              <div className="flex items-center gap-2 rounded-[16px] border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
                <FaCheck className="h-3 w-3 shrink-0 text-emerald-600" />
                <span className="max-w-[220px] truncate text-[12px] font-medium text-emerald-700">
                  {lastGenerated}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="flex h-[50px] items-center justify-center gap-2.5 rounded-[20px] bg-[#5A1E1E] px-6 text-[14px] font-bold text-white shadow-[0_5px_14px_rgba(90,30,30,0.18)] transition-all hover:bg-[#491818] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaDownload className="h-3.5 w-3.5" />
              {generating ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>

        {downloadError && (
          <div className="rounded-[18px] border border-red-200 bg-red-50 px-5 py-3.5 text-sm text-red-700">
            {downloadError}
          </div>
        )}

        {/* Preview card */}
        <div className="overflow-hidden rounded-[22px] border border-[#E7EAF0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 border-b border-[#EEF0F4] bg-[#FCFCFD] px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${selectedDef.iconBg} ${selectedDef.iconColor}`}
              >
                {selectedDef.icon}
              </div>

              <div>
                <h3 className="text-[15px] font-bold text-[#171A2B]">
                  {selectedDef.title}
                </h3>

                <p className="mt-0.5 text-[12px] text-[#98A2B3]">
                  Preview — data included in PDF
                </p>
              </div>
            </div>

            {!dashboardLoading && (
              <div className="flex flex-wrap items-center gap-2">
                {(selected === "booking-summary" ||
                  selected === "activity-summary") &&
                  bookingPreview.map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F8FA] px-3.5 py-2 text-[12px] text-[#667085]"
                    >
                      <strong className="font-bold text-[#171A2B]">
                        {item.value}
                      </strong>
                      {item.label}
                    </span>
                  ))}

                {selected === "fleet-status" &&
                  fleetPreview?.map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F8FA] px-3.5 py-2 text-[12px] text-[#667085]"
                    >
                      <strong className="font-bold text-[#171A2B]">
                        {item.value}
                      </strong>
                      {item.label}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="px-6 py-7">
            {dashboardLoading ? (
              <p className="text-[14px] text-[#98A2B3]">Loading preview…</p>
            ) : selected === "fleet-status" && role === "DEAN" ? (
              <p className="text-[14px] leading-6 text-[#7D8798]">
                Fleet totals aren't shown here for your role — download the PDF
                to view full vehicle details.
              </p>
            ) : (
              <p className="text-[14px] leading-7 text-[#667085]">
                {selectedDef.description} Click{" "}
                <span className="font-semibold text-[#5A1E1E]">
                  Download PDF
                </span>{" "}
                above to generate the full report
                {selected === "booking-summary" && statusFilter !== "all" && (
                  <>
                    {" "}
                    filtered to{" "}
                    <span className="font-semibold text-[#5A1E1E]">
                      {statusFilter.charAt(0) +
                        statusFilter.slice(1).toLowerCase()}
                    </span>{" "}
                    bookings
                  </>
                )}
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
