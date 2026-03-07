// db.js
require('dotenv').config();
const { Pool } = require('pg');

// ===============================
// PostgreSQL Pool Setup
// ===============================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // required for Render Postgres
  max: 20,          // max number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30s
  connectionTimeoutMillis: 2000, // return an error after 2s if connection could not be established
});

// ===============================
// Connection Events
// ===============================
pool.on('connect', () => console.log('✅ PostgreSQL pool connected'));
pool.on('error', (err) => {
  console.error('❌ Unexpected DB error', err);
  process.exit(-1);
});

// Optional: Test connection immediately
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('🟢 DB Test Successful:', res.rows[0]);
  } catch (err) {
    console.error('❌ DB Test Failed:', err);
  }
};
testConnection();

module.exports = pool;