import { FaCalendarCheck, FaClock, FaCar, FaTools } from "react-icons/fa";

import TopNavbar from "./TopNavbar";
import Sidebar from "../dashboard/Sidebar";
import WelcomeBanner from "../dashboard/WelcomeBanner";
import StatsCard from "../dashboard/StatsCard";
import BookingChart from "../dashboard/BookingChart";
import StatusChart from "../dashboard/StatusChart";
import RecentBookingsTable from "../dashboard/RecentBookingsTable";

export default function DashboardLayout() {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F5F7FC]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <TopNavbar />

        {/* Scrollable Dashboard Content */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]"
          style={{
            padding: "15px",
          }}
        >
          <div className="p-8 space-y-7 max-w-[1600px] mx-auto">
            {/* Welcome Banner */}
            <WelcomeBanner totalBookings={8} />

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={<FaCalendarCheck className="w-6 h-6 text-blue-600" />}
                colorClass="bg-blue-50"
                title="Total Bookings"
                value={8}
                trend={{ value: "18%", up: true }}
              />

              <StatsCard
                icon={<FaClock className="w-6 h-6 text-amber-600" />}
                colorClass="bg-amber-50"
                title="Pending Confirmation"
                value={2}
              />

              <StatsCard
                icon={<FaCar className="w-6 h-6 text-emerald-600" />}
                colorClass="bg-emerald-50"
                title="Vehicles In Use"
                value={2}
                caption="4 available"
              />

              <StatsCard
                icon={<FaTools className="w-6 h-6 text-orange-600" />}
                colorClass="bg-orange-50"
                title="Under Maintenance"
                value={2}
                caption="Requires attention"
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2 min-w-0">
                <BookingChart />
              </div>

              <div className="min-w-0">
                <StatusChart />
              </div>
            </div>

            {/* Recent bookings */}
            <RecentBookingsTable />
          </div>
        </main>
      </div>
    </div>
  );
}
