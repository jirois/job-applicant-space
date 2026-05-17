const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDB } = require("./db");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Health check -- useful for Railway deployment
app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;

// Initialize DB tables then start server
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
