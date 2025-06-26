var express = require("express");
var router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middlewares/auth");
const {
  handleValidationErros,
  createTaskValidations,
  validateIdParam,
} = require("../middlewares/validations");

router.post(
  "/new",
  authenticateToken,
  createTaskValidations,
  handleValidationErros,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      console.log(userId);
      const result = await taskController.createTask(req.body, userId);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/:id",
  authenticateToken,
  validateIdParam,
  handleValidationErros,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const taskId = req.params.id;

      const task = await taskController.getTaskById(userId, taskId);
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  validateIdParam,
  handleValidationErros,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const taskId = req.params.id;

      const result = await taskController.deleteTaskById(userId, taskId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
