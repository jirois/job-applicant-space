const { Pool } = require("pg");
require("dotenv").config({ quiet: true });

// Connection pool -- reuses connections instead of opening a new one per query
// In production this critical for performance under load.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // In production (Railway),  SSL is required
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Create tables if they don't exist - runs on server start.
// Using IF NOT EXISTS makes this safe to run multiple times.
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        company VARCHAR(100) NOT NULL,
        location VARCHAR(100),
        type VARCHAR(50),
        description TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("DB Init Error:", err.message);
  }
};
module.exports = { pool, initDB };
