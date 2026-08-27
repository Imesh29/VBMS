import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BookingFormPage from "./pages/BookingFormPage";


export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<LoginPage />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        {/* Bookings */}
        <Route
          path="/bookings"
          element={<BookingFormPage />}
        />

        {/* Add Booking */}
        <Route
          path="/add-booking"
          element={<BookingFormPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}