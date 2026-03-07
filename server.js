require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { Pool } = require("pg");

// ===============================
// Environment Variables
// ===============================
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
const JWT_SECRET = process.env.JWT_SECRET;

// ===============================
// PostgreSQL Pool Setup (SSL enabled)
// ===============================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // required for Render Postgres
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ===============================
// Express App Setup
// ===============================
const app = express();

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ===============================
// Import Routes (Safe loading)
// ===============================
let authRoutes, mpRoutes, staffRoutes, requestRoutes, projectRoutes, beneficiaryRoutes, reportRoutes;

try {
  authRoutes = require("./routes/authRoutes");
  mpRoutes = require("./routes/mpRoutes");
  staffRoutes = require("./routes/staffRoutes");
  requestRoutes = require("./routes/requestRoutes");
  projectRoutes = require("./routes/projectRoutes");
  beneficiaryRoutes = require("./routes/beneficiaryRoutes");
  reportRoutes = require("./routes/reportRoutes");
} catch (err) {
  console.warn("⚠️ Some route files are missing. API will still run.");
}

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
// API Routes
// ===============================
if (authRoutes) app.use("/api/auth", authRoutes);
if (mpRoutes) app.use("/api/mps", mpRoutes);
if (staffRoutes) app.use("/api/staff", staffRoutes);
if (requestRoutes) app.use("/api/requests", requestRoutes);
if (projectRoutes) app.use("/api/projects", projectRoutes);
if (beneficiaryRoutes) app.use("/api/beneficiaries", beneficiaryRoutes);
if (reportRoutes) app.use("/api/reports", reportRoutes);

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
  console.log(
    `🚀 NCMP Server running on port ${PORT} | ENV: ${process.env.NODE_ENV || "development"}`
  );
});