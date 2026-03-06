const pool = require('../config/db');

exports.getBeneficiaries = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM beneficiaries ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch beneficiaries" });
  }
};

exports.createBeneficiary = async (req, res) => {
  try {
    const { full_name, nin, program, phone } = req.body;

    const result = await pool.query(
      `INSERT INTO beneficiaries (full_name, nin, program, phone)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [full_name, nin, program, phone || null]
    );

    res.status(201).json({ message: "Beneficiary created successfully", beneficiary: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create beneficiary" });
  }
};