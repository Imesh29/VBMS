import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/DashboardPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Vehicles from "./pages/VehiclesPage";
import Users from "./pages/UsersPage";
import Reports from "./pages/ReportsPage";

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
