const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "YourSuperSecretJWTKey123!";

exports.register = async (req, res) => {
  const { full_name, password, role, nin, email } = req.body;
  const pool = req.app.locals.pool;

  try {
    // Validate
    if (!full_name || !password || !role || (!nin && !email)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const identifier = role === "citizen" ? nin : email;

    // Check if user exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE nin = $1 OR email = $2",
      [nin || null, email || null]
    );
    if (userCheck.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const result = await pool.query(
      "INSERT INTO users (full_name, role, nin, email, password) VALUES ($1,$2,$3,$4,$5) RETURNING id, full_name, role, nin, email",
      [full_name, role, nin || null, email || null, hashedPassword]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { identifier, password, role } = req.body;
  const pool = req.app.locals.pool;

  try {
    if (!identifier || !password || !role)
      return res.status(400).json({ message: "Missing required fields" });

    // Find user
    const userResult = await pool.query(
      role === "citizen"
        ? "SELECT * FROM users WHERE nin = $1"
        : "SELECT * FROM users WHERE email = $1",
      [identifier]
    );

    const user = userResult.rows[0];
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};