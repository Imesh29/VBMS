import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/DashboardPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Vehicles from "./pages/VehiclesPage";
import Users from "./pages/UsersPage";
import Reports from "./pages/ReportsPage";
import BookingListPage from "./pages/BookingListPage";
import NewBookingPage from "./pages/NewBookingPage";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Registration */}
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Booking list: role-aware data and actions */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute roles={["USER", "DEAN", "ADMIN"]}>
              <BookingListPage />
            </ProtectedRoute>
          }
        />

        {/* New booking: Staff/User only */}
        <Route
          path="/add-booking"
          element={
            <ProtectedRoute roles={["USER"]}>
              <NewBookingPage />
            </ProtectedRoute>
          }
        />

        {/* Edit pending booking: Staff/User only */}
        <Route
          path="/bookings/:id/edit"
          element={
            <ProtectedRoute roles={["USER"]}>
              <NewBookingPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Fleet Management (Admin only) */}
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Vehicles />
            </ProtectedRoute>
          }
        />

        {/* Protected User Management (Admin only) */}
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Protected Reports (Admin + Dean) */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["ADMIN", "DEAN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
