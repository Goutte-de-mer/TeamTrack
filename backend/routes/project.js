var express = require("express");
var router = express.Router();
const projectController = require("../controllers/projectControlle");
const { handleValidationErros } = require("../middlewares/validations");
const { authenticateToken, requireAuth } = require("../middlewares/auth");

module.exports = router;
