import express from "express";
import cors from "cors";

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

export default app;
