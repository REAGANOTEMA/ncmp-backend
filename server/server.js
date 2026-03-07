require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { Pool } = require("pg");

const app = express();

// ===============================
// Environment Variables
// ===============================
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASS = process.env.DB_PASS;
const DB_PORT = process.env.DB_PORT;

// ===============================
// PostgreSQL Pool
// ===============================
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASS,
  port: DB_PORT,
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Make pool accessible in routes
app.locals.pool = pool;

// ===============================
// Middleware
// ===============================
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// ===============================
// Routes
// ===============================
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Add other routes as needed:
// const mpRoutes = require("./routes/mpRoutes");
// app.use("/api/mps", mpRoutes);

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "NCMP Backend API Running 🚀",
    status: "OK",
    environment: process.env.NODE_ENV || "development",
  });
});

// ===============================
// 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found ❌" });
});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 NCMP Server running on port ${PORT}`);
});