const pool = require('../config/db');

exports.getReports = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.subject, r.priority, u.full_name AS citizen_name, r.created_at
      FROM requests r
      LEFT JOIN users u ON r.citizen_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};