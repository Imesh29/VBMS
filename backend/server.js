import "dotenv/config";
import app from "./app.js";
import { testDatabaseConnection } from "./config/db.js";

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
  try {
    await testDatabaseConnection();

    app.listen(PORT, HOST, () => {
      console.log(`VBMS backend is running on ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
