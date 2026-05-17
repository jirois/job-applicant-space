const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

const router = express.Router();

// --- Register ---
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    // Hash password with cost factor 10 -- good balance of speed and security
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email`,
      [username, email, hashed],
    );
    const user = result.rows[0];

    // Sign JWT -- expires in 7 days so users stay logged in
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({ user, token });
  } catch (error) {
    // PostgreSQL unique violation code - email or username already taken
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "Email or username already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// --- Login ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    // Use generic error --don't reveal whether email exists
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Send only the email and token back, not the password not even the hashed one
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
