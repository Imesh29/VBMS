import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import deanRoutes from "./routes/deanRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vehicle Booking API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/vehicles", vehicleRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/dean", deanRoutes);

app.use("/api/admin", adminRoutes);

export default app;
