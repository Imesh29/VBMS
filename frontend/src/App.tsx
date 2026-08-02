import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DashboardPage";
import Login from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
