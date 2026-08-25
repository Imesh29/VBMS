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

import type {
  AdminDashboardData,
  DeanDashboardData,
} from "../types/dashboard";
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
  color: string;
  iconBg: string;
}

const REPORT_DEFS: ReportDef[] = [
  {
    id: "booking-summary",
    title: "Booking Summary Report",
    description:
      "Full list of bookings with status, requester, vehicle, destination, and dates.",
    icon: <FaCalendarCheck className="w-4 h-4" />,
    color: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "fleet-status",
    title: "Fleet Status Report",
    description:
      "Current status of university vehicles including driver and capacity.",
    icon: <FaCar className="w-4 h-4" />,
    color: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    id: "activity-summary",
    title: "Activity Summary Report",
    description:
      "Combined snapshot of booking and fleet activity across the system.",
    icon: <FaChartLine className="w-4 h-4" />,
    color: "text-purple-600",
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
        if (!cancelled) setDashboardData(data);
      } catch {
        // Preview pills are a nice-to-have — the PDF download still works
        // even if this quietly fails, so we don't surface an error banner.
      } finally {
        if (!cancelled) setDashboardLoading(false);
      }
    }

    if (role === "ADMIN" || role === "DEAN") load();

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
      { label: "Pending", value: toNumber(pendingLabel) },
      { label: "Approved", value: toNumber(dashboardData?.approved_bookings) },
      { label: "Confirmed", value: toNumber(dashboardData?.confirmed_bookings) },
      { label: "Completed", value: toNumber(dashboardData?.completed_bookings) },
      { label: "Cancelled", value: toNumber(dashboardData?.cancelled_bookings) },
    ],
    [dashboardData, pendingLabel],
  );

  const fleetPreview = useMemo(() => {
    if (role !== "ADMIN" || !dashboardData) return null;
    const d = dashboardData as AdminDashboardData;
    return [
      { label: "Total Vehicles", value: toNumber(d.total_vehicles) },
      { label: "Available", value: toNumber(d.available_vehicles) },
      { label: "In Use", value: toNumber(d.vehicles_in_use) },
      { label: "Maintenance", value: toNumber(d.vehicles_under_maintenance) },
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
      {/* Report type selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_DEFS.map((def) => (
          <button
            key={def.id}
            onClick={() => {
              setSelected(def.id);
              setStatusFilter("all");
              setDownloadError(null);
            }}
            className={`p-5 rounded-2xl border-2 text-left transition-all duration-150 bg-white ${
              selected === def.id
                ? "border-[#4C1D1D] bg-[#4C1D1D]/[0.03] shadow-sm"
                : "border-transparent hover:border-gray-200 hover:shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${def.iconBg} ${def.color}`}
            >
              {def.icon}
            </div>
            <p className="text-sm font-bold text-[#1C1C2E] leading-snug">
              {def.title}
            </p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              {def.description}
            </p>
            {selected === def.id && (
              <span className="inline-flex items-center gap-1 mt-2.5 text-[10px] font-semibold text-[#4C1D1D] bg-[#4C1D1D]/10 px-2 py-0.5 rounded-full">
                <FaCheck className="w-2 h-2" /> Selected
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters + Generate row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {selected === "booking-summary" && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 shrink-0">
              <FaFilter className="w-3 h-3" /> Filter by status:
            </span>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  statusFilter === tab.key
                    ? "bg-[#4C1D1D] text-white"
                    : "bg-white border border-black/[0.08] text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="sm:ml-auto flex items-center gap-3 flex-wrap">
          {lastGenerated && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <FaCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700 font-medium truncate max-w-[220px]">
                {lastGenerated}
              </p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4C1D1D] text-white rounded-xl text-sm font-bold hover:bg-[#3A1515] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shadow-sm shadow-[#4C1D1D]/20"
          >
            {generating ? (
              "Generating…"
            ) : (
              <>
                <FaDownload className="w-3.5 h-3.5" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {downloadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3.5">
          {downloadError}
        </div>
      )}

      {/* Preview panel */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedDef.iconBg} ${selectedDef.color}`}
            >
              {selectedDef.icon}
            </div>
            <div>
              <h3
                className="text-sm font-bold text-[#1C1C2E]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {selectedDef.title}
              </h3>
              <p className="text-xs text-gray-400">
                Live totals — full detail is included in the PDF
              </p>
            </div>
          </div>

          {!dashboardLoading && (
            <div className="flex items-center gap-2 flex-wrap">
              {(selected === "booking-summary" ||
                selected === "activity-summary") &&
                bookingPreview.map((s) => (
                  <span
                    key={s.label}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600 whitespace-nowrap"
                  >
                    {s.value} {s.label}
                  </span>
                ))}
              {selected === "fleet-status" &&
                fleetPreview?.map((s) => (
                  <span
                    key={s.label}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600 whitespace-nowrap"
                  >
                    {s.value} {s.label}
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className="p-6">
          {dashboardLoading ? (
            <p className="text-sm text-gray-400">Loading preview…</p>
          ) : selected === "fleet-status" && role === "DEAN" ? (
            <p className="text-sm text-gray-400">
              Fleet totals aren't shown here for your role — download the PDF
              to view full vehicle details.
            </p>
          ) : (
            <p className="text-sm text-gray-500 leading-relaxed">
              {selectedDef.description} Click{" "}
              <span className="font-semibold text-[#4C1D1D]">
                Download PDF
              </span>{" "}
              above to generate the full report
              {selected === "booking-summary" && statusFilter !== "all" && (
                <>
                  {" "}
                  filtered to{" "}
                  <span className="font-semibold text-[#4C1D1D]">
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
    </AppShell>
  );
}
