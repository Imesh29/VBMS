import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

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

export default app;
