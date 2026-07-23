import TopNavbar from "./TopNavbar";
import WelcomeBanner from "./WelcomeBanner";
import StatsCard from "./StatsCard";
import BookingChart from "./BookingChart";
import StatusChart from "./StatusChart";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <TopNavbar />

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
            <StatsCard
              title="Total Bookings"
              value="08"
              color="blue"
            />

            <StatsCard
              title="Pending Approval"
              value="02"
              color="yellow"
            />

            <StatsCard
              title="Vehicles In Use"
              value="06"
              color="green"
            />

            <StatsCard
              title="Maintenance"
              value="02"
              color="red"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
            {/* Booking Chart */}
            <div className="xl:col-span-2">
              <BookingChart />
            </div>

            {/* Status Pie Chart */}
            <StatusChart />
          </div>
        </main>
      </div>
    </div>
  );
}