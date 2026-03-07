const pool = require('../config/db');

exports.getStaff = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, full_name, email, role, phone FROM users WHERE role='staff'");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { full_name, email, phone, role } = req.body;

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, full_name, email, role, phone`,
      [full_name, email, phone, role || "staff"]
    );

    res.status(201).json({ message: "Staff added successfully", staff: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create staff" });
  }
};