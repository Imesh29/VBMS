import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();

    console.log("PostgreSQL database connected successfully");

    client.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export { pool, testDatabaseConnection };
