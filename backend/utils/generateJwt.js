const jwt = require("jsonwebtoken");

const generateToken = (userId, userName) => {
  token = jwt.sign({ userName, userId }, process.env.TOKEN_SECRET, {
    expiresIn: "7h",
  });
  return token;
};

module.exports = { generateToken };
