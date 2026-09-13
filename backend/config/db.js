import "dotenv/config";
import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";
const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;

const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    }
  : {
      host: instanceConnectionName
        ? `/cloudsql/${instanceConnectionName}`
        : process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

const pool = new Pool({
  ...connectionConfig,
  max: Number(process.env.DB_POOL_MAX || (isProduction ? 10 : 5)),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
  connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 10000),
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

const testDatabaseConnection = async () => {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
    console.log("PostgreSQL database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

export { pool, testDatabaseConnection };
