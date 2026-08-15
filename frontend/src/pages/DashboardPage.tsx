import MainLayout from "../components/layout/MainLayout";

export default function DashboardPage() {
  return (
    <MainLayout>

      <div className="p-6">

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome to the Vehicle Booking Management System.
          </p>

        </div>

      </div>

    </MainLayout>
  );
}