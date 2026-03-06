const pool = require('../config/db');

exports.getProjects = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, constituency, budget, milestones, status } = req.body;

    const result = await pool.query(
      `INSERT INTO projects (title, constituency, budget, milestones, status)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [title, constituency, budget, milestones || null, status || "Pending"]
    );

    res.status(201).json({ message: "Project created successfully", project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
};