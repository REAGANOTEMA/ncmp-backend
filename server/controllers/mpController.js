const pool = require('../config/db');

exports.getMPs = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, full_name, party, constituency, region, profile_photo FROM users WHERE role='mp'");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch MPs" });
  }
};

exports.createMP = async (req, res) => {
  try {
    const { full_name, email, phone, party, constituency, region, profile_photo } = req.body;

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, role, party, constituency, region, profile_photo)
       VALUES ($1,$2,$3,'mp',$4,$5,$6,$7)
       RETURNING id, full_name, email, phone, party, constituency, region, profile_photo`,
      [full_name, email, phone, party, constituency, region, profile_photo || null]
    );

    res.status(201).json({ message: "MP added successfully", mp: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create MP" });
  }
};