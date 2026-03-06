const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
================================
REGISTER
================================
*/
exports.register = async (req, res) => {
  try {
    const { full_name, email, nin, password, role } = req.body;

    if (!full_name || !password || !role) {
      return res.status(400).json({
        message: "Full name, password and role are required",
      });
    }

    if (!email && !nin) {
      return res.status(400).json({
        message: "Email or NIN is required",
      });
    }

    // check existing user
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1 OR nin=$2",
      [email || null, nin || null]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (full_name, email, nin, password, role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, full_name, email, nin, role`,
      [full_name, email || null, nin || null, hashedPassword, role]
    );

    res.status(201).json({
      message: "Registration successful",
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

/*
================================
LOGIN
================================
*/
exports.login = async (req, res) => {
  try {
    const { email, nin, password } = req.body;

    if ((!email && !nin) || !password) {
      return res.status(400).json({
        message: "Email/NIN and password required",
      });
    }

    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email=$1 OR nin=$2",
      [email || null, nin || null]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const user = userQuery.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        nin: user.nin,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};