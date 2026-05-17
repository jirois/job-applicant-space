const express = require("express");
const { pool } = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// --- Get All Jobs (public) ---
router.get("/", async (req, res) => {
  const { search, type } = req.query;

  // Build query dynamically based on filters
  let query = `
        SELECT jobs.*, users.username as posted_by
        FROM jobs
        JOIN users ON jobs.user_id = users.id
        WHERE 1=1
    `;
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (jobs.title ILIKE $${params.length} OR jobs.company ILIKE $${params.length})`;
  }

  if (type) {
    params.push(type);
    query += `AND job.type = $${params.length}`;
  }

  query += " ORDER BY jobs.created_at DESC";

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// --- Post a Job (protected) ---
router.post("/", authMiddleware, async (req, res) => {
  const { title, company, location, type, description } = req.body;

  if (!title || !company || !description)
    return res
      .status(400)
      .json({ error: "Title, company, and description are required" });

  try {
    const result = await pool.query(
      `INSERT INTO jobs (title, company, location, type, description, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
      [title, company, location, type, description, req.user.id],
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// --- Delete a Job (protected, owner only) ---
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM jobs WHERE id = $1`, [
      req.params.id,
    ]);
    const job = result.rows[0];
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Only the user who posted the job can delete it
    if (job.user_id !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });
    await pool.query(`DELETE FROM jobs WHERE id = $1`, [req.params.id]);
    res.json({ message: "Job deleted" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
