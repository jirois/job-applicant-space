const jwt = require("jsonwebtoken");
// Middlware that protects routes requiring authentication
// Reads the JWT from the Authorization header, verifies it,
// and attaches the decoded user payload to req.user.

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expect format: 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload to request
    req.user = decoded; // {id, username, name}
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
