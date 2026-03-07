const pool = require('../config/db');

exports.getRequests = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM requests ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { citizen_id, subject, description, priority } = req.body;

    const result = await pool.query(
      `INSERT INTO requests (citizen_id, subject, description, priority)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [citizen_id, subject, description, priority || "Normal"]
    );

    res.status(201).json({ message: "Request created successfully", request: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create request" });
  }
};