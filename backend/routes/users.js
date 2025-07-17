var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const {
  registerValidations,
  loginValidations,
  handleValidationErros,
  updateValidations,
} = require("../middlewares/validations");
const { authenticateToken, requireAuth } = require("../middlewares/auth");

router.get("/", requireAuth, async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/check-cookie", authenticateToken, (req, res) => {
  if (req.user)
    return res.status(200).json({ authenticated: true, user: req.user });
  return res.status(401).json({ authenticated: false });
});

router.post(
  "/register",
  registerValidations,
  handleValidationErros,
  async (req, res) => {
    try {
      const result = await userController.registerUser(req.body);
      return res
        .status(201)
        .cookie("auth_token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600000,
        })
        .json(result.user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/login",
  loginValidations,
  handleValidationErros,
  async (req, res) => {
    try {
      const result = await userController.loginUser(req.body);
      return res
        .status(200)
        .cookie("auth_token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600000,
        })
        .json(result.user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.patch(
  "/update",
  authenticateToken,
  updateValidations,
  handleValidationErros,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { userName, email } = req.body;

      if (!userName && !email) {
        return res
          .status(400)
          .json({ error: "Nom d'utilisateur ou email requis" });
      }

      const updatedUser = await userController.updateUser(
        userName,
        email,
        userId
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
