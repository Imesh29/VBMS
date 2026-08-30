import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Dashboard from "./pages/DashboardPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Reports from "./pages/ReportsPage";
import Users from "./pages/UsersPage";
import Vehicles from "./pages/VehiclesPage";
import BookingFormPage from "./pages/BookingFormPage";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public: Login */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Public: Registration */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected: Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected: Bookings */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingFormPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Add Booking */}
        <Route
          path="/add-booking"
          element={
            <ProtectedRoute>
              <BookingFormPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Fleet Management - Admin only */}
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Vehicles />
            </ProtectedRoute>
          }
        />

        {/* Protected: User Management - Admin only */}
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Protected: Reports - Admin and Dean */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["ADMIN", "DEAN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;