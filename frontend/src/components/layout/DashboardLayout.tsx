import type { ReactNode } from "react";
import {
  FaCalendarCheck,
  FaClock,
  FaCar,
  FaTools,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";

import AppShell from "./AppShell";
import WelcomeBanner from "../dashboard/WelcomeBanner";
import StatsCard from "../dashboard/StatsCard";
import BookingChart from "../dashboard/BookingChart";
import StatusChart from "../dashboard/StatusChart";
import RecentBookingsTable from "../dashboard/RecentBookingsTable";

import { useAuth } from "../../context/AuthContext";
import { useDashboardData } from "../../hooks/useDashboardData";
import { toNumber } from "../../utils/dashboard";

import type {
  AdminDashboardData,
  DeanDashboardData,
  UserDashboardData,
} from "../../types/dashboard";

interface StatCardConfig {
  key: string;
  icon: ReactNode;
  colorClass: string;
  title: string;
  value: number;
  caption?: string;
}

function buildStatCards(
  role: string | undefined,
  data: UserDashboardData | DeanDashboardData | AdminDashboardData | null,
): StatCardConfig[] {
  if (!data) return [];

  if (role === "ADMIN") {
    const d = data as AdminDashboardData;
    return [
      {
        key: "total_bookings",
        icon: <FaCalendarCheck className="w-6 h-6 text-blue-600" />,
        colorClass: "bg-blue-50",
        title: "Total Bookings",
        value: toNumber(d.total_bookings),
      },
      {
        key: "pending_bookings",
        icon: <FaClock className="w-6 h-6 text-amber-600" />,
        colorClass: "bg-amber-50",
        title: "Pending Confirmation",
        value: toNumber(d.pending_bookings),
      },
      {
        key: "vehicles_in_use",
        icon: <FaCar className="w-6 h-6 text-emerald-600" />,
        colorClass: "bg-emerald-50",
        title: "Vehicles In Use",
        value: toNumber(d.vehicles_in_use),
        caption: `${toNumber(d.available_vehicles)} available`,
      },
      {
        key: "vehicles_under_maintenance",
        icon: <FaTools className="w-6 h-6 text-orange-600" />,
        colorClass: "bg-orange-50",
        title: "Under Maintenance",
        value: toNumber(d.vehicles_under_maintenance),
        caption: "Requires attention",
      },
    ];
  }

  if (role === "DEAN") {
    const d = data as DeanDashboardData;
    return [
      {
        key: "pending_approvals",
        icon: <FaClock className="w-6 h-6 text-amber-600" />,
        colorClass: "bg-amber-50",
        title: "Pending Approvals",
        value: toNumber(d.pending_approvals),
        caption: "Awaiting your review",
      },
      {
        key: "approved_bookings",
        icon: <FaCalendarCheck className="w-6 h-6 text-blue-600" />,
        colorClass: "bg-blue-50",
        title: "Approved Bookings",
        value: toNumber(d.approved_bookings),
      },
      {
        key: "confirmed_bookings",
        icon: <FaCheckCircle className="w-6 h-6 text-emerald-600" />,
        colorClass: "bg-emerald-50",
        title: "Confirmed Bookings",
        value: toNumber(d.confirmed_bookings),
      },
      {
        key: "completed_bookings",
        icon: <FaClipboardList className="w-6 h-6 text-slate-600" />,
        colorClass: "bg-slate-100",
        title: "Completed Bookings",
        value: toNumber(d.completed_bookings),
      },
    ];
  }

  // USER
  const d = data as UserDashboardData;
  return [
    {
      key: "total_bookings",
      icon: <FaCalendarCheck className="w-6 h-6 text-blue-600" />,
      colorClass: "bg-blue-50",
      title: "Total Bookings",
      value: toNumber(d.total_bookings),
    },
    {
      key: "pending_bookings",
      icon: <FaClock className="w-6 h-6 text-amber-600" />,
      colorClass: "bg-amber-50",
      title: "Pending Bookings",
      value: toNumber(d.pending_bookings),
    },
    {
      key: "upcoming_trips",
      icon: <FaCar className="w-6 h-6 text-emerald-600" />,
      colorClass: "bg-emerald-50",
      title: "Upcoming Trips",
      value: toNumber(d.upcoming_trips),
    },
    {
      key: "completed_bookings",
      icon: <FaClipboardList className="w-6 h-6 text-slate-600" />,
      colorClass: "bg-slate-100",
      title: "Completed Bookings",
      value: toNumber(d.completed_bookings),
    },
  ];
}

export default function DashboardLayout() {
  const { user } = useAuth();
  const {
    loading,
    error,
    data,
    statusBreakdown,
    recentBookings,
    recentBookingsTitle,
    totalBookings,
    refetch,
  } = useDashboardData();

  const statCards = buildStatCards(user?.role, data);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Overview of your vehicle booking system"
    >
      {/* Welcome Banner */}
      <WelcomeBanner totalBookings={totalBookings} />

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3.5 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={refetch}
            className="font-semibold hover:underline shrink-0 ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 h-[160px] animate-pulse"
              />
            ))
          : statCards.map((card) => (
              <StatsCard
                key={card.key}
                icon={card.icon}
                colorClass={card.colorClass}
                title={card.title}
                value={card.value}
                caption={card.caption}
              />
            ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 min-w-0">
          <BookingChart data={statusBreakdown} loading={loading} />
        </div>

        <div className="min-w-0">
          <StatusChart data={statusBreakdown} loading={loading} />
        </div>
      </div>

      {/* Recent bookings */}
      <RecentBookingsTable
        title={recentBookingsTitle}
        bookings={recentBookings}
        loading={loading}
        error={!loading ? error : null}
      />
    </AppShell>
  );
}
