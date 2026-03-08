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

// ===============================
// PostgreSQL Connection
// ===============================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch(err => console.error("❌ PostgreSQL Error:", err));

// ===============================
// Express App
// ===============================
const app = express();

// make pool available everywhere
app.locals.pool = pool;

// ===============================
// Middleware
// ===============================
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ===============================
// Routes
// ===============================
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "NCMP Backend API Running 🚀",
    status: "OK",
    environment: process.env.NODE_ENV || "development"
  });
});

// ===============================
// 404
// ===============================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
    error: err.message
  });
});

// ===============================
app.listen(PORT, () => {
  console.log(`🚀 NCMP Server running on port ${PORT}`);
});