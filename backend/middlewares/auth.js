const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    req.user = user; // Stocke les infos du token dans req.user
    next();
  });
};

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ error: "Vous devez être connecté" });

    jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (error) {
    return res.status(403).json({
      msg: "Token invalide",
      error: error.message,
    });
  }
};

module.exports = { authenticateToken, requireAuth };
