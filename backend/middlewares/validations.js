const { body, validationResult } = require("express-validator");
const User = require("../db/models/User");

const registerValidations = [
  body("userName")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Le nom d'utilisateur doit contenir entre 3 et 20 caractères")
    .matches(/^[a-zA-Z0-9_ -]+$/)
    .withMessage(
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, _ et -"
    )
    .custom(async (value) => {
      const user = await User.findOne({ userName: value });
      if (user) {
        throw new Error("Ce nom d'utilisateur est déjà pris");
      }
    }),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Email invalide")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Cet email est déjà utilisé");
      }
    }),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])/)
    .withMessage(
      "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial"
    ),

  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Les mots de passe ne correspondent pas");
      return true;
    }),
];

const loginValidations = [
  body("email").trim().isEmail().withMessage("Email invalide"),
];

const updateValidations = [
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email invalide")
    .custom(async (value, { req }) => {
      const user = await User.findOne({
        email: value,
        _id: { $ne: req.user.id },
      });
      if (user) {
        throw new Error("Cet email est déjà pris");
      }
    }),
  body("userName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Le nom d'utilisateur doit contenir entre 3 et 20 caractères")
    .matches(/^[a-zA-Z0-9_ -]+$/)
    .withMessage(
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, _ et -"
    )
    .custom(async (value, { req }) => {
      const user = await User.findOne({
        userName: value,
        _id: { $ne: req.user.id },
      });
      if (user) {
        throw new Error("Ce nom d'utilisateur est déjà pris");
      }
    }),
];

const handleValidationErros = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }
  next();
};

module.exports = {
  registerValidations,
  handleValidationErros,
  loginValidations,
  updateValidations,
};
