const pool = require("../config/db");

const createUser = async ({ full_name, email, password_hash, role, nin, phone, profile_photo }) => {
  const result = await pool.query(
    `INSERT INTO users 
      (full_name, email, password_hash, role, nin, phone, profile_photo)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id, full_name, email, role, nin, phone, profile_photo`,
    [full_name, email, password_hash, role, nin, phone, profile_photo || null]
  );
  return result.rows[0];
};

const findUserByIdentifier = async (identifier) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE nin=$1 OR email=$1",
    [identifier]
  );
  return result.rows[0] || null;
};

const findUserByNIN = async (nin) => {
  const result = await pool.query("SELECT * FROM users WHERE nin=$1", [nin]);
  return result.rows[0] || null;
};

module.exports = { createUser, findUserByIdentifier, findUserByNIN };