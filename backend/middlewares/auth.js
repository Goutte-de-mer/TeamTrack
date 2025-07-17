const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: "Vous devez être connecté" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    req.user = user;
    next();
  });
};

const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

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
