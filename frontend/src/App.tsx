import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;