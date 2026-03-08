const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { full_name, password, role, nin, email } = req.body;
  const pool = req.app.locals.pool;

  try {

    if (!full_name || !password || !role) {
      return res.status(400).json({
        message: "Full name, password and role are required"
      });
    }

    if (role === "citizen" && !nin) {
      return res.status(400).json({
        message: "NIN is required for citizens"
      });
    }

    if (role !== "citizen" && !email) {
      return res.status(400).json({
        message: "Email is required for officials"
      });
    }

    // check if user exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE nin=$1 OR email=$2",
      [nin || null, email || null]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, role, nin, email, password)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, full_name, role, nin, email`,
      [full_name, role, nin || null, email || null, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
      token
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Registration failed",
      error: err.message
    });
  }
};


exports.login = async (req, res) => {

  const { identifier, password, role } = req.body;
  const pool = req.app.locals.pool;

  try {

    if (!identifier || !password || !role) {
      return res.status(400).json({
        message: "Missing login credentials"
      });
    }

    const query =
      role === "citizen"
        ? "SELECT * FROM users WHERE nin=$1"
        : "SELECT * FROM users WHERE email=$1";

    const result = await pool.query(query, [identifier]);

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
        nin: user.nin,
        email: user.email
      },
      token
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Login failed",
      error: err.message
    });

  }

};