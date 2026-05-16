const express = require("express");
const { pool, initDB } = require("./db");

const app = express();

app.use(express.json());

// initialize DB
initDB();

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "PostgreSQL connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
